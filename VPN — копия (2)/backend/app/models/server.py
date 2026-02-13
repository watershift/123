
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Index
import enum
import datetime
from .base import Base

class ServerStatus(str, enum.Enum):
    ACTIVE = "active"
    DOWN = "down"
    DRAINING = "draining"
    MAINTENANCE = "maintenance"

class Server(Base):
    __tablename__ = "servers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ip = Column(String, unique=True, index=True, nullable=False)
    region = Column(String, index=True, default="europe")
    
    status = Column(Enum(ServerStatus), default=ServerStatus.ACTIVE)
    
    max_peers = Column(Integer, default=500)
    current_peers = Column(Integer, default=0, index=True)
    
    cpu_load = Column(Float, default=0.0)
    memory_usage = Column(Float, default=0.0)
    
    # Security
    public_key = Column(String)
    private_key_encrypted = Column(String) # Encrypted with Fernet
    agent_token = Column(String) # Secret token for this server's agent
    
    # Health Monitoring
    fail_count = Column(Integer, default=0)
    last_check_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        Index('idx_server_selection', 'status', 'region', 'current_peers'),
    )
