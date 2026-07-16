from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import UserSignIn, UserSignUp, UserResponse, SignInResponse

from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def signup(payload: UserSignUp, db: Session = Depends(get_db)):
    return auth_service.signup(db, payload)


@router.post(
    "/signin", response_model=SignInResponse, status_code=status.HTTP_201_CREATED
)
def signin(payload: UserSignIn, db: Session = Depends(get_db)):
    return auth_service.signin(db, payload)
