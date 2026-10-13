from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.translation import Translation
from backend.app.models.audit import AuditLog
from backend.app.schemas.user import UserOut, UserRoleUpdate, UserStatusUpdate
from backend.app.api.deps import get_current_admin

router = APIRouter(prefix="/users", tags=["User Management (Admin)"])

@router.get("", response_model=List[UserOut])
def list_users(
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    query = db.query(User)
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) | (User.full_name.ilike(f"%{search}%"))
        )
    users = query.offset(skip).limit(limit).all()

    # Enrich with translation count
    results = []
    for u in users:
        count = db.query(func.count(Translation.id)).filter(Translation.user_id == u.id).scalar()
        out = UserOut.model_validate(u)
        out.translations_count = count or 0
        results.append(out)

    return results

@router.put("/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: int,
    req: UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    if req.role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'user' or 'admin'.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    old_role = user.role
    user.role = req.role
    db.commit()
    db.refresh(user)

    audit = AuditLog(
        user_id=admin.id,
        user_email=admin.email,
        action="UPDATE_USER_ROLE",
        resource=f"user:{user.id}",
        details=f"Admin {admin.email} changed role of user {user.email} from {old_role} to {req.role}."
    )
    db.add(audit)
    db.commit()

    return user

@router.put("/{user_id}/status", response_model=UserOut)
def update_user_status(
    user_id: int,
    req: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = req.is_active
    db.commit()
    db.refresh(user)

    audit = AuditLog(
        user_id=admin.id,
        user_email=admin.email,
        action="UPDATE_USER_STATUS",
        resource=f"user:{user.id}",
        details=f"Admin {admin.email} set active status of user {user.email} to {req.is_active}."
    )
    db.add(audit)
    db.commit()

    return user
