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
      description: "Save your favourite high-protein meals. Track macros automatically."
    },
    {
      title: "Plan Your Week",
      icon: Calendar,
      description: "Drag and drop meals into your weekly plan. No more \"what's for dinner?\""
    },
    {
      title: "Groceries",
      icon: ShoppingBag,
      description: "Know what's in your fridge. Get alerts before anything expires."
    },
    {
      title: "Coach Mode",
      icon: Users,
      description: "Coaches can view client meals. Accountability made simple."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-20"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 dark:bg-[#CCFF00]/10 border border-lime-500/20 dark:border-[#CCFF00]/20 mb-8"
        >
          <Dumbbell className="h-4 w-4 text-lime-600 dark:text-[#CCFF00]" />
          <span className="text-sm font-medium text-lime-700 dark:text-[#CCFF00] uppercase tracking-wider">Fuel Your Training</span>
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[0.95]">
          Fuel Your
          <br />
          <span className="text-lime-600 dark:text-[#CCFF00]">Gains</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          The ultimate tool for gym-goers to track high-protein meals, automate planning, and stay accountable.
        </p>
        <Button
          size="lg"
          onClick={onSignIn}
          className="glass-button text-base md:text-lg px-8 md:px-12 py-6 md:py-7 rounded-lg font-semibold"
        >
          Get Started Free
        </Button>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-card h-full p-6 flex flex-col items-start text-left rounded-xl group hover:border-lime-500/30 dark:hover:border-[#CCFF00]/30 transition-all duration-300">
              <div className="p-3 rounded-lg bg-lime-500/10 dark:bg-[#CCFF00]/10 mb-5 group-hover:bg-lime-500/15 dark:group-hover:bg-[#CCFF00]/15 transition-colors">
                <feature.icon className="h-6 w-6 text-lime-600 dark:text-[#CCFF00]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Subtle grid pattern background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        {/* Lime glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lime-500/5 dark:bg-[#CCFF00]/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-lime-500 dark:bg-[#CCFF00] rounded-lg p-1.5">
                <Dumbbell className="h-5 w-5 text-black" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">GymFuel</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-lg hover:bg-muted h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-lg h-9 w-9 p-0 hover:bg-muted">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 border-border bg-card">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.username}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        {user?.client_code && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-muted-foreground">Code:</span>
                            <code className="text-[10px] font-mono bg-lime-500/10 dark:bg-[#CCFF00]/10 text-lime-700 dark:text-[#CCFF00] px-1.5 py-0.5 rounded">{user.client_code}</code>
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" onClick={handleSignIn} className="glass-button rounded-lg px-4 h-9">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pb-20 relative max-w-6xl pt-8">
        {!isAuthenticated ? (
          <LandingPage onSignIn={handleSignIn} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Greeting & Stats */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{greeting}</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {user?.username || "Athlete"}
                </h2>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 gap-3 md:col-start-3">
                <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-24">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recipes</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold font-mono text-foreground">{recipes.length}</span>
                    <ChefHat className="h-5 w-5 text-lime-600 dark:text-[#CCFF00] mb-1" />
                  </div>
                </div>
                <div className="glass-card p-4 rounded-xl flex flex-col justify-between h-24">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Groceries</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold font-mono text-foreground">{groceryItems.length}</span>
                    <ShoppingBag className="h-5 w-5 text-cyan-500 mb-1" />
                  </div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <div className="py-2 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-hidden">
                <TabsList className="bg-muted/50 border border-border p-1 rounded-lg w-full md:w-auto inline-flex overflow-x-auto">
                  <TabsTrigger value="recipes" className="rounded-md px-4 md:px-6 data-[state=active]:bg-lime-500 dark:data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black text-muted-foreground data-[state=active]:shadow-sm whitespace-nowrap font-medium">Meals</TabsTrigger>
                  <TabsTrigger value="meals" className="rounded-md px-4 md:px-6 data-[state=active]:bg-lime-500 dark:data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black text-muted-foreground data-[state=active]:shadow-sm whitespace-nowrap font-medium">Plan</TabsTrigger>
                  <TabsTrigger value="groceries" className="rounded-md px-4 md:px-6 data-[state=active]:bg-lime-500 dark:data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black text-muted-foreground data-[state=active]:shadow-sm whitespace-nowrap font-medium">Groceries</TabsTrigger>
                  {user?.role === 'coach' && (
                    <TabsTrigger value="coach" className="rounded-md px-4 md:px-6 data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-muted-foreground data-[state=active]:shadow-sm whitespace-nowrap font-medium">Clients</TabsTrigger>
                  )}
                </TabsList>
              </div>

              {/* Overview Tab Removed for Minimalism */}

              <TabsContent value="recipes" className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-lime-600 dark:group-focus-within:text-[#CCFF00] transition-colors" />
                    <Input
                      placeholder="Search recipes..."
                      className="pl-10 bg-muted/50 border-border focus:border-lime-500 dark:focus:border-[#CCFF00] text-foreground placeholder:text-muted-foreground transition-all rounded-lg"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button onClick={handleAddRecipe} className="shrink-0 glass-button rounded-lg border-none">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Meal</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                  {isAuthenticated && (
                    <Button variant="secondary" onClick={() => setGenerateAIModalOpen(true)} className="shrink-0 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-lg">
                      <Sparkles className="h-4 w-4 sm:mr-2 text-cyan-500" />
                      <span className="hidden sm:inline">AI Generate</span>
                    </Button>
                  )}
                </div>

                {filteredRecipes.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-xl border-dashed">
                    <div className="bg-muted w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <ChefHat className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">No recipes yet</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery ? 'No recipes match your search.' : 'Start by adding your first high-protein meal!'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleAddRecipe} className="glass-button rounded-lg">
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
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="glass-card overflow-hidden hover:border-lime-500/30 dark:hover:border-[#CCFF00]/30 transition-all cursor-pointer group relative rounded-xl h-full flex flex-col">
                          <div className="h-32 bg-gradient-to-br from-lime-500/10 to-cyan-500/10 dark:from-[#CCFF00]/10 dark:to-cyan-500/10 relative overflow-hidden">
                            {recipe.imageUrl ? (
                              <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ChefHat className="h-12 w-12 text-muted-foreground/30" />
                              </div>
                            )}
                            <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm border-none text-white text-xs">
                              {recipe.difficulty}
                            </Badge>
                          </div>

                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg w-8 h-8"
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
                              <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">{recipe.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">
                                {recipe.description || 'No description provided.'}
                              </p>
                            </div>

                            <div className="mt-auto space-y-4">
                              <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1.5 font-mono font-semibold text-lime-600 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 px-2.5 py-1 rounded-md">
                                  <Dumbbell className="h-3.5 w-3.5" />
                                  <span>{recipe.nutritionalInfo?.protein || 0}g</span>
                                </div>
                                {(recipe.nutritionalInfo?.calories || 0) > 0 && (
                                  <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Flame className="h-3.5 w-3.5" />
                                    <span>{recipe.nutritionalInfo?.calories}</span>
                                  </div>
                                )}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full rounded-lg border-border bg-muted/50 hover:bg-muted hover:border-lime-500/30 dark:hover:border-[#CCFF00]/30 text-foreground transition-colors"
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
                  <h3 className="text-xl font-bold text-foreground">Weekly Fuel Plan</h3>
                  <p className="text-sm text-muted-foreground">Plan your nutrition to hit your daily targets.</p>
                </div>

                <div className="space-y-3">
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

                    return (
                      <div key={day} className="glass-card rounded-xl p-4">
                        <div className="font-semibold mb-3 text-lime-600 dark:text-[#CCFF00] text-sm uppercase tracking-wider">{day}</div>
                        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                          {["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType) => {
                            const plannedMeals = getMealsForDay(day, mealType)
                            return (
                              <div key={mealType} className="bg-muted/50 rounded-lg p-3 text-sm border border-border h-full flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{mealType}</span>
                                  {plannedMeals.length === 0 && recipes.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
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
                                        <span className="text-foreground font-medium text-sm line-clamp-2 flex-1">
                                          {plannedMeals[0].recipeName}
                                        </span>
                                        <div className="flex gap-0.5 shrink-0">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
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
                                            className="h-5 w-5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md"
                                            onClick={() => deleteMeal(plannedMeals[0].id)}
                                            title="Remove"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      {plannedMeals[0].recipe?.nutritionalInfo?.protein !== undefined && (
                                        <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-lime-600 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 px-1.5 py-0.5 rounded w-fit">
                                          <Dumbbell className="h-3 w-3" />
                                          {plannedMeals[0].recipe.nutritionalInfo.protein}g
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full justify-between bg-muted border-border text-foreground hover:bg-muted/80 h-8">
                                          <span className="truncate">{plannedMeals[0].recipeName}</span>
                                          <Badge variant="secondary" className="ml-1 bg-secondary text-secondary-foreground">{plannedMeals.length}</Badge>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-56 border-border bg-card">
                                        <DropdownMenuLabel>Planned Meals</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {plannedMeals.map(meal => (
                                          <DropdownMenuItem key={meal.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                              <span className="text-sm font-medium text-foreground truncate">
                                                {meal.recipeName || 'Unknown Recipe'}
                                              </span>
                                              {meal.recipe?.nutritionalInfo?.protein !== undefined && (
                                                <div className="flex items-center gap-1 text-[10px] font-mono text-lime-600 dark:text-[#CCFF00] bg-lime-500/10 dark:bg-[#CCFF00]/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                  <Dumbbell className="h-3 w-3" />
                                                  {meal.recipe.nutritionalInfo.protein}g
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex gap-1">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 text-muted-foreground hover:text-foreground"
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
                                                className="h-5 w-5 text-muted-foreground hover:text-destructive"
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
                                  <div className="text-muted-foreground/50 italic text-xs mt-auto">Empty</div>
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
                    <h3 className="text-xl font-bold text-foreground">My Groceries</h3>
                    <p className="text-sm text-muted-foreground">Track ingredients and expiration dates</p>
                  </div>
                  <Button onClick={handleAddGroceryItem} className="glass-button rounded-lg border-none">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {groceryItems.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-xl border-dashed">
                    <div className="bg-muted w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">No groceries yet</h3>
                    <p className="text-muted-foreground mb-6">Start tracking your ingredients to reduce waste!</p>
                    <Button onClick={handleAddGroceryItem} className="glass-button rounded-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </div>
                ) : (
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="divide-y divide-border">
                      {groceryItems.map((item) => {
                        const expStatus = getExpirationStatus(item.expirationDate)
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-4 transition-colors group ${expStatus.status === 'urgent' || expStatus.status === 'expired'
                              ? 'bg-red-500/5'
                              : expStatus.status === 'soon'
                                ? 'bg-amber-500/5'
                                : 'bg-transparent hover:bg-muted/50'
                              }`}
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-foreground text-lg">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.quantity} {item.unit} • {item.category}
                              </div>
                              {item.expirationDate && (
                                <div
                                  className={`text-sm mt-1 font-medium ${expStatus.status === 'urgent' || expStatus.status === 'expired'
                                    ? 'text-red-500'
                                    : expStatus.status === 'soon'
                                      ? 'text-amber-500'
                                      : 'text-emerald-500'
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
                                className={`rounded-md px-3 py-1 border-none text-xs font-semibold uppercase tracking-wide ${expStatus.status === 'urgent' || expStatus.status === 'expired'
                                  ? 'bg-red-500 text-white'
                                  : expStatus.status === 'soon'
                                    ? 'bg-amber-500 text-black'
                                    : 'bg-emerald-500 text-white'
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
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                                  onClick={() => handleEditGroceryItem(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg"
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
