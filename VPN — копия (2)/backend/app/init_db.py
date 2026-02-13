from backend.db import Base, engine
from backend.models.user import User, UserRole
from backend.models.server import Server

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created!")