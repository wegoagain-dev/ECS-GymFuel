from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.database import get_db, User, CoachClient, Meal, Recipe
from app.schemas.schemas import (
    LinkClientRequest,
    ClientSummary,
    CoachSummary,
    MealResponse,
    RecipeResponse
)
from app.api.auth import get_current_user

router = APIRouter()


@router.post("/link/", response_model=dict)
async def link_client(
    request: LinkClientRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Coach links a client using their email and unique client code."""
    if current_user.role != "coach":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can link clients"
        )
    
    # Find the client by email
    client = db.query(User).filter(User.email == request.client_email).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Verify the client code
    if client.client_code != request.client_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid client code"
        )
    
    # Check if client is already linked to another coach
    existing_link = db.query(CoachClient).filter(CoachClient.client_id == client.id).first()
    if existing_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Client is already linked to a coach"
        )
    
    # Create the coach-client relationship
    coach_client = CoachClient(
        coach_id=current_user.id,
        client_id=client.id
    )
    db.add(coach_client)
    db.commit()
    
    return {"message": f"Successfully linked to client {client.username}"}


@router.delete("/unlink/{client_id}", response_model=dict)
async def unlink_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Coach unlinks a client."""
    if current_user.role != "coach":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can unlink clients"
        )
    
    link = db.query(CoachClient).filter(
        CoachClient.coach_id == current_user.id,
        CoachClient.client_id == client_id
    ).first()
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client link not found"
        )
    
    db.delete(link)
    db.commit()
    
    return {"message": "Successfully unlinked client"}


@router.get("/clients/", response_model=List[ClientSummary])
async def get_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Coach retrieves list of their linked clients."""
    if current_user.role != "coach":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can view clients"
        )
    
    links = db.query(CoachClient).filter(CoachClient.coach_id == current_user.id).all()
    clients = [link.client for link in links]
    
    return clients


@router.get("/clients/{client_id}/meals", response_model=List[MealResponse])
async def get_client_meals(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Coach views a specific client's meals."""
    if current_user.role != "coach":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can view client meals"
        )
    
    # Verify the coach is linked to this client
    link = db.query(CoachClient).filter(
        CoachClient.coach_id == current_user.id,
        CoachClient.client_id == client_id
    ).first()
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not linked to this client"
        )
    
    # Get the client's meals
    meals = db.query(Meal).filter(Meal.user_id == client_id).order_by(Meal.date.desc()).all()
    
    return meals


@router.get("/clients/{client_id}/recipes", response_model=List[RecipeResponse])
async def get_client_recipes(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Coach views a specific client's recipes."""
    if current_user.role != "coach":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can view client recipes"
        )
    
    # Verify the coach is linked to this client
    link = db.query(CoachClient).filter(
        CoachClient.coach_id == current_user.id,
        CoachClient.client_id == client_id
    ).first()
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not linked to this client"
        )
    
    # Get the client's recipes
    recipes = db.query(Recipe).filter(Recipe.user_id == client_id).order_by(Recipe.created_at.desc()).all()
    
    return recipes


@router.get("/my-coach/", response_model=CoachSummary)
async def get_my_coach(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Client views their linked coach."""
    link = db.query(CoachClient).filter(CoachClient.client_id == current_user.id).first()
    
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not linked to a coach"
        )
    
    return link.coach
