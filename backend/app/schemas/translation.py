from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, List

class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Input text to translate")
    source_lang: str = Field(..., min_length=2, max_length=10)
    target_lang: str = Field(..., min_length=2, max_length=10)

class TranslateResponse(BaseModel):
    id: Optional[int] = None
    source_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    latency_ms: float
    token_count: int
    confidence: float
    bleu_score: Optional[float] = None
    chrf_score: Optional[float] = None
    model_name: str
    model_version: str
    timestamp: str

class TranslationOut(BaseModel):
    id: int
    user_id: Optional[int]
    source_lang: str
    target_lang: str
    source_text: str
    translated_text: str
    latency_ms: float
    token_count: int
    confidence: float
    bleu_score: Optional[float]
    chrf_score: Optional[float]
    is_favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TranslationListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[TranslationOut]
