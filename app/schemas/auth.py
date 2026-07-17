from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserSignUp(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str


class UserSignIn(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


class SignInResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
