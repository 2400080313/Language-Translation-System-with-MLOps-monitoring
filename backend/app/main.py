import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from backend.app.core.config import settings
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.core.security import get_password_hash
from backend.app.models.user import User
from backend.app.models.translation import Translation
from backend.app.models.audit import AuditLog
from backend.app.api.v1 import auth, users, translate, metrics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)

    # Initial Admin Provisioning (safe, idempotent)
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.INITIAL_ADMIN_EMAIL).first()
        if not admin_user:
            admin_user = User(
                email=settings.INITIAL_ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.INITIAL_ADMIN_PASSWORD),
                full_name=settings.INITIAL_ADMIN_NAME,
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print(f"[SECURITY] Initial admin provisioned: {settings.INITIAL_ADMIN_EMAIL}")

        # Seed sample standard user for academic demonstration
        demo_user = db.query(User).filter(User.email == "researcher@translateml.edu").first()
        if not demo_user:
            demo_user = User(
                email="researcher@translateml.edu",
                hashed_password=get_password_hash("UserSecret2026!"),
                full_name="Academic Researcher",
                role="user",
                is_active=True
            )
            db.add(demo_user)
            db.commit()
    finally:
        db.close()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade Neural Machine Translation system with Prometheus telemetry, BLEU evaluation, and data drift monitoring.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus /metrics endpoint
@app.get("/metrics", tags=["Monitoring"])
def metrics_endpoint():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

# Health & Readiness checks
@app.get("/health", tags=["Monitoring"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected"
    }

@app.get("/ready", tags=["Monitoring"])
def readiness_check():
    return {
        "ready": True,
        "active_model": settings.ACTIVE_MODEL_NAME,
        "version": settings.ACTIVE_MODEL_VERSION
    }

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(translate.router, prefix=settings.API_V1_STR)
app.include_router(metrics.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
