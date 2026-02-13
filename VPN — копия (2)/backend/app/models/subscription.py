
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
import datetime
from .base import Base

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    status = Column(String, default="active") # active, expired, cancelled
    plan = Column(String, default="standard")
