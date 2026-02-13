
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from .base import Base

class VPNUser(Base):
    __tablename__ = "vpn_users"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    server_id = Column(Integer, ForeignKey("servers.id"), nullable=False)
    public_key = Column(String, nullable=False)
    private_key = Column(String, nullable=False)
    internal_ip = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
