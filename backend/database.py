from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

SQLALCHEMY_DATABASE_URL = f'postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}'


engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    """Test database connection."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("Database connection successful!")
            print(f"Database: {settings.database_name}")
            print(f"Host: {settings.database_hostname}:{settings.database_port}")
            print(f"User: {settings.database_username}")
    except Exception as e:
        print(f"Error connecting to database: {e}")
        print("Please check your .env file contains:")
        print("  - database_hostname")
        print("  - database_port")
        print("  - database_username")
        print("  - database_password")
        print("  - database_name")