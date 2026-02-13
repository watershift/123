
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.user import User, UserRole
from ..core.security import pwd_context, get_current_user
from ..core.jwt import create_access_token
from ..schemas.auth import LoginRequest, RegisterRequest
from ..schemas.user import UserResponse
from ..config import settings
import secrets

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Если пользователей вообще нет, первый становится админом
    user_count = db.query(User).count()
    role = UserRole.ADMIN if user_count == 0 else UserRole.USER
    
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=request.email,
        password_hash=pwd_context.hash(request.password),
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
async def login(request: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not pwd_context.verify(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(data={"sub": user.email})
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True, 
        samesite="strict",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    
    csrf_token = secrets.token_hex(32)
    response.set_cookie(key="csrf_token", value=csrf_token, httponly=False, samesite="strict", path="/")
    
    return {"status": "ok", "role": user.role, "csrf_token": csrf_token}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("csrf_token", path="/")
    return {"status": "logged out"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
