from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import date, datetime, timedelta

from app.models.database import get_db, Meal, Recipe, User
from app.schemas.schemas import MealCreate, MealUpdate, MealResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[MealResponse])
async def get_meals(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    meal_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Meal).options(joinedload(Meal.recipe)).filter(Meal.user_id == current_user.id)
    
    if start_date:
        query = query.filter(Meal.date >= start_date)
    if end_date:
        query = query.filter(Meal.date <= end_date)
    if meal_type:
        query = query.filter(Meal.meal_type == meal_type)
    
    meals = query.order_by(Meal.date, Meal.meal_type).offset(skip).limit(limit).all()
    return meals


@router.get("/week", response_model=List[MealResponse])
async def get_weekly_meals(
    week_start: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If no date provided, default to current week (Mon-Sun)
    if not week_start:
        today = date.today()
        week_start = today - timedelta(days=today.weekday())
    
    week_end = week_start + timedelta(days=6)
    
    # Fetch all meals for the week, including recipe details for UI display
    meals = db.query(Meal).options(joinedload(Meal.recipe)).filter(
        Meal.user_id == current_user.id,
        Meal.date >= week_start,
        Meal.date <= week_end
    ).order_by(Meal.date, Meal.meal_type).all()
    
    return meals


@router.get("/{meal_id}", response_model=MealResponse)
async def get_meal(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = db.query(Meal).options(joinedload(Meal.recipe)).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal


@router.post("/", response_model=MealResponse)
async def create_meal(
    meal: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if meal.recipe_id:
        recipe = db.query(Recipe).filter(Recipe.id == meal.recipe_id).first()
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
    
    db_meal = Meal(**meal.model_dump(), user_id=current_user.id)
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    # Reload relation
    db_meal = db.query(Meal).options(joinedload(Meal.recipe)).filter(Meal.id == db_meal.id).first()
    return db_meal


@router.put("/{meal_id}", response_model=MealResponse)
async def update_meal(
    meal_id: int,
    meal: MealUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not db_meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    if meal.recipe_id is not None:
        recipe = db.query(Recipe).filter(Recipe.id == meal.recipe_id).first()
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
    
    update_data = meal.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_meal, field, value)
    
    db.commit()
    db.refresh(db_meal)
    # Reload relation
    db_meal = db.query(Meal).options(joinedload(Meal.recipe)).filter(Meal.id == db_meal.id).first()
    return db_meal


@router.delete("/{meal_id}")
async def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not db_meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    db.delete(db_meal)
    db.commit()
    return {"message": "Meal deleted successfully"}


@router.post("/generate-week")
async def generate_weekly_plan(
    start_date: Optional[date] = None,
    preferences: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not start_date:
        start_date = date.today()
    
    # Auto-generate empty placeholders for 3 meals/day for the next week
    # This allows users to easily tap and fill slots
    meal_types = ["breakfast", "lunch", "dinner"]
    generated_meals = []
    
    for day_offset in range(7):
        current_date = start_date + timedelta(days=day_offset)
        
        for meal_type in meal_types:
            db_meal = Meal(
                date=current_date,
                meal_type=meal_type,
                user_id=current_user.id,
                planned=True,
                notes=f"Auto-generated for {preferences}" if preferences else None
            )
            db.add(db_meal)
            generated_meals.append(db_meal)
    
    db.commit()
    for meal in generated_meals:
        db.refresh(meal)
    
    return {"message": "Weekly meal plan generated", "meals": [MealResponse.model_validate(m) for m in generated_meals]}
