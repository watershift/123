# backend/init_db.py
from backend.app.db import Base, engine
from backend.app.models.user import User, UserRole
from backend.app.models.server import Server

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created!")
