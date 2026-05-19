from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import Notification, User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(Notification)
        .filter((Notification.user_id == user.id) | (Notification.user_id.is_(None)))
        .order_by(Notification.created_at.desc())
        .limit(10)
        .all()
    )
    return [{"id": item.id, "title": item.title, "message": item.message, "type": item.type, "is_read": item.is_read} for item in rows]
