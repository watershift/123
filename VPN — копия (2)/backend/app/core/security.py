
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from cryptography.fernet import Fernet
import os
from ..db import get_db
from ..models.user import User, UserRole
from .jwt import decode_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Ключ шифрования ключей WireGuard (хранить в ENV)
FERNET_KEY = os.environ.get("FERNET_KEY")
if not FERNET_KEY:
    raise RuntimeError("FERNET_KEY environment variable not set")
cipher = Fernet(FERNET_KEY.encode())

def encrypt_private_key(key: str) -> str:
    return cipher.encrypt(key.encode()).decode()

def decrypt_private_key(encrypted_key: str) -> str:
    return cipher.decrypt(encrypted_key.encode()).decode()

async def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only access")
    return current_user
