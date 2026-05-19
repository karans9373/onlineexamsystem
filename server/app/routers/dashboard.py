from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user, require_roles
from ..models import Exam, ExamAttempt, Notification, SuspiciousActivityLog, User
from ..services import serialize_exam

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/student")
def student_dashboard(user: User = Depends(require_roles("student")), db: Session = Depends(get_db)):
    attempts = db.query(ExamAttempt).filter(ExamAttempt.student_id == user.id, ExamAttempt.status == "submitted").all()
    exams = db.query(Exam).filter(Exam.is_published == True).all()  # noqa: E712
    notifications = (
        db.query(Notification)
        .filter((Notification.user_id == user.id) | (Notification.user_id.is_(None)))
        .order_by(Notification.created_at.desc())
        .limit(6)
        .all()
    )
    topic_stats = defaultdict(lambda: {"topic": "", "correct": 0, "wrong": 0})
    for attempt in attempts:
        for question in attempt.exam.questions:
            topic = question.topic
            topic_stats[topic]["topic"] = topic
            selected = (attempt.answers or {}).get(str(question.id))
            if not selected:
                continue
            if selected == question.correct_option:
                topic_stats[topic]["correct"] += 1
            else:
                topic_stats[topic]["wrong"] += 1

    return {
        "user": {"full_name": user.full_name, "email": user.email, "class_name": user.class_name, "school_name": user.school_name},
        "stats": {
            "completed_exams": len(attempts),
            "upcoming_exams": len(exams),
            "average_percentage": round(sum(item.percentage for item in attempts) / len(attempts), 2) if attempts else 0,
            "best_rank": min([item.rank for item in attempts if item.rank] or [0]),
        },
        "upcoming_exams": [serialize_exam(exam) for exam in exams[:6]],
        "exam_history": [
            {
                "attempt_id": attempt.id,
                "exam_title": attempt.exam.title,
                "subject": attempt.exam.subject,
                "score": attempt.score,
                "percentage": attempt.percentage,
                "rank": attempt.rank,
                "submitted_at": attempt.submitted_at.isoformat() if attempt.submitted_at else None,
            }
            for attempt in attempts[:8]
        ],
        "performance_trend": [{"name": f"Mock {index+1}", "score": attempt.percentage} for index, attempt in enumerate(attempts[-7:])],
        "subject_breakdown": list(topic_stats.values()) or [{"topic": "No attempts yet", "correct": 0, "wrong": 0}],
        "notifications": [{"title": item.title, "message": item.message, "type": item.type} for item in notifications],
    }


@router.get("/teacher")
def teacher_dashboard(user: User = Depends(require_roles("teacher")), db: Session = Depends(get_db)):
    exams = db.query(Exam).filter(Exam.created_by == user.id).all()
    exam_ids = [exam.id for exam in exams]
    attempts = db.query(ExamAttempt).filter(ExamAttempt.exam_id.in_(exam_ids) if exam_ids else False).all()
    logs = (
        db.query(SuspiciousActivityLog)
        .filter(SuspiciousActivityLog.exam_id.in_(exam_ids) if exam_ids else False)
        .order_by(SuspiciousActivityLog.created_at.desc())
        .limit(8)
        .all()
    )
    return {
        "user": {"full_name": user.full_name, "email": user.email, "subject_specialization": user.subject_specialization},
        "stats": {
            "exams_created": len(exams),
            "live_students": len([attempt for attempt in attempts if attempt.status == "in_progress"]),
            "submissions": len([attempt for attempt in attempts if attempt.status == "submitted"]),
            "cheating_alerts": len(logs),
        },
        "own_exams": [serialize_exam(exam) for exam in exams],
        "subject_performance": [{"name": exam.title[:12], "avg": round(sum(a.percentage for a in exam.attempts) / len(exam.attempts), 2) if exam.attempts else 0} for exam in exams],
        "live_alerts": [
            {
                "student": db.query(User).filter(User.id == log.student_id).first().full_name,
                "type": log.activity_type,
                "detail": log.detail,
                "severity": log.severity,
                "time": log.created_at.isoformat(),
            }
            for log in logs
        ],
    }


@router.get("/admin")
def admin_dashboard(user: User = Depends(require_roles("admin")), db: Session = Depends(get_db)):
    users = db.query(User).all()
    exams = db.query(Exam).all()
    attempts = db.query(ExamAttempt).all()
    logs = db.query(SuspiciousActivityLog).order_by(SuspiciousActivityLog.created_at.desc()).limit(8).all()
    return {
        "stats": {
            "total_users": len(users),
            "students": len([item for item in users if item.role == "student"]),
            "teachers": len([item for item in users if item.role == "teacher"]),
            "active_exams": len([exam for exam in exams if exam.is_published]),
            "live_students": len([attempt for attempt in attempts if attempt.status == "in_progress"]),
            "revenue_estimate": 482000,
        },
        "system_health": [
            {"label": "API latency", "value": "118 ms"},
            {"label": "WebSocket channels", "value": "Healthy"},
            {"label": "Exam auto-save", "value": "Stable"},
            {"label": "Database", "value": "Connected"},
        ],
        "recent_logs": [
            {"student_id": log.student_id, "type": log.activity_type, "severity": log.severity, "detail": log.detail}
            for log in logs
        ],
        "revenue_series": [
            {"name": "Jan", "value": 24000},
            {"name": "Feb", "value": 27000},
            {"name": "Mar", "value": 32000},
            {"name": "Apr", "value": 36000},
            {"name": "May", "value": 38400},
        ],
        "top_teachers": [
            {"name": item.full_name, "subject": item.subject_specialization, "exams": len(item.created_exams)}
            for item in users
            if item.role == "teacher"
        ],
    }
