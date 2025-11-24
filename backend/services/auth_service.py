from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from config import settings
from models import User
from schemas import UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Utility helpers for hashing, verifying, and issuing JWT tokens."""

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
        expire = datetime.utcnow() + (
            expires_delta or timedelta(minutes=settings.jwt_access_token_expire_minutes)
        )
        to_encode = {"sub": subject, "exp": expire}
        return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

    @staticmethod
    def decode_token(token: str) -> Optional[str]:
        """
        Decode and validate a JWT token.

        Args:
            token: JWT token string

        Returns:
            The subject (email) from the token, or None if invalid

        Raises:
            JWTError: If token is invalid, expired, or malformed
        """
        try:
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            subject = payload.get("sub")
            if subject is None:
                return None
            return subject
        except JWTError as e:
            # Log the error for debugging (in production, use proper logging)
            print(f"JWT decode error: {str(e)}")
            return None

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email.lower()).first()

    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> User:
        existing = AuthService.get_user_by_email(db, user_in.email)
        if existing:
            raise ValueError("Email already registered")

        user = User(
            email=user_in.email.lower(),
            hashed_password=AuthService.get_password_hash(user_in.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        user = AuthService.get_user_by_email(db, email)
        if not user or not AuthService.verify_password(password, user.hashed_password):
            return None
        return user
