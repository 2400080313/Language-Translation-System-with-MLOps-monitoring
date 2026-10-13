import time
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.core.database import get_db
from backend.app.core.telemetry import (
    TRANSLATION_REQUESTS_TOTAL,
    TRANSLATION_LATENCY_SECONDS
)
from backend.app.models.user import User
from backend.app.models.translation import Translation
from backend.app.schemas.translation import (
    TranslateRequest,
    TranslateResponse,
    TranslationOut,
    TranslationListResponse
)
from backend.app.ml.inference import translation_engine
from backend.app.api.deps import get_optional_current_user, get_current_user

router = APIRouter(prefix="", tags=["Translation & History"])

@router.post("/translate", response_model=TranslateResponse)
def execute_translation(
    req: TranslateRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user)
):
    start = time.time()
    try:
        # Run inference
        res = translation_engine.translate(
            text=req.text,
            source_lang=req.source_lang.lower(),
            target_lang=req.target_lang.lower()
        )

        elapsed = time.time() - start

        # Update Prometheus metrics
        TRANSLATION_REQUESTS_TOTAL.labels(
            status="success",
            source_lang=req.source_lang,
            target_lang=req.target_lang,
            model=translation_engine.model_name
        ).inc()

        TRANSLATION_LATENCY_SECONDS.labels(
            model=translation_engine.model_name,
            source_lang=req.source_lang,
            target_lang=req.target_lang
        ).observe(elapsed)

        # Save to database
        db_rec = Translation(
            user_id=user.id if user else None,
            source_lang=res["source_lang"],
            target_lang=res["target_lang"],
            source_text=res["source_text"],
            translated_text=res["translated_text"],
            latency_ms=res["latency_ms"],
            token_count=res["token_count"],
            confidence=res["confidence"],
            bleu_score=res["bleu_score"],
            chrf_score=res["chrf_score"],
            is_favorite=False
        )
        db.add(db_rec)
        db.commit()
        db.refresh(db_rec)

        res["id"] = db_rec.id
        return res

    except ValueError as val_err:
        TRANSLATION_REQUESTS_TOTAL.labels(
            status="validation_error",
            source_lang=req.source_lang,
            target_lang=req.target_lang,
            model=translation_engine.model_name
        ).inc()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        TRANSLATION_REQUESTS_TOTAL.labels(
            status="internal_error",
            source_lang=req.source_lang,
            target_lang=req.target_lang,
            model=translation_engine.model_name
        ).inc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference failure: {str(exc)}"
        )

@router.get("/history", response_model=TranslationListResponse)
def list_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    pair: Optional[str] = None,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Translation)
    if user and user.role != "admin":
        query = query.filter(Translation.user_id == user.id)

    if search:
        query = query.filter(
            (Translation.source_text.ilike(f"%{search}%")) |
            (Translation.translated_text.ilike(f"%{search}%"))
        )

    if pair and pair != "all":
        parts = pair.split("-")
        if len(parts) == 2:
            query = query.filter(
                Translation.source_lang == parts[0],
                Translation.target_lang == parts[1]
            )

    total = query.count()
    items = query.order_by(desc(Translation.created_at))\
                 .offset((page - 1) * page_size)\
                 .limit(page_size)\
                 .all()

    return TranslationListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[TranslationOut.model_validate(it) for it in items]
    )

@router.get("/favorites", response_model=List[TranslationOut])
def list_favorites(
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Translation).filter(Translation.is_favorite == True)
    if user and user.role != "admin":
        query = query.filter(Translation.user_id == user.id)

    items = query.order_by(desc(Translation.created_at)).all()
    return [TranslationOut.model_validate(it) for it in items]

@router.put("/translations/{rec_id}/favorite", response_model=TranslationOut)
def toggle_favorite(
    rec_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user)
):
    rec = db.query(Translation).filter(Translation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Translation record not found")

    rec.is_favorite = not rec.is_favorite
    db.commit()
    db.refresh(rec)
    return TranslationOut.model_validate(rec)

@router.delete("/translations/{rec_id}")
def delete_translation(
    rec_id: int,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user)
):
    rec = db.query(Translation).filter(Translation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Translation record not found")

    db.delete(rec)
    db.commit()
    return {"message": "Translation deleted successfully"}
