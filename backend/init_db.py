"""Initialize database tables"""
from app.models.database import Base, engine

if __name__ == "__main__":
    print("Creating database tables...")
    # create_all is safe: it only creates tables that don't exist
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
