"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, Calendar, ShoppingBag, Plus, Search, Users, Trash2, LogOut, User, Sparkles, Shuffle, Moon, Sun, Flame, Pencil, Dumbbell, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useStore } from "@/lib/store"
import { AddRecipeModal } from "@/components/modals/AddRecipeModal"
import { AddGroceryItemModal } from "@/components/modals/AddGroceryItemModal"
import { EditMealDialog } from "../components/modals/EditMealDialog"


import { AuthModal } from "@/components/modals/AuthModal"
import { GenerateRecipeModal } from "@/components/modals/GenerateRecipeModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddToMealPlanModal } from "@/components/modals/AddToMealPlanModal"
import { CoachDashboard } from "@/components/CoachDashboard"

function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  const features = [
    {
      title: "Log Recipes",
      icon: ChefHat,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: "Save your favourite high-protein meals. Track macros automatically."
    },
    {
      title: "Plan Your Week",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Drag and drop meals into your weekly plan. No more \"what's for dinner?\""
    },
    {
      title: "Groceries",
      icon: ShoppingBag,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Know what's in your fridge. Get alerts before anything expires."
    },
    {
      title: "Coach Mode",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Coaches can view client meals. Accountability made simple."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold text-foreground mb-6 tracking-tight">
          Fuel Your Gains
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          The ultimate tool for gym-goers to track high-protein meals, automate planning, and stay accountable.
        </p>
        <Button size="lg" onClick={onSignIn} className="text-lg px-10 py-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-105">
          Get Started Free
        </Button>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <div className="glass-card h-full p-6 flex flex-col items-center text-center rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <div className={`p-4 rounded-full ${feature.bg} mb-6`}>
                <feature.icon className={`h-12 w-12 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("recipes")
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const [greeting, setGreeting] = useState("Welcome back,")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning,")
    else if (hour < 18) setGreeting("Good afternoon,")
    else setGreeting("Good evening,")
  }, [])

  const {
    user,
    isAuthenticated,
    recipes,
    meals,
    groceryItems,
    loadData,
    loadUser,
    logout,
    setAuthModalOpen,
    setAddRecipeModalOpen,
    setGenerateAIModalOpen,
    setAddToMealPlanModalOpen,
    setSelectedRecipeForPlan,
    deleteRecipe,
    deleteGroceryItem,
    deleteMeal,
    addMeal,
    setItemToEdit,
    setAddGroceryModalOpen,
    mealToEdit,
    isEditMealModalOpen,
    setMealToEdit,
    setEditMealModalOpen
  } = useStore()

  // Load user and data on mount
  useEffect(() => {
    loadUser().then(() => {
      // If not authenticated, load from local storage
      if (!isAuthenticated) {
        loadData()
      }
    })
  }, [loadUser, loadData, isAuthenticated])

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate expiration status for grocery items
  // Red (urgent): expired or ≤3 days
  // Orange (soon): 4-6 days
  // Green (fresh): >6 days
  const getExpirationStatus = (expirationDate?: string) => {
    if (!expirationDate) return { status: 'none', days: Infinity }

    // Parse the date string as local time (YYYY-MM-DD format)
    const [year, month, day] = expirationDate.split('-').map(Number)
    const expDate = new Date(year, month - 1, day) // month is 0-indexed
    expDate.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffTime = expDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: 'expired', days: diffDays }
    if (diffDays <= 3) return { status: 'urgent', days: diffDays }  // 0-3 days = red
    if (diffDays <= 6) return { status: 'soon', days: diffDays }    // 4-6 days = orange
    return { status: 'fresh', days: diffDays }                       // >6 days = green
  }

  // Handler functions
  const handleSignIn = () => {
    setAuthModalOpen(true)
  }

  const handleLogout = (e: Event) => {
    e.preventDefault()
    if (confirm("Are you sure you want to sign out? Your data will remain in the cloud.")) {
      logout()
    }
  }

  const handleCreateRecipe = () => {
    setAddRecipeModalOpen(true)
  }

  const handlePlanWeek = () => {
    setActiveTab("meals")
  }

  const handleCheckGroceries = () => {
    setActiveTab("groceries")
  }

  const handleViewAnalytics = () => {
    alert("Analytics Dashboard - Coming soon!\n\nThis will show your savings, trends, and meal planning statistics.")
  }

  const handleAddRecipe = () => {
    setAddRecipeModalOpen(true)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleAddGroceryItem = () => {
    setAddGroceryModalOpen(true)
  }

  const handleEditGroceryItem = (item: any) => {
    setItemToEdit(item)
    setAddGroceryModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-500/30 transition-colors duration-300">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-white to-white dark:from-orange-900/20 dark:via-black dark:to-black pointer-events-none" />

      {/* Glass Navbar */}
      <nav className="sticky top-4 z-40 mx-4 md:mx-auto max-w-5xl rounded-full glass px-6 py-3 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 rounded-lg p-1">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">GymFuel</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-black/5 dark:hover:bg-white/10 h-8 w-8 relative"
            >
              <Sun className="h-4 w-4 text-orange-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 text-blue-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-8 w-8 p-0 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      {user?.client_code && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">Code:</span>
                          <code className="text-[10px] font-mono bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded">{user.client_code}</code>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-500 dark:text-red-400 focus:text-red-600 dark:focus:text-red-300 focus:bg-black/5 dark:focus:bg-white/5">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={handleSignIn} className="bg-white text-black hover:bg-gray-200 rounded-full px-4">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pb-20 relative max-w-6xl">
        {!isAuthenticated ? (
          <LandingPage onSignIn={handleSignIn} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Greeting & Stats Bento - Mobile First Stack */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-1">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60 pb-2">
                  {greeting}
                </h2>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">{user?.username || "Athlete"}</p>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 gap-3 md:col-start-3">
                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-24">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Recipes</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold dark:text-white text-gray-900">{recipes.length}</span>
                    <ChefHat className="h-5 w-5 text-orange-500 mb-1" />
                  </div>
                </div>
                <div className="glass-card p-4 rounded-2xl flex flex-col justify-between h-24">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Groceries</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold dark:text-white text-gray-900">{groceryItems.length}</span>
                    <ShoppingBag className="h-5 w-5 text-emerald-500 mb-1" />
                  </div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <div className="py-2 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-hidden">
                <TabsList className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-1 rounded-full w-full md:w-auto inline-flex overflow-x-auto">
                  <TabsTrigger value="recipes" className="rounded-full px-4 md:px-6 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-700 dark:text-gray-300 whitespace-nowrap">Meals</TabsTrigger>
                  <TabsTrigger value="meals" className="rounded-full px-4 md:px-6 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-700 dark:text-gray-300 whitespace-nowrap">Plan</TabsTrigger>
                  <TabsTrigger value="groceries" className="rounded-full px-4 md:px-6 data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-700 dark:text-gray-300 whitespace-nowrap">Groceries</TabsTrigger>
                  {user?.role === 'coach' && (
                    <TabsTrigger value="coach" className="rounded-full px-4 md:px-6 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300 whitespace-nowrap">Clients</TabsTrigger>
                  )}
                </TabsList>
              </div>

              {/* Overview Tab Removed for Minimalism */}

              <TabsContent value="recipes" className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      placeholder="Search recipes..."
                      className="pl-10 glass border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:bg-white/80 dark:focus:bg-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 transition-all rounded-xl"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button onClick={handleAddRecipe} className="shrink-0 glass-button rounded-xl border-none">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Meal</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                  {isAuthenticated && (
                    <Button variant="secondary" onClick={() => setGenerateAIModalOpen(true)} className="shrink-0 glass hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/10 text-gray-900 dark:text-white rounded-xl">
                      <Sparkles className="h-4 w-4 sm:mr-2 text-indigo-400" />
                      <span className="hidden sm:inline">AI Generate</span>
                    </Button>
                  )}
                </div>

                {filteredRecipes.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-3xl border-dashed border-white/10">
                    <div className="bg-black/5 dark:bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ChefHat className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No recipes yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {searchQuery ? 'No recipes match your search.' : 'Start by adding your first high-protein meal!'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleAddRecipe} className="glass-button rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Recipe
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRecipes.map((recipe, index) => (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="glass-card overflow-hidden hover:border-orange-500/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer group relative rounded-3xl h-full flex flex-col">
                          <div className="h-32 bg-gradient-to-br from-orange-500/10 to-purple-500/10 relative overflow-hidden">
                            {recipe.imageUrl ? (
                              <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-black/20" />
                            )}
                            <Badge className="absolute top-3 left-3 glass border-none text-white bg-black/40 backdrop-blur-md hover:bg-black/60">
                              {recipe.difficulty}
                            </Badge>
                          </div>

                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm(`Delete "${recipe.title}"?`)) {
                                deleteRecipe(recipe.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-4">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{recipe.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5em]">
                                {recipe.description || 'No description provided.'}
                              </p>
                            </div>

                            <div className="mt-auto space-y-4">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5 font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md">
                                  <Dumbbell className="h-3.5 w-3.5" />
                                  <span>{recipe.nutritionalInfo?.protein || 0}g</span>
                                </div>
                                {(recipe.nutritionalInfo?.calories || 0) > 0 && (
                                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                    <Flame className="h-3.5 w-3.5" />
                                    <span>{recipe.nutritionalInfo?.calories}</span>
                                  </div>
                                )}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full rounded-xl border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-900 dark:text-white hover:text-gray-900 dark:hover:text-white group-hover:border-orange-500/30 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedRecipeForPlan(recipe)
                                  setAddToMealPlanModalOpen(true)
                                }}
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Add to Plan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="meals" className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Fuel Plan</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Plan your nutrition to hit your daily targets.</p>
                </div>

                <div className="space-y-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                    const getMealsForDay = (dayName: string, mealType: string) => {
                      return meals.filter(meal => {
                        const mealDate = new Date(meal.date)
                        const dayOfWeek = mealDate.getDay()
                        const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayName)
                        return dayOfWeek === dayIndex && meal.mealType === mealType
                      })
                    }

                    const handleRandomise = async (dayName: string, mealType: string) => {
                      if (recipes.length === 0) {
                        alert("Add some recipes first!")
                        return
                      }
                      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

                      // Calculate date for the day
                      const today = new Date()
                      const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                      const currentDayIndex = today.getDay() || 7
                      const targetDayIndexAdjusted = DAYS.indexOf(dayName) + 1
                      let daysToAdd = targetDayIndexAdjusted - currentDayIndex
                      if (daysToAdd <= 0) daysToAdd += 7
                      const targetDate = new Date(today)
                      targetDate.setDate(today.getDate() + daysToAdd)

                      const meal = {
                        id: `meal-${Date.now()}`,
                        date: targetDate.toISOString().split('T')[0],
                        mealType: mealType as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack',
                        recipeId: randomRecipe.id,
                        recipeName: randomRecipe.title,
                        recipe: randomRecipe,
                        notes: 'Randomly assigned',
                        createdAt: new Date().toISOString(),
                      }
                      await addMeal(meal)
                    }

                    const mealTypeColors = {
                      Breakfast: "text-blue-500",
                      Lunch: "text-green-500",
                      Dinner: "text-red-500",
                      Snack: "text-purple-500",
                    }

                    return (
                      <div key={day} className="glass-card rounded-2xl p-4 border-black/5 dark:border-white/5">
                        <div className="font-bold mb-3 text-orange-500/90">{day}</div>
                        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                          {["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType) => {
                            const plannedMeals = getMealsForDay(day, mealType)
                            return (
                              <div key={mealType} className="bg-black/5 dark:bg-black/20 rounded-xl p-3 text-sm border border-black/5 dark:border-white/5 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{mealType}</span>
                                  {plannedMeals.length === 0 && recipes.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full"
                                      onClick={() => handleRandomise(day, mealType)}
                                      title="Randomise"
                                    >
                                      <Shuffle className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                {plannedMeals.length > 0 ? (
                                  plannedMeals.length === 1 ? (
                                    <div className="flex flex-col gap-1.5 mt-auto">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-gray-900 dark:text-white font-medium text-sm line-clamp-2 flex-1">
                                          {plannedMeals[0].recipeName}
                                        </span>
                                        <div className="flex gap-0.5 shrink-0">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 rounded-full"
                                            onClick={() => {
                                              setMealToEdit(plannedMeals[0])
                                              setEditMealModalOpen(true)
                                            }}
                                            title="Edit"
                                          >
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-full"
                                            onClick={() => deleteMeal(plannedMeals[0].id)}
                                            title="Remove"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      {plannedMeals[0].recipe?.nutritionalInfo?.protein !== undefined && (
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-full w-fit">
                                          <Dumbbell className="h-3 w-3" />
                                          {plannedMeals[0].recipe.nutritionalInfo.protein}g
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full justify-between bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 h-8">
                                          <span className="truncate">{plannedMeals[0].recipeName}</span>
                                          <Badge variant="secondary" className="ml-1 bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-black/20 dark:hover:bg-white/20">{plannedMeals.length}</Badge>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-56 glass border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/90 text-gray-900 dark:text-white">
                                        <DropdownMenuLabel>Planned Meals</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                                        {plannedMeals.map(meal => (
                                          <DropdownMenuItem key={meal.id} className="flex items-center justify-between focus:bg-black/5 dark:focus:bg-white/10">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {meal.recipeName || 'Unknown Recipe'}
                                              </span>
                                              {meal.recipe?.nutritionalInfo?.protein !== undefined && (
                                                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-mono text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                  <Dumbbell className="h-3 w-3" />
                                                  {meal.recipe.nutritionalInfo.protein}g
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex gap-1">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setMealToEdit(meal)
                                                  setEditMealModalOpen(true)
                                                }}
                                              >
                                                <Pencil className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 text-gray-500 hover:text-red-400"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  deleteMeal(meal.id)
                                                }}
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )
                                ) : (
                                  <div className="text-gray-500 dark:text-gray-600 italic text-xs mt-auto">Empty</div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="groceries" className="space-y-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Groceries</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track ingredients and expiration dates</p>
                  </div>
                  <Button onClick={handleAddGroceryItem} className="glass-button rounded-xl border-none">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {groceryItems.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-3xl border-dashed border-white/10">
                    <div className="bg-black/5 dark:bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No groceries yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Start tracking your ingredients to reduce waste!</p>
                    <Button onClick={handleAddGroceryItem} className="glass-button rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </div>
                ) : (
                  <div className="glass-card rounded-3xl p-1 overflow-hidden">
                    <div className="space-y-1">
                      {groceryItems.map((item) => {
                        const expStatus = getExpirationStatus(item.expirationDate)
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-4 transition-colors border-b border-black/5 dark:border-white/5 last:border-0 group ${expStatus.status === 'urgent' || expStatus.status === 'expired'
                              ? 'bg-red-500/5'
                              : expStatus.status === 'soon'
                                ? 'bg-orange-500/5'
                                : 'bg-transparent'
                              }`}
                          >
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 dark:text-white text-lg">{item.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {item.quantity} {item.unit} • {item.category}
                              </div>
                              {item.expirationDate && (
                                <div
                                  className={`text-sm mt-1 font-medium ${expStatus.status === 'urgent' || expStatus.status === 'expired'
                                    ? 'text-red-400'
                                    : expStatus.status === 'soon'
                                      ? 'text-orange-400'
                                      : 'text-green-400'
                                    }`}
                                >
                                  {expStatus.status === 'expired'
                                    ? 'Expired'
                                    : expStatus.days === 0
                                      ? 'Expires today'
                                      : expStatus.days === 1
                                        ? 'Expires tomorrow'
                                        : `Expires in ${expStatus.days} days`}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge
                                className={`rounded-full px-3 py-1 border-none text-white font-medium ${expStatus.status === 'urgent' || expStatus.status === 'expired'
                                  ? 'bg-red-500/80 shadow-[0_0_15px_-3px_rgba(239,68,68,0.5)]'
                                  : expStatus.status === 'soon'
                                    ? 'bg-orange-500/80 shadow-[0_0_15px_-3px_rgba(249,115,22,0.5)]'
                                    : 'bg-green-500/80 shadow-[0_0_15px_-3px_rgba(34,197,94,0.5)]'
                                  }`}
                              >
                                {expStatus.status === 'urgent' || expStatus.status === 'expired'
                                  ? 'Urgent'
                                  : expStatus.status === 'soon'
                                    ? 'Soon'
                                    : expStatus.status === 'none'
                                      ? 'No expiry'
                                      : 'Fresh'}
                              </Badge>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 transition-opacity text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                                  onClick={() => handleEditGroceryItem(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 transition-opacity text-gray-400 hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                                  onClick={() => {
                                    if (confirm(`Delete "${item.name}"?`)) {
                                      deleteGroceryItem(item.id)
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </TabsContent>

              {user?.role === 'coach' && (
                <TabsContent value="coach">
                  <CoachDashboard />
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
        )}
      </div>
      {/* Modals */}
      <AuthModal />
      <AddRecipeModal />
      <GenerateRecipeModal />
      <AddToMealPlanModal />
      <AddGroceryItemModal />
      <EditMealDialog
        isOpen={isEditMealModalOpen}
        onOpenChange={setEditMealModalOpen}
        meal={mealToEdit}
      />
    </div >
  )
}
