from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_roles
from ..models import Exam, Question, User
from ..schemas import AIGeneratePayload
from ..services import generate_questions_with_ai

router = APIRouter(prefix="/teacher", tags=["ai"])


@router.post("/ai-generate")
def ai_generate_questions(payload: AIGeneratePayload, user: User = Depends(require_roles("teacher", "admin"))):
    questions = generate_questions_with_ai(payload.prompt, payload.question_count, payload.subject, payload.language_mode)
    return {"questions": questions}


@router.post("/ai-generate-and-attach")
def ai_generate_and_attach(
    exam_id: int,
    payload: AIGeneratePayload,
    user: User = Depends(require_roles("teacher", "admin")),
    db: Session = Depends(get_db),
):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        return {"message": "Exam not found"}
    questions = generate_questions_with_ai(payload.prompt, payload.question_count, payload.subject, payload.language_mode)
    next_index = exam.total_questions + 1
    for item in questions:
        db.add(
            Question(
                exam_id=exam.id,
                order_index=next_index,
                text_en=item["text_en"],
                text_hi=item.get("text_hi"),
                options=item["options"],
                correct_option=item["correct_option"],
                explanation=item.get("explanation"),
                difficulty=item.get("difficulty", "medium"),
                topic=item.get("topic", payload.subject),
                marks=float(item.get("marks", 1)),
            )
        )
        next_index += 1
    exam.total_questions += len(questions)
    exam.total_marks += sum(float(item.get("marks", 1)) for item in questions)
    db.commit()
    return {"message": f"{len(questions)} AI questions attached successfully", "questions": questions}
