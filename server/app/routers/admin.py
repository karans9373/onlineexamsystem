from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import require_roles
from ..models import Exam, SuspiciousActivityLog, User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users(user: User = Depends(require_roles("admin")), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": item.id,
            "full_name": item.full_name,
            "email": item.email,
            "role": item.role,
            "is_verified": item.is_verified,
            "is_blocked": item.is_blocked,
            "class_name": item.class_name,
            "subject_specialization": item.subject_specialization,
        }
        for item in users
    ]


@router.post("/users/{user_id}/toggle-block")
def toggle_user_block(user_id: int, _: User = Depends(require_roles("admin")), db: Session = Depends(get_db)):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.is_blocked = not target.is_blocked
    db.commit()
    return {"message": "User block status updated", "is_blocked": target.is_blocked}


@router.get("/system-stats")
def system_stats(user: User = Depends(require_roles("admin")), db: Session = Depends(get_db)):
    return {
        "total_users": db.query(User).count(),
        "total_exams": db.query(Exam).count(),
        "total_alerts": db.query(SuspiciousActivityLog).count(),
        "server": {"cpu": "32%", "memory": "58%", "bandwidth": "Healthy"},
    }
