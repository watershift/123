
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    DATABASE_URL: str = "postgresql://vpnadmin:super_secret_password_123@db:5432/vpn_saas"
    SECRET_KEY: str = "production-secret-key-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    REDIS_URL: Optional[str] = "redis://redis:6379/0"
    MASTER_BOT_TOKEN: Optional[str] = None

settings = Settings()
