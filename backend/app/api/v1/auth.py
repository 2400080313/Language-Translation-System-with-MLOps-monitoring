from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.core.security import verify_password, get_password_hash, create_access_token
from backend.app.models.user import User
from backend.app.models.audit import AuditLog
from backend.app.schemas.auth import Token, LoginRequest, RegisterRequest
from backend.app.schemas.user import UserOut, UserUpdate
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    hashed = get_password_hash(req.password)
    new_user = User(
        email=req.email.lower(),
        hashed_password=hashed,
        full_name=req.full_name,
        role="user",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Audit log
    audit = AuditLog(
        user_id=new_user.id,
        user_email=new_user.email,
        action="USER_REGISTRATION",
        resource=f"user:{new_user.id}",
        details=f"User {new_user.email} registered."
    )
    db.add(audit)
    db.commit()

    token = create_access_token(new_user.id)
    return Token(access_token=token, user=UserOut.model_validate(new_user))

@router.post("/login", response_model=Token)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated")

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        user_email=user.email,
        action="USER_LOGIN",
        resource=f"user:{user.id}",
        details=f"User {user.email} logged in successfully."
    )
    db.add(audit)
    db.commit()

    token = create_access_token(user.id)
    return Token(access_token=token, user=UserOut.model_validate(user))

@router.post("/token", response_model=Token)
def login_oauth2_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username.lower()).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated")

    token = create_access_token(user.id)
    return Token(access_token=token, user=UserOut.model_validate(user))

@router.get("/me", response_model=UserOut)
def read_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_current_user_profile(
    req: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if req.full_name:
        current_user.full_name = req.full_name
    db.commit()
    db.refresh(current_user)
    return current_user
