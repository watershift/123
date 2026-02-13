
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
import datetime
from .base import Base

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="pending") # pending, completed, failed
    provider = Column(String, default="mock")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
