from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict, Any
import datetime as dt
from datetime import datetime, date


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: str = "client"  # 'client' or 'coach'
    dietary_restrictions: List[str] = []
    preferences: Dict[str, Any] = {}


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator('password')
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v


class UserResponse(UserBase):
    id: int
    family_id: Optional[int] = None
    client_code: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: str
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = None
    image_url: Optional[str] = None
    source_url: Optional[str] = None
    tags: List[str] = []
    ingredients: List[Dict[str, Any]] = []
    nutritional_info: Dict[str, Any] = {}


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = None
    tags: Optional[List[str]] = None
    ingredients: Optional[List[Dict[str, Any]]] = None


class RecipeResponse(RecipeBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MealBase(BaseModel):
    date: date
    meal_type: str  # breakfast, lunch, dinner, snack
    recipe_id: Optional[int] = None
    notes: Optional[str] = None
    planned: bool = True


class MealCreate(MealBase):
    pass


class MealUpdate(BaseModel):
    date: Optional[dt.date] = None
    meal_type: Optional[str] = None
    recipe_id: Optional[int] = None
    notes: Optional[str] = None
    planned: Optional[bool] = None


class MealResponse(MealBase):
    id: int
    user_id: int
    created_at: datetime
    recipe: Optional[RecipeResponse] = None

    class Config:
        from_attributes = True


class GroceryItemBase(BaseModel):
    name: str
    quantity: float = 1.0
    unit: Optional[str] = None
    category: Optional[str] = None
    expiration_date: Optional[date] = None


class GroceryItemCreate(GroceryItemBase):
    pass


class GroceryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    expiration_date: Optional[date] = None


class GroceryItemResponse(GroceryItemBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============ Coach Feature Schemas ============

class LinkClientRequest(BaseModel):
    """Request to link a client to a coach"""
    client_email: EmailStr
    client_code: str


class ClientSummary(BaseModel):
    """Summary of a client for coach dashboard"""
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


class CoachSummary(BaseModel):
    """Summary of a coach for client view"""
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


class CoachClientResponse(BaseModel):
    """Response for coach-client relationship"""
    id: int
    coach: CoachSummary
    client: ClientSummary
    created_at: datetime

    class Config:
        from_attributes = True
