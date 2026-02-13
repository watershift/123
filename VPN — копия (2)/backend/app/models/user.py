
from sqlalchemy import Column, Integer, String, DateTime, Enum
import datetime
import enum
from .base import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PARTNER = "partner"
    USER = "user"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
