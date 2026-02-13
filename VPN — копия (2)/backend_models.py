
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Partner(Base):
    __tablename__ = "partners"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    full_name = Column(String)
    bots = relationship("Bot", back_populates="owner")

class Bot(Base):
    __tablename__ = "bots"
    id = Column(String, primary_key=True) # bot_token_hash or id
    name = Column(String)
    token = Column(String)
    owner_id = Column(Integer, ForeignKey("partners.id"))
    commission_rate = Column(Float, default=20.0)
    theme_config = Column(JSON) # Store colors, logo urls
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner = relationship("Partner", back_populates="bots")
    users = relationship("User", back_populates="bot")

class Server(Base):
    __tablename__ = "servers"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    ip_address = Column(String)
    location = Column(String)
    status = Column(String, default="online")
    current_load = Column(Float, default=0.0)
    protocol = Column(String, default="amnezia_xray")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    tg_id = Column(String, unique=True)
    bot_id = Column(String, ForeignKey("bots.id"))
    balance = Column(Float, default=0.0)
    subscription_end = Column(DateTime)
    
    bot = relationship("Bot", back_populates="users")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String)
