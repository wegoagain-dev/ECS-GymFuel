// Local storage utilities for RecipeRadar MVP

import { Recipe, Meal, GroceryItem } from './types'

const STORAGE_KEYS = {
    RECIPES: 'recipenadar_recipes',
    MEALS: 'recipenadar_meals',
    GROCERIES: 'recipenadar_groceries',
}

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') return []

    try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error)
        return []
    }
}

function saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error)
    }
}

// Recipe functions
export function getRecipes(): Recipe[] {
    return getFromStorage<Recipe>(STORAGE_KEYS.RECIPES)
}

export function saveRecipe(recipe: Recipe): void {
    const recipes = getRecipes()
    const existingIndex = recipes.findIndex(r => r.id === recipe.id)

    if (existingIndex >= 0) {
        recipes[existingIndex] = recipe
    } else {
        recipes.push(recipe)
    }

    saveToStorage(STORAGE_KEYS.RECIPES, recipes)
}

export function deleteRecipe(id: string): void {
    const recipes = getRecipes().filter(r => r.id !== id)
    saveToStorage(STORAGE_KEYS.RECIPES, recipes)
}

// Meal functions
export function getMeals(): Meal[] {
    return getFromStorage<Meal>(STORAGE_KEYS.MEALS)
}

export function saveMeal(meal: Meal): void {
    const meals = getMeals()
    const existingIndex = meals.findIndex(m => m.id === meal.id)

    if (existingIndex >= 0) {
        meals[existingIndex] = meal
    } else {
        meals.push(meal)
    }

    saveToStorage(STORAGE_KEYS.MEALS, meals)
}

export function deleteMeal(id: string): void {
    const meals = getMeals().filter(m => m.id !== id)
    saveToStorage(STORAGE_KEYS.MEALS, meals)
}

// Grocery functions
export function getGroceryItems(): GroceryItem[] {
    return getFromStorage<GroceryItem>(STORAGE_KEYS.GROCERIES)
}

export function saveGroceryItem(item: GroceryItem): void {
    const items = getGroceryItems()
    const existingIndex = items.findIndex(i => i.id === item.id)

    if (existingIndex >= 0) {
        items[existingIndex] = item
    } else {
        items.push(item)
    }

    saveToStorage(STORAGE_KEYS.GROCERIES, items)
}

export function deleteGroceryItem(id: string): void {
    const items = getGroceryItems().filter(i => i.id !== id)
    saveToStorage(STORAGE_KEYS.GROCERIES, items)
}

// Utility function to generate unique IDs
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
