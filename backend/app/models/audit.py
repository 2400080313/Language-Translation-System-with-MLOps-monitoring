from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_email = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False, index=True)
    resource = Column(String(255), nullable=False)
    details = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    version = Column(String(50), nullable=False, unique=True)
    framework = Column(String(100), default="PyTorch / Transformers")
    bleu_benchmark = Column(String(50), default="38.6")
    chrf_benchmark = Column(String(50), default="61.2")
    is_active = Column(String(10), default="true")
    deployed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
