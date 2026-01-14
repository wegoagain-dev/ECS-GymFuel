"""
Image service for fetching meal/recipe images from Unsplash.
Optimized for fitness/gym-focused food photography.
"""
import httpx
from typing import Optional
from app.core.config import settings

UNSPLASH_URL = "https://api.unsplash.com/search/photos"


# This service fetches meal images from Unsplash to auto-populate recipe cards
# It adds "healthy meal" to search queries to get fitness-focused food photos

async def get_meal_image(query: str) -> Optional[str]:
    """
    Fetches a high-quality food image from Unsplash for the given query.
    Adds 'healthy meal' context to get fitness-appropriate images.
    
    Args:
        query: The meal/recipe name to search for (e.g., "Chicken and Rice")
        
    Returns:
        URL of the image, or None if not found or API not configured.
    """
    if not settings.UNSPLASH_ACCESS_KEY:
        return None
    
    # Add fitness context to get healthier-looking food photos
    search_query = f"{query} healthy meal"
    print(f"Image search: '{query}' -> '{search_query}'")
    
    headers = {"Authorization": f"Client-ID {settings.UNSPLASH_ACCESS_KEY}"}
    params = {
        "query": search_query,
        "per_page": 1,
        "orientation": "landscape",
        "content_filter": "high"
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(UNSPLASH_URL, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            
            if data.get("results") and len(data["results"]) > 0:
                return data["results"][0]["urls"]["regular"]
    except httpx.HTTPStatusError as e:
        print(f"Unsplash API error: {e.response.status_code}")
    except Exception as e:
        print(f"Unsplash fetch failed: {e}")
    
    return None
