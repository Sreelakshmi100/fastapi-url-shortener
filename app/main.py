import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import Base, engine, get_db

load_dotenv()

app = FastAPI(title="FastAPI URL Shortener")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = os.getenv("BASE_URL")

Base.metadata.create_all(bind=engine)


@app.get("/")
def health_check():
    return {"message": "URL Shortener API is running"}


@app.post("/api/v1/urls", response_model=schemas.URLResponse, status_code=201)
def create_short_url(url_data: schemas.URLCreate, db: Session = Depends(get_db)):
    try:
        db_url = crud.create_short_url(db, url_data)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    if db_url is None:
        raise HTTPException(status_code=400, detail="Custom alias already exists")

    return schemas.URLResponse(
        id=db_url.id,
        original_url=db_url.original_url,
        short_code=db_url.short_code,
        short_url=f"{BASE_URL}/{db_url.short_code}",
        clicks=db_url.clicks,
        created_at=db_url.created_at,
    )


@app.get("/{short_code}")
def redirect_to_original_url(short_code: str, db: Session = Depends(get_db)):
    db_url = crud.get_url_by_short_code(db, short_code)

    if db_url is None:
        raise HTTPException(status_code=404, detail="Short URL not found")

    crud.increment_click_count(db, db_url)

    return RedirectResponse(url=db_url.original_url)
