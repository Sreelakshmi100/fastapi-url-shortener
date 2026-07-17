import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.short_url import URLCreate, URLResponse

from app.services import shortener_service
from app.db.database import Base, engine, get_db
from dependencies import get_current_user

load_dotenv()
BASE_URL = os.getenv("BASE_URL")

router = APIRouter(tags=["Shortener"])


@router.get("/")
def health_check():
    return {"message": "URL Shortener API is running"}


@router.post("/api/v1/urls", response_model=URLResponse, status_code=201)
def create_short_url(
    url_data: URLCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        db_url = shortener_service.create_short_url(db, url_data, current_user)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if db_url is None:
        raise HTTPException(status_code=400, detail="Custom alias already exists")

    return URLResponse(
        id=db_url.id,
        original_url=db_url.original_url,
        short_code=db_url.short_code,
        short_url=f"{BASE_URL}/{db_url.short_code}",
        clicks=db_url.clicks,
        created_at=db_url.created_at,
    )


@router.get("/{short_code}")
def redirect_to_original_url(short_code: str, db: Session = Depends(get_db)):
    db_url = shortener_service.get_url_by_short_code(db, short_code)

    if db_url is None:
        raise HTTPException(status_code=404, detail="Short URL not found")

    shortener_service.increment_click_count(db, db_url)

    return RedirectResponse(url=db_url.original_url)
