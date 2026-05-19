from .admin import router as admin_router
from .ai import router as ai_router
from .auth import router as auth_router
from .dashboard import router as dashboard_router
from .exam import router as exam_router
from .notifications import router as notifications_router
from .websocket import router as websocket_router

__all__ = [
    "admin_router",
    "ai_router",
    "auth_router",
    "dashboard_router",
    "exam_router",
    "notifications_router",
    "websocket_router",
]
