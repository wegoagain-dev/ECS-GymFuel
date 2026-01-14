from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from typing import List, Dict, Optional
import json
import logging
from jose import jwt, JWTError

from app.core.config import settings
from app.models.database import SessionLocal, User

router = APIRouter()
logger = logging.getLogger(__name__)


def validate_ws_token(token: str) -> Optional[User]:
    """Validate JWT token and return user if valid."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.email == email.lower()).first()
            return user
        finally:
            db.close()
    except JWTError:
        return None


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, family_id: str):
        await websocket.accept()
        if family_id not in self.active_connections:
            self.active_connections[family_id] = []
        self.active_connections[family_id].append(websocket)

    def disconnect(self, websocket: WebSocket, family_id: str):
        if family_id in self.active_connections:
            self.active_connections[family_id].remove(websocket)
            if not self.active_connections[family_id]:
                del self.active_connections[family_id]

    async def broadcast(self, message: dict, family_id: str):
        if family_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[family_id]:
                try:
                    await connection.send_json(message)
                except:
                    disconnected.append(connection)
            
            for connection in disconnected:
                self.active_connections[family_id].remove(connection)


manager = ConnectionManager()


@router.websocket("/family/{family_id}")
async def websocket_family_sync(
    websocket: WebSocket,
    family_id: str,
    token: str = Query(...)
):
    # Validate JWT token
    user = validate_ws_token(token)
    if not user:
        await websocket.close(code=4001)  # Unauthorized
        return
    
    # Verify user belongs to this family
    if str(user.family_id) != family_id:
        await websocket.close(code=4003)  # Forbidden
        return
    
    user_id = str(user.id)
    
    try:
        await manager.connect(websocket, family_id)
        await websocket.send_json({
            "type": "connected",
            "message": f"User {user_id} connected to family {family_id}",
            "user_id": user_id
        })
        
        while True:
            data = await websocket.receive_json()
            
            message = {
                "type": data.get("type", "update"),
                "data": data.get("data", {}),
                "user_id": user_id,
                "timestamp": data.get("timestamp")
            }
            
            await manager.broadcast(message, family_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, family_id)
        await manager.broadcast({
            "type": "user_disconnected",
            "user_id": user_id,
            "message": f"User {user_id} disconnected"
        }, family_id)
    except Exception as e:
        manager.disconnect(websocket, family_id)
        logger.error(f"WebSocket error: {e}")


@router.get("/test")
async def websocket_test():
    return {
        "message": "WebSocket endpoint available",
        "endpoint": "/ws/family/{family_id}",
        "params": {
            "token": "JWT authentication token",
            "user_id": "Current user ID"
        }
    }
