from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import Field, validator


class Settings(BaseSettings):
    """Application settings loaded from .env file"""

    # Database settings
    database_hostname: str = Field(..., description="PostgreSQL hostname")
    database_port: str = Field(..., description="PostgreSQL port")
    database_password: str = Field(..., description="PostgreSQL password")
    database_name: str = Field(..., description="PostgreSQL database name")
    database_username: str = Field(..., description="PostgreSQL username")

    # TMDB API
    tmdb_access_token: Optional[str] = Field(None, description="TMDB API access token")
    # POSTMAN API
    postman_api_key: Optional[str] = Field(None, description="Postman API key")
    # GEMINI API
    gemini_access_token: Optional[str] = Field(None, description="Gemini API key")

    # JWT Authentication - REQUIRED for auth endpoints
    jwt_secret_key: str = Field(
        ...,
        description="Secret key for JWT token encoding (use openssl rand -hex 32 to generate)",
        min_length=32
    )
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    jwt_access_token_expire_minutes: int = Field(default=60, description="JWT token expiration in minutes")

    @validator("jwt_secret_key")
    def validate_jwt_secret_key(cls, v):
        """Ensure JWT secret key is sufficiently strong."""
        if len(v) < 32:
            raise ValueError(
                "jwt_secret_key must be at least 32 characters long. "
                "Generate a secure key using: openssl rand -hex 32"
            )
        return v

    class Config:
        env_file = ".env"
        extra = "allow"
        case_sensitive = False


try:
    settings = Settings()
except Exception as e:
    print("\n" + "=" * 70)
    print("ERROR: Failed to load settings from .env file")
    print("=" * 70)
    print(f"\nDetails: {str(e)}\n")
    print("Please ensure your .env file contains all required variables:")
    print("  - database_hostname, database_port, database_username")
    print("  - database_password, database_name")
    print("  - jwt_secret_key (min 32 chars, generate with: openssl rand -hex 32)")
    print("  - jwt_algorithm (default: HS256)")
    print("  - jwt_access_token_expire_minutes (default: 60)")
    print("\nSee .env.example for a template.\n")
    print("=" * 70 + "\n")
    raise
