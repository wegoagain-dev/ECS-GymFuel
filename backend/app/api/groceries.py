from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime, timedelta

from app.models.database import get_db, GroceryItem, User
from app.schemas.schemas import GroceryItemCreate, GroceryItemUpdate, GroceryItemResponse
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[GroceryItemResponse])
async def get_grocery_items(
    category: Optional[str] = None,
    expiring_soon: Optional[bool] = False,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(GroceryItem).filter(GroceryItem.user_id == current_user.id)
    
    if category:
        query = query.filter(GroceryItem.category == category)
    
    if expiring_soon:
        seven_days = date.today() + timedelta(days=7)
        query = query.filter(GroceryItem.expiration_date <= seven_days)
    
    items = query.order_by(GroceryItem.expiration_date).offset(skip).limit(limit).all()
    return items


@router.get("/expiring-soon", response_model=List[GroceryItemResponse])
async def get_expiring_items(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cutoff_date = date.today() + timedelta(days=days)
    items = db.query(GroceryItem).filter(
        GroceryItem.user_id == current_user.id,
        GroceryItem.expiration_date <= cutoff_date,
        GroceryItem.expiration_date >= date.today()
    ).order_by(GroceryItem.expiration_date).all()
    
    return items


@router.get("/{item_id}", response_model=GroceryItemResponse)
async def get_grocery_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(GroceryItem).filter(
        GroceryItem.id == item_id,
        GroceryItem.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    return item


@router.post("/", response_model=GroceryItemResponse)
async def create_grocery_item(
    item: GroceryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_item = GroceryItem(**item.model_dump(), user_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.post("/bulk", response_model=List[GroceryItemResponse])
async def create_bulk_grocery_items(
    items: List[GroceryItemCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    created_items = []
    for item_data in items:
        db_item = GroceryItem(**item_data.model_dump(), user_id=current_user.id)
        db.add(db_item)
        created_items.append(db_item)
    
    db.commit()
    for item in created_items:
        db.refresh(item)
    
    return [GroceryItemResponse.model_validate(item) for item in created_items]


@router.put("/{item_id}", response_model=GroceryItemResponse)
async def update_grocery_item(
    item_id: int,
    item: GroceryItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_item = db.query(GroceryItem).filter(
        GroceryItem.id == item_id,
        GroceryItem.user_id == current_user.id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    
    update_data = item.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/{item_id}")
async def delete_grocery_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_item = db.query(GroceryItem).filter(
        GroceryItem.id == item_id,
        GroceryItem.user_id == current_user.id
    ).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Grocery item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Grocery item deleted successfully"}
