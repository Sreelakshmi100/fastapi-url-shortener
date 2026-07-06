from datetime import datetime
from pydantic import BaseModel, HttpUrl
from typing import Optional


class URLCreate(BaseModel):
    original_url: HttpUrl
    custom_alias: Optional[str] = None


class URLResponse(BaseModel):
    id: int
    original_url: str
    short_code: str
    short_url: str
    clicks: int
    created_at: datetime

    class Config:
        from_attributes = True
