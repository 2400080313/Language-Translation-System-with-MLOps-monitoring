import pytest
from fastapi.testclient import TestClient
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.core.security import get_password_hash
from backend.app.core.config import settings
from backend.app.models.user import User
from backend.app.main import app

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed Admin
        admin = db.query(User).filter(User.email == settings.INITIAL_ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.INITIAL_ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.INITIAL_ADMIN_PASSWORD),
                full_name=settings.INITIAL_ADMIN_NAME,
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()

        # Seed Researcher
        researcher = db.query(User).filter(User.email == "researcher@translateml.edu").first()
        if not researcher:
            researcher = User(
                email="researcher@translateml.edu",
                hashed_password=get_password_hash("UserSecret2026!"),
                full_name="Academic Researcher",
                role="user",
                is_active=True
            )
            db.add(researcher)
            db.commit()
    finally:
        db.close()

    yield

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
