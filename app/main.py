from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.shortener import router as shortener_router
from app.api.auth import router as auth_router
from app.db.database import Base, engine

app = FastAPI(title="FastAPI URL Shortener")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(shortener_router)
app.include_router(auth_router)


@app.get("/")
def health_check():
    return {"message": "URL Shortener API is running"}
