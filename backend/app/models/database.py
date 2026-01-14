from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean, Date, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="client")  # 'client' or 'coach'
    client_code = Column(String, unique=True, index=True)  # Unique code for coach linking
    dietary_restrictions = Column(JSON, default=list)
    preferences = Column(JSON, default=dict)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    family = relationship("Family", back_populates="members")
    meals = relationship("Meal", back_populates="user")
    grocery_items = relationship("GroceryItem", back_populates="user")


class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    members = relationship("User", back_populates="family")


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    instructions = Column(Text, nullable=False)
    prep_time = Column(Integer)
    cook_time = Column(Integer)
    servings = Column(Integer)
    difficulty = Column(String)
    image_url = Column(String)
    source_url = Column(String)
    tags = Column(JSON, default=list)
    ingredients = Column(JSON, default=list)
    nutritional_info = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    user = relationship("User")


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    meal_type = Column(String)  # breakfast, lunch, dinner, snack
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notes = Column(Text)
    planned = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="meals")
    recipe = relationship("Recipe")


class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    quantity = Column(Float, default=1)
    unit = Column(String)
    category = Column(String)
    expiration_date = Column(Date)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="grocery_items")


class CoachClient(Base):
    """Association table linking coaches to their clients"""
    __tablename__ = "coach_clients"

    id = Column(Integer, primary_key=True, index=True)
    coach_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)  # Client has one coach
    created_at = Column(DateTime, default=datetime.utcnow)

    coach = relationship("User", foreign_keys=[coach_id])
    client = relationship("User", foreign_keys=[client_id])

