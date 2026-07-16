from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import UserSignUp, UserSignIn, SignInResponse


def signup(db: Session, payload: UserSignUp):
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


def signin(db: Session, payload: UserSignIn):

    existing_user: User = None

    if payload.username:
        existing_user = db.query(User).filter(User.username == payload.username).first()

    elif payload.email:
        existing_user = db.query(User).filter(User.email == payload.email).first()

    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials"
        )

    if not verify_password(payload.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials",
        )
    access_token = create_access_token(data={"sub": str(existing_user.id)})

    return SignInResponse(
        access_token=access_token, token_type="bearer", user=existing_user
    )
