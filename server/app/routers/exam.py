from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import Exam, ExamAttempt, Question, User
from ..schemas import ExamAutosavePayload, ExamCreatePayload, SubmitExamPayload, SuspiciousPayload
from ..services import (
    build_attempt_analysis,
    create_notification,
    log_suspicious_activity,
    parse_uploaded_questions,
    refresh_exam_rankings,
    serialize_exam,
)
from ..websocket_manager import manager

router = APIRouter(tags=["exam"])


@router.get("/exams")
def list_exams(scope: str | None = Query(default=None), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(Exam).options(joinedload(Exam.creator)).filter(Exam.is_published == True)  # noqa: E712
    if user.role == "teacher":
        query = db.query(Exam).options(joinedload(Exam.creator)).filter((Exam.is_published == True) | (Exam.created_by == user.id))  # noqa: E712
    exams = query.order_by(Exam.created_at.desc()).all()
    now = datetime.utcnow()
    if scope == "live":
        exams = [exam for exam in exams if (exam.start_at is None or exam.start_at <= now) and (exam.end_at is None or exam.end_at >= now)]
    return [serialize_exam(exam) for exam in exams]


@router.post("/exams")
def create_exam(payload: ExamCreatePayload, user: User = Depends(require_roles("teacher", "admin")), db: Session = Depends(get_db)):
    exam = Exam(
        title=payload.title,
        description=payload.description,
        subject=payload.subject,
        exam_type=payload.exam_type,
        duration_minutes=payload.duration_minutes,
        negative_marking=payload.negative_marking,
        language_mode=payload.language_mode,
        instructions=payload.instructions,
        start_at=payload.start_at,
        end_at=payload.end_at,
        total_questions=len(payload.questions),
        total_marks=sum(question.marks for question in payload.questions),
        created_by=user.id,
    )
    db.add(exam)
    db.flush()
    for index, question in enumerate(payload.questions, start=1):
        db.add(
            Question(
                exam_id=exam.id,
                order_index=index,
                text_en=question.text_en,
                text_hi=question.text_hi,
                image_url=question.image_url,
                options=question.options,
                correct_option=question.correct_option,
                explanation=question.explanation,
                difficulty=question.difficulty,
                topic=question.topic,
                marks=question.marks,
            )
        )
    db.commit()
    db.refresh(exam)
    return serialize_exam(exam, include_questions=True, include_answers=True)


@router.post("/exams/{exam_id}/publish")
def publish_exam(exam_id: int, user: User = Depends(require_roles("teacher", "admin")), db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    if user.role == "teacher" and exam.created_by != user.id:
        raise HTTPException(status_code=403, detail="Cannot publish another teacher's exam")
    exam.is_published = True
    exam.status = "published"
    create_notification(db, "Exam published", f"{exam.title} is now visible to students.", "success")
    db.commit()
    return {"message": "Exam published successfully"}


@router.delete("/exams/{exam_id}")
def delete_exam(exam_id: int, user: User = Depends(require_roles("teacher", "admin")), db: Session = Depends(get_db)):
    exam = db.query(Exam).options(joinedload(Exam.attempts)).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    if user.role == "teacher" and exam.created_by != user.id:
        raise HTTPException(status_code=403, detail="Cannot delete another teacher's exam")
    title = exam.title
    db.delete(exam)
    create_notification(db, "Exam deleted", f"{title} has been removed from the platform.", "warning", user.id)
    db.commit()
    return {"message": "Exam deleted successfully", "exam_id": exam_id}


@router.get("/exams/{exam_id}")
def get_exam(exam_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    exam = db.query(Exam).options(joinedload(Exam.questions), joinedload(Exam.creator)).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    include_answers = user.role in {"teacher", "admin"}
    return serialize_exam(exam, include_questions=True, include_answers=include_answers)


@router.post("/exams/{exam_id}/start")
def start_exam(exam_id: int, user: User = Depends(require_roles("student")), db: Session = Depends(get_db)):
    exam = db.query(Exam).options(joinedload(Exam.questions)).filter(Exam.id == exam_id, Exam.is_published == True).first()  # noqa: E712
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not available")
    existing = (
        db.query(ExamAttempt)
        .filter(ExamAttempt.exam_id == exam_id, ExamAttempt.student_id == user.id, ExamAttempt.status == "in_progress")
        .first()
    )
    if existing:
        return {"attempt_id": existing.id, "exam": serialize_exam(exam, include_questions=True), "saved_state": existing.answers}
    attempt = ExamAttempt(exam_id=exam_id, student_id=user.id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return {"attempt_id": attempt.id, "exam": serialize_exam(exam, include_questions=True), "saved_state": {}}


@router.put("/exams/{exam_id}/autosave")
def autosave_exam(exam_id: int, payload: ExamAutosavePayload, user: User = Depends(require_roles("student")), db: Session = Depends(get_db)):
    attempt = (
        db.query(ExamAttempt)
        .filter(ExamAttempt.id == payload.attempt_id, ExamAttempt.exam_id == exam_id, ExamAttempt.student_id == user.id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    attempt.answers = payload.answers
    attempt.visited = payload.visited
    attempt.marked_for_review = payload.marked_for_review
    attempt.time_spent = payload.time_spent
    attempt.fullscreen_violations = payload.fullscreen_violations
    attempt.tab_switches = payload.tab_switches
    attempt.warnings_count = payload.warnings_count
    db.commit()
    return {"message": "Autosaved"}


@router.post("/exams/{exam_id}/suspicious-activity")
def suspicious_activity(exam_id: int, payload: SuspiciousPayload, user: User = Depends(require_roles("student")), db: Session = Depends(get_db)):
    attempt = db.query(ExamAttempt).options(joinedload(ExamAttempt.exam), joinedload(ExamAttempt.student)).filter(ExamAttempt.id == payload.attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    log_suspicious_activity(db, attempt, payload.activity_type, payload.detail, payload.severity)
    db.commit()
    return {"message": "Suspicious activity logged"}


@router.post("/exams/{exam_id}/submit")
async def submit_exam(exam_id: int, payload: SubmitExamPayload, user: User = Depends(require_roles("student")), db: Session = Depends(get_db)):
    attempt = (
        db.query(ExamAttempt)
        .options(joinedload(ExamAttempt.exam).joinedload(Exam.questions), joinedload(ExamAttempt.student))
        .filter(ExamAttempt.id == payload.attempt_id, ExamAttempt.exam_id == exam_id, ExamAttempt.student_id == user.id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    attempt.answers = payload.answers
    attempt.visited = payload.visited
    attempt.marked_for_review = payload.marked_for_review
    attempt.time_spent = payload.time_spent
    attempt.fullscreen_violations = payload.fullscreen_violations
    attempt.tab_switches = payload.tab_switches
    attempt.warnings_count = payload.warnings_count
    attempt.auto_submitted = payload.auto_submitted
    attempt.status = "submitted"
    attempt.submitted_at = datetime.utcnow()
    analysis = build_attempt_analysis(attempt)
    attempt.score = analysis["score"]
    attempt.percentage = analysis["percentage"]
    attempt.accuracy = analysis["accuracy"]
    refresh_exam_rankings(db, attempt.exam)
    create_notification(db, "Result published", f"Your result for {attempt.exam.title} is ready.", "success", user.id)
    db.commit()
    db.refresh(attempt)
    await manager.broadcast(f"leaderboard:{attempt.exam_id}", {"type": "leaderboard_updated", "exam_id": attempt.exam_id})
    await manager.broadcast(
        f"monitor:{attempt.exam_id}",
        {"type": "submission", "student": user.full_name, "score": attempt.score, "percentage": attempt.percentage},
    )
    return {
        "attempt_id": attempt.id,
        "rank": attempt.rank,
        "percentile": attempt.percentile,
        **analysis,
    }


@router.get("/results/{attempt_id}")
def result_details(attempt_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    attempt = (
        db.query(ExamAttempt)
        .options(joinedload(ExamAttempt.exam).joinedload(Exam.questions), joinedload(ExamAttempt.student))
        .filter(ExamAttempt.id == attempt_id)
        .first()
    )
    if not attempt:
        raise HTTPException(status_code=404, detail="Result not found")
    if user.role == "student" and attempt.student_id != user.id:
        raise HTTPException(status_code=403, detail="Cannot access another student's result")
    analysis = build_attempt_analysis(attempt)
    return {
        "student": attempt.student.full_name,
        "exam": serialize_exam(attempt.exam),
        "rank": attempt.rank,
        "percentile": attempt.percentile,
        "submitted_at": attempt.submitted_at.isoformat() if attempt.submitted_at else None,
        **analysis,
    }


@router.get("/leaderboard")
def leaderboard(exam_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    attempts = (
        db.query(ExamAttempt)
        .options(joinedload(ExamAttempt.student), joinedload(ExamAttempt.exam))
        .filter(ExamAttempt.exam_id == exam_id, ExamAttempt.status == "submitted")
        .order_by(ExamAttempt.rank.asc())
        .all()
    )
    return [
        {
            "rank": attempt.rank,
            "student_name": attempt.student.full_name,
            "score": attempt.score,
            "accuracy": attempt.accuracy,
            "time_taken_minutes": round(sum((attempt.time_spent or {}).values()) / 60, 2),
        }
        for attempt in attempts
    ]


@router.post("/teacher/import-questions")
async def import_questions(
    exam_id: int,
    file: UploadFile = File(...),
    user: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    exam = db.query(Exam).options(joinedload(Exam.questions)).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    file_bytes = await file.read()
    parsed = parse_uploaded_questions(file.filename, file_bytes)
    if not parsed:
        raise HTTPException(status_code=400, detail="No questions parsed from uploaded file")
    next_index = len(exam.questions) + 1
    for item in parsed:
        db.add(
            Question(
                exam_id=exam.id,
                order_index=next_index,
                text_en=item["text_en"],
                text_hi=item.get("text_hi"),
                image_url=item.get("image_url"),
                options=item["options"],
                correct_option=item["correct_option"],
                explanation=item.get("explanation"),
                difficulty=item.get("difficulty", "medium"),
                topic=item.get("topic", "Imported"),
                marks=float(item.get("marks", 1)),
            )
        )
        next_index += 1
    exam.total_questions += len(parsed)
    exam.total_marks += sum(float(item.get("marks", 1)) for item in parsed)
    db.commit()
    return {"message": f"{len(parsed)} questions imported successfully", "imported_count": len(parsed)}
