from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import Base, SessionLocal, engine
from .routers import admin_router, ai_router, auth_router, dashboard_router, exam_router, notifications_router, websocket_router
from .seed import seed_database

settings = get_settings()
app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    if settings.seed_demo_data:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()


@app.get(f"{settings.api_prefix}/health")
def health():
    return {"status": "ok", "product": settings.app_name, "environment": settings.environment}


for router in [auth_router, dashboard_router, exam_router, ai_router, admin_router, notifications_router]:
    app.include_router(router, prefix=settings.api_prefix)

app.include_router(websocket_router)
