from pydantic import BaseModel
from datetime import datetime

class SubscriptionBase(BaseModel):
    plan: str
    status: str
    expires_at: datetime

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
