import os
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/gymfuel"
    # SECRET_KEY: Required from environment variable for security
    # For local development, generate one with: python -c "import secrets; print(secrets.token_urlsafe(32))"
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "dev-secret-key-CHANGE-IN-PRODUCTION-" + ("x" * 32)
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    GEMINI_API_KEY: Optional[str] = None
    UNSPLASH_ACCESS_KEY: Optional[str] = None
    ALLOWED_ORIGINS: str = (
        ""  # For CORS - set via env var or leave empty for production
    )

    class Config:
        env_file = ".env"


settings = Settings()
