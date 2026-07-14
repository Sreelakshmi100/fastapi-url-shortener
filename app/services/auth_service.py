from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models.user import User
from app.schemas.auth import UserCreate


def signup(db: Session, payload: UserCreate):
    existing_email = db.query(User).filter(User.email == payload.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    existing_username = db.query(User).filter(User.username == payload.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
        )

    hashed_pw = hash_password(payload.password)

    user = User(
        username=payload.username, email=payload.email, hashed_password=hashed_pw
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
