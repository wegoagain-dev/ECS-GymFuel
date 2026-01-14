// Data models for RecipeRadar MVP

export interface NutritionalInfo {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
}

export interface Recipe {
    id: string
    title: string
    description: string
    ingredients: string[]
    instructions: string
    prepTime: number // in minutes
    cookTime: number // in minutes
    servings: number
    difficulty: 'Easy' | 'Medium' | 'Hard'
    tags: string[]
    imageUrl?: string
    nutritionalInfo?: NutritionalInfo
    createdAt: string
}

export interface Meal {
    id: string
    date: string // ISO date string
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
    recipeId?: string
    recipeName?: string
    notes?: string
    createdAt: string
    recipe?: Recipe
}

export interface GroceryItem {
    id: string
    name: string
    quantity: number
    unit: string
    category: string
    expirationDate?: string // ISO date string
    createdAt: string
}

export interface User {
    id: string
    email: string
    username: string
    full_name?: string
    role: 'client' | 'coach'
    client_code?: string
    dietary_restrictions?: string[]
    preferences?: Record<string, any>
}

export interface ClientSummary {
    id: number
    username: string
    email: string
    full_name?: string
}

export interface CoachSummary {
    id: number
    username: string
    email: string
    full_name?: string
}
