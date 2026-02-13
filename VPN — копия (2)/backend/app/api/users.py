from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.user import User
from ..models.subscription import Subscription
from ..models.vpn_user import VPNUser
from ..core.security import get_current_user
from ..schemas.subscription import SubscriptionResponse
from typing import List

router = APIRouter()

@router.get("/subscription", response_model=List[SubscriptionResponse])
def get_user_subscription(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    subs = db.query(Subscription).filter(Subscription.user_id == current_user.id).all()
    return subs

@router.get("/vpn-config")
def get_vpn_config(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(VPNUser).filter(VPNUser.user_id == current_user.id, VPNUser.is_active == True).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No active VPN profile found")
    
    return {
        "profile_id": profile.id,
        "internal_ip": profile.internal_ip,
        "config_file": f"vpn_config_{profile.id}.conf",
        "status": "ready"
    }
