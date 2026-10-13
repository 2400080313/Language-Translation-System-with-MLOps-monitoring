import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Language Translation System with MLOps Monitoring"
    API_V1_STR: str = "/api/v1"
    
    # Security & JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "academic-mlops-translation-system-secret-key-2026-secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database URL: PostgreSQL default with SQLite fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./translateml.db"
    )
    
    # Initial Admin Provisioning
    INITIAL_ADMIN_EMAIL: str = os.getenv("INITIAL_ADMIN_EMAIL", "admin@translateml.edu")
    INITIAL_ADMIN_PASSWORD: str = os.getenv("INITIAL_ADMIN_PASSWORD", "AdminSecret2026!")
    INITIAL_ADMIN_NAME: str = os.getenv("INITIAL_ADMIN_NAME", "Prof. Translation Admin")
    
    # Model Configuration
    ACTIVE_MODEL_NAME: str = os.getenv("ACTIVE_MODEL_NAME", "M2M100-Indic-v2.1")
    ACTIVE_MODEL_VERSION: str = os.getenv("ACTIVE_MODEL_VERSION", "v2.1")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
