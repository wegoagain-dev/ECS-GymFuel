// Zustand store for RecipeRadar with Authentication

import { create } from 'zustand'
import { Recipe, Meal, GroceryItem, User } from './types'
import {
    getRecipes,
    saveRecipe as saveRecipeToStorage,
    deleteRecipe as deleteRecipeFromStorage,
    getMeals,
    saveMeal as saveMealToStorage,
    deleteMeal as deleteMealFromStorage,
    getGroceryItems,
    saveGroceryItem as saveGroceryItemToStorage,
    deleteGroceryItem as deleteGroceryItemFromStorage,
} from './storage'
import { api, getToken, setToken, removeToken } from './api'

interface AppStore {
    // Auth State
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isAuthModalOpen: boolean

    // Data State
    recipes: Recipe[]
    meals: Meal[]
    groceryItems: GroceryItem[]
    isAddRecipeModalOpen: boolean
    isAddGroceryModalOpen: boolean
    isGenerateAIModalOpen: boolean
    isAddToMealPlanModalOpen: boolean
    selectedRecipeForPlan: Recipe | null
    itemToEdit: GroceryItem | null
    mealToEdit: Meal | null
    isEditMealModalOpen: boolean

    // Auth Actions
    setAuthModalOpen: (open: boolean) => void
    login: (email: string, password: string) => Promise<void>
    register: (data: {
        email: string
        username: string
        password: string
        full_name?: string
        role: "client" | "coach"
    }) => Promise<void>
    logout: () => void
    loadUser: () => Promise<void>
    syncLocalDataToCloud: () => Promise<void>

    // Data Actions
    loadData: () => void

    // Recipe actions
    addRecipe: (recipe: Recipe) => void
    updateRecipe: (recipe: Recipe) => void
    deleteRecipe: (id: string) => void
    setAddRecipeModalOpen: (open: boolean) => void
    setGenerateAIModalOpen: (open: boolean) => void
    setAddToMealPlanModalOpen: (open: boolean) => void
    setSelectedRecipeForPlan: (recipe: Recipe | null) => void

    // Meal actions
    addMeal: (meal: Meal) => void
    updateMeal: (meal: Meal) => void
    deleteMeal: (id: string) => void

    // Grocery actions
    addGroceryItem: (item: GroceryItem) => void
    updateGroceryItem: (item: GroceryItem) => void
    deleteGroceryItem: (id: string) => void
    setAddGroceryModalOpen: (open: boolean) => void
    setItemToEdit: (item: GroceryItem | null) => void
    setMealToEdit: (meal: Meal | null) => void
    setEditMealModalOpen: (open: boolean) => void
}

export const useStore = create<AppStore>((set, get) => ({
    // Initial auth state
    user: null,
    token: null,
    isAuthenticated: false,
    isAuthModalOpen: false,

    // Initial data state
    recipes: [],
    meals: [],
    groceryItems: [],
    isAddRecipeModalOpen: false,
    isAddGroceryModalOpen: false,
    isGenerateAIModalOpen: false,
    isAddToMealPlanModalOpen: false,
    selectedRecipeForPlan: null,
    itemToEdit: null,

    // Auth actions
    setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),

    login: async (email, password) => {
        try {
            const response = await api.login(email, password)
            setToken(response.access_token)

            const user = await api.getMe()
            set({
                user,
                token: response.access_token,
                isAuthenticated: true,
                isAuthModalOpen: false
            })

            // Load data from cloud
            const [recipes, meals, groceryItems] = await Promise.all([
                api.getRecipes(),
                api.getMeals(),
                api.getGroceryItems(),
            ])

            set({ recipes, meals, groceryItems })
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    },

    register: async (data) => {
        try {
            await api.register(data)

            // Auto-login after registration
            const response = await api.login(data.email, data.password)
            setToken(response.access_token)

            const user = await api.getMe()
            set({
                user,
                token: response.access_token,
                isAuthenticated: true,
                isAuthModalOpen: false
            })

            // Sync local data to cloud - DISABLED as we are moving away from guest mode
            // await get().syncLocalDataToCloud()
        } catch (error) {
            console.error('Registration failed:', error)
            throw error
        }
    },

    logout: () => {
        removeToken()
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            recipes: [],
            meals: [],
            groceryItems: [],
        })
        window.location.href = '/' // Force redirect to home/login to clear all state
    },

    loadUser: async () => {
        const token = getToken()
        if (!token) return

        try {
            const user = await api.getMe()
            set({ user, token, isAuthenticated: true })

            // Load data from cloud
            const [recipes, meals, groceryItems] = await Promise.all([
                api.getRecipes(),
                api.getMeals(),
                api.getGroceryItems(),
            ])

            set({ recipes, meals, groceryItems })
        } catch (error) {
            console.error('Failed to load user:', error)
            removeToken()
            set({ user: null, token: null, isAuthenticated: false })
        }
    },

    syncLocalDataToCloud: async () => {
        const localRecipes = getRecipes()
        const localGroceryItems = getGroceryItems()

        try {
            // Upload all local recipes to cloud
            for (const recipe of localRecipes) {
                await api.createRecipe(recipe)
            }

            // Upload all local grocery items to cloud
            for (const item of localGroceryItems) {
                await api.createGroceryItem(item)
            }

            // Reload data from cloud to get server-assigned IDs
            const [recipes, meals, groceryItems] = await Promise.all([
                api.getRecipes(),
                api.getMeals(),
                api.getGroceryItems(),
            ])

            set({ recipes, meals, groceryItems })
        } catch (error) {
            console.error('Failed to sync data:', error)
            throw error
        }
    },

    // Load data from localStorage (guest mode)
    loadData: () => {
        const state = get()
        if (state.isAuthenticated) {
            // If authenticated, data should come from cloud
            return
        }

        set({
            recipes: getRecipes(),
            meals: getMeals(),
            groceryItems: getGroceryItems(),
        })
    },

    // Recipe actions
    addRecipe: async (recipe) => {
        const state = get()

        if (state.isAuthenticated) {
            // Save to cloud
            try {
                const savedRecipe = await api.createRecipe(recipe)
                set((state) => ({ recipes: [...state.recipes, savedRecipe] }))
            } catch (error) {
                console.error('Failed to save recipe:', error)
                throw error
            }
        } else {
            // Save to local storage
            saveRecipeToStorage(recipe)
            set((state) => ({ recipes: [...state.recipes, recipe] }))
        }
    },

    updateRecipe: (recipe) => {
        // TODO: Implement cloud update
        saveRecipeToStorage(recipe)
        set((state) => ({
            recipes: state.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
        }))
    },

    deleteRecipe: async (id) => {
        const state = get()

        if (state.isAuthenticated) {
            // Delete from cloud
            try {
                await api.deleteRecipe(id)
                set((state) => ({
                    recipes: state.recipes.filter((r) => r.id !== id),
                }))
            } catch (error) {
                console.error('Failed to delete recipe:', error)
                throw error
            }
        } else {
            // Delete from local storage
            deleteRecipeFromStorage(id)
            set((state) => ({
                recipes: state.recipes.filter((r) => r.id !== id),
            }))
        }
    },

    setAddRecipeModalOpen: (open) => set({ isAddRecipeModalOpen: open }),
    setGenerateAIModalOpen: (open) => set({ isGenerateAIModalOpen: open }),
    setAddToMealPlanModalOpen: (open) => set({ isAddToMealPlanModalOpen: open }),
    setSelectedRecipeForPlan: (recipe) => set({ selectedRecipeForPlan: recipe }),

    // Meal actions
    addMeal: async (meal) => {
        const state = get()

        if (state.isAuthenticated) {
            try {
                const savedMeal = await api.createMeal(meal)
                set((state) => ({ meals: [...state.meals, savedMeal] }))
            } catch (error) {
                console.error('Failed to save meal:', error)
                throw error
            }
        } else {
            saveMealToStorage(meal)
            set((state) => ({ meals: [...state.meals, meal] }))
        }
    },

    mealToEdit: null,
    isEditMealModalOpen: false,

    setMealToEdit: (meal) => set({ mealToEdit: meal }),
    setEditMealModalOpen: (open) => set({ isEditMealModalOpen: open }),

    updateMeal: async (meal) => {
        const state = get()
        if (state.isAuthenticated) {
            try {
                const updatedMeal = await api.updateMeal(meal)
                set((state) => ({
                    meals: state.meals.map((m) => (m.id === meal.id ? updatedMeal : m)),
                }))
            } catch (error) {
                console.error('Failed to update meal:', error)
                throw error
            }
        } else {
            saveMealToStorage(meal)
            set((state) => ({
                meals: state.meals.map((m) => (m.id === meal.id ? meal : m)),
            }))
        }
    },

    deleteMeal: (id) => {
        deleteMealFromStorage(id)
        set((state) => ({
            meals: state.meals.filter((m) => m.id !== id),
        }))
    },

    // Grocery actions
    addGroceryItem: async (item) => {
        const state = get()

        if (state.isAuthenticated) {
            try {
                const savedItem = await api.createGroceryItem(item)
                set((state) => ({ groceryItems: [...state.groceryItems, savedItem] }))
            } catch (error) {
                console.error('Failed to save grocery item:', error)
                throw error
            }
        } else {
            saveGroceryItemToStorage(item)
            set((state) => ({ groceryItems: [...state.groceryItems, item] }))
        }
    },

    updateGroceryItem: async (item) => {
        const state = get()

        if (state.isAuthenticated) {
            try {
                const updatedItem = await api.updateGroceryItem(item)
                set((state) => ({
                    groceryItems: state.groceryItems.map((i) => (i.id === item.id ? updatedItem : i)),
                }))
            } catch (error) {
                console.error('Failed to update grocery item:', error)
                throw error
            }
        } else {
            saveGroceryItemToStorage(item)
            set((state) => ({
                groceryItems: state.groceryItems.map((i) => (i.id === item.id ? item : i)),
            }))
        }
    },

    deleteGroceryItem: async (id) => {
        const state = get()

        if (state.isAuthenticated) {
            try {
                await api.deleteGroceryItem(id)
                set((state) => ({
                    groceryItems: state.groceryItems.filter((i) => i.id !== id),
                }))
            } catch (error) {
                console.error('Failed to delete grocery item:', error)
                throw error
            }
        } else {
            deleteGroceryItemFromStorage(id)
            set((state) => ({
                groceryItems: state.groceryItems.filter((i) => i.id !== id),
            }))
        }
    },

    setAddGroceryModalOpen: (open) => set({ isAddGroceryModalOpen: open }),
    setItemToEdit: (item) => set({ itemToEdit: item }),
}))
