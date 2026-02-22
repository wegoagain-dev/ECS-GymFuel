"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChefHat, Calendar, ShoppingBag, Plus, Search, Trash2, LogOut, User, Sparkles, Shuffle, Flame, Pencil, Dumbbell, X, Users, Mail, KeyRound } from "lucide-react"
import { useStore } from "@/lib/store"
import { GroceryItem, Recipe } from "@/lib/types"
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function LandingPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12 md:mb-14"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-300/25 mb-8 text-white/90"
        >
          <Dumbbell className="h-4 w-4 text-blue-200" />
          <span className="text-sm font-medium uppercase tracking-wider">Coach-Led Nutrition</span>
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[0.95]">
          Plan Protein.
          <br />
          <span className="text-blue-300">Keep Clients Consistent.</span>
        </h2>
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
          Weekly meal planning, grocery prep, and accountability for coaches and clients who care about adherence.
        </p>
        <Button
          size="lg"
          onClick={onSignIn}
          className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-base md:text-lg px-8 md:px-12 py-6 md:py-7 font-semibold shadow-xl shadow-blue-900/50 border border-blue-300/20"
        >
          Start Planning
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-phone"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-base font-medium">Client Dashboard</p>
                <p className="text-white/50 text-xs">Coach-linked account</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/30 border border-blue-200/25 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2">Account & Check-ins</p>
              <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600/90 to-blue-500/80 border border-blue-300/25 p-3 flex items-center justify-between text-left">
                <span className="text-white font-medium">Weekly Check-In</span>
                <span className="text-white/70">›</span>
              </button>
              <div className="mt-2 space-y-2">
                <div className="frost-item">
                  <span className="text-white/80">Coach Notes</span>
                  <span className="rounded-full bg-blue-600 text-white text-[10px] px-2 py-0.5">3</span>
                </div>
                <div className="frost-item">
                  <span className="text-white/80">Nutrition Goals</span>
                  <span className="text-white/35">›</span>
                </div>
                <div className="frost-item">
                  <span className="text-white/80">Privacy</span>
                  <span className="text-white/35">›</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2">Focus</p>
              <div className="frost-item">
                <span className="text-white/90">Focus Mode</span>
                <span className="inline-flex h-6 w-11 rounded-full bg-blue-500/30 p-1 border border-blue-300/20">
                  <span className="h-4 w-4 rounded-full bg-blue-400 ml-auto" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="glass-phone"
        >
          <div className="space-y-5">
            <div className="rounded-full h-12 px-4 border border-white/10 bg-white/5 flex items-center gap-3">
              <Search className="h-4 w-4 text-white/50" />
              <span className="text-white/50">Search meals...</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["Breakfast", "Lunch", "Dinner", "Snacks"].map((label, index) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className={index === 1 ? "category-dot category-dot-active" : "category-dot"}>
                    <ChefHat className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] text-white/70">{label}</span>
                </div>
              ))}
            </div>

            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=60"
                alt="High protein meal"
                className="w-full aspect-[16/10] object-cover"
              />
              <div className="px-4 py-3.5">
                <p className="text-white font-medium">High-Protein Chicken Bowl</p>
                <p className="text-white/60 text-xs">48g protein • 620 kcal • Meal prep friendly.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="glass-phone"
        >
          <div className="space-y-5">
            <div>
              <p className="text-white text-base font-semibold">Prep & Grocery Log</p>
              <p className="text-white/50 text-xs">Built from your weekly meal plan</p>
            </div>

            {[
              { name: "Chicken Breast", qty: "2 kg", status: "Fresh", tone: "emerald" },
              { name: "Greek Yogurt", qty: "6 cups", status: "Soon", tone: "amber" },
              { name: "Spinach", qty: "1 bag", status: "Urgent", tone: "rose" },
            ].map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-white/50 text-xs">{item.qty}</p>
                </div>
                <Badge
                  className={
                    item.tone === "emerald"
                      ? "bg-emerald-500 text-white border-0"
                      : item.tone === "amber"
                        ? "bg-amber-500 text-black border-0"
                        : "bg-rose-500 text-white border-0"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button className="rounded-xl min-h-12 px-4 border border-white/10 bg-white/5 text-white/85 text-sm flex items-center justify-center gap-2.5">
                <ChefHat className="h-4 w-4" />
                Recipes
              </button>
              <button className="rounded-xl min-h-12 px-4 border border-blue-300/25 bg-blue-600/65 text-white text-sm flex items-center justify-center gap-2.5">
                <ShoppingBag className="h-4 w-4" />
                Grocery Log
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("recipes")
  const [searchQuery, setSearchQuery] = useState("")
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,"
  const [isSignOutConfirmOpen, setSignOutConfirmOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null)
  const [groceryToDelete, setGroceryToDelete] = useState<GroceryItem | null>(null)
  const [selectedPlanDay, setSelectedPlanDay] = useState(() => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return dayNames[new Date().getDay()]
  })

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

  const handleLogout = () => {
    logout()
    setSignOutConfirmOpen(false)
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

  const handleEditGroceryItem = (item: GroceryItem) => {
    setItemToEdit(item)
    setAddGroceryModalOpen(true)
  }

  const handleConfirmDeleteGrocery = () => {
    if (!groceryToDelete) return
    deleteGroceryItem(groceryToDelete.id)
    setGroceryToDelete(null)
  }

  const handleConfirmDeleteRecipe = async () => {
    if (!recipeToDelete) return
    try {
      await deleteRecipe(recipeToDelete.id)
      setRecipeToDelete(null)
    } catch (error) {
      console.error("Failed to delete recipe:", error)
    }
  }

  const handleDeletePlannedMeal = async (mealId: string) => {
    try {
      await deleteMeal(mealId)
    } catch (error) {
      console.error("Failed to delete planned meal:", error)
    }
  }

  const grocerySummary = groceryItems.reduce(
    (acc, item) => {
      const expStatus = getExpirationStatus(item.expirationDate)
      if (expStatus.status === "urgent" || expStatus.status === "expired") acc.urgent += 1
      else if (expStatus.status === "soon") acc.soon += 1
      else if (expStatus.status === "fresh") acc.fresh += 1
      else acc.noExpiry += 1
      return acc
    },
    { urgent: 0, soon: 0, fresh: 0, noExpiry: 0 }
  )

  return (
    <div className="dark min-h-screen bg-[#0f1220] text-foreground transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#171a2b] to-slate-900" />
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[620px] h-[620px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <nav className="sticky top-0 z-50 pt-3">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-14 rounded-2xl border border-white/15 bg-[#11182a]/70 px-4 md:px-5 backdrop-blur-xl shadow-[0_12px_32px_rgba(2,6,23,0.45)]">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 rounded-lg p-1.5">
                <Dumbbell className="h-5 w-5 text-black" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">GymFuel</h1>
              {isAuthenticated && (
                <span className="hidden sm:inline-flex text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white/80">
                  Dashboard
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-xl h-10 px-2.5 border border-white/15 bg-white/5 hover:bg-white/12 gap-2.5">
                      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-lg border border-white/20 bg-white/10">
                        <User className="h-3.5 w-3.5" />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#11182a]" />
                      </span>
                      <span className="hidden md:flex flex-col items-start leading-none min-w-0">
                        <span className="text-xs font-medium max-w-24 truncate">{user?.username}</span>
                        <span className="text-[10px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Saved
                        </span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-2">
                    <DropdownMenuLabel className="p-0">
                      <div className="rounded-xl border border-white/12 bg-white/5 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[10px] uppercase tracking-wider text-slate-400">Account</p>
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider border-blue-300/35 bg-blue-500/20 text-blue-100">
                            {user?.role === "coach" ? "Coach" : "Client"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-300/25 bg-blue-500/20">
                            <User className="h-4 w-4 text-blue-200" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                            <p className="text-[11px] text-slate-300 truncate">{user?.full_name || "GymFuel Member"}</p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-emerald-200">
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                            <span>Cloud Backup Enabled</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <span className="truncate">{user?.email}</span>
                          </div>
                          {user?.client_code && (
                            <div className="flex items-center gap-2 text-xs">
                              <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-slate-400">Code</span>
                              <code className="font-mono bg-blue-500/15 text-blue-200 px-2 py-0.5 rounded-md">{user.client_code}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        setSignOutConfirmOpen(true)
                      }}
                      className="text-rose-200 focus:text-rose-100 focus:bg-rose-500/20"
                    >
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

      <div className="container mx-auto px-4 pb-28 md:pb-20 relative max-w-6xl pt-8">
        {!isAuthenticated ? (
          <LandingPage onSignIn={handleSignIn} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 mobile-app-shell"
          >
            <div className="glass-card overflow-hidden rounded-3xl border border-white/15">
              <div className="p-6 md:p-8 space-y-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{greeting}</p>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      {user?.username || "Athlete"}
                    </h2>
                    <p className="text-sm text-muted-foreground">Keep your nutrition locked in this week.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Recipes</p>
                      <div className="mt-2 flex items-end justify-between">
                        <span className="text-2xl font-bold font-mono text-foreground">{recipes.length}</span>
                        <ChefHat className="h-5 w-5 text-blue-300" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Groceries</p>
                      <div className="mt-2 flex items-end justify-between">
                        <span className="text-2xl font-bold font-mono text-foreground">{groceryItems.length}</span>
                        <ShoppingBag className="h-5 w-5 text-cyan-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <Button onClick={handleAddRecipe} className="glass-button rounded-xl">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Meal
                    </Button>
                    <Button variant="outline" onClick={handleAddGroceryItem} className="rounded-xl border-white/20 bg-white/5">
                      <ShoppingBag className="h-4 w-4 mr-1.5" />
                      Add Grocery
                    </Button>
                  </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
              <div className="hidden md:flex py-2">
                <TabsList className="h-auto w-auto inline-flex gap-1.5">
                  <TabsTrigger value="recipes" className="px-6 py-2 whitespace-nowrap font-medium text-sm min-h-10 md:flex-none">
                    <ChefHat className="h-4 w-4" />
                    Meals
                  </TabsTrigger>
                  <TabsTrigger value="meals" className="px-6 py-2 whitespace-nowrap font-medium text-sm min-h-10 md:flex-none">
                    <Calendar className="h-4 w-4" />
                    Plan
                  </TabsTrigger>
                  <TabsTrigger value="groceries" className="px-6 py-2 whitespace-nowrap font-medium text-sm min-h-10 md:flex-none">
                    <ShoppingBag className="h-4 w-4" />
                    Groceries
                  </TabsTrigger>
                  {user?.role === 'coach' && (
                    <TabsTrigger value="coach" className="px-6 py-2 whitespace-nowrap font-medium text-sm min-h-10 md:flex-none">
                      <Users className="h-4 w-4" />
                      Clients
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
                <div className="mobile-dock p-1.5">
                  <TabsList
                    className={`w-full h-auto grid ${user?.role === "coach" ? "grid-cols-4" : "grid-cols-3"} gap-1 rounded-xl border-none bg-transparent p-0`}
                  >
                    <TabsTrigger value="recipes" className="mobile-dock-trigger min-h-[58px] flex-col gap-1 px-1 py-2 text-[11px] font-medium">
                      <ChefHat className="h-4 w-4" />
                      <span className="leading-none">Meals</span>
                    </TabsTrigger>
                    <TabsTrigger value="meals" className="mobile-dock-trigger min-h-[58px] flex-col gap-1 px-1 py-2 text-[11px] font-medium">
                      <Calendar className="h-4 w-4" />
                      <span className="leading-none">Plan</span>
                    </TabsTrigger>
                    <TabsTrigger value="groceries" className="mobile-dock-trigger min-h-[58px] flex-col gap-1 px-1 py-2 text-[11px] font-medium">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="leading-none">Groceries</span>
                    </TabsTrigger>
                    {user?.role === 'coach' && (
                      <TabsTrigger value="coach" className="mobile-dock-trigger min-h-[58px] flex-col gap-1 px-1 py-2 text-[11px] font-medium">
                        <Users className="h-4 w-4" />
                        <span className="leading-none">Clients</span>
                      </TabsTrigger>
                    )}
                  </TabsList>
                  <div className="pointer-events-none mx-auto mt-1 h-1 w-24 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Overview Tab Removed for Minimalism */}

              <TabsContent value="recipes" className="space-y-6">
                <div className="glass-card rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row gap-3 border-white/20">
                  <div className="flex-1 min-w-[200px] relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-300 transition-colors" />
                    <Input
                      placeholder="Search recipes..."
                      className="pl-10 bg-white/5 border-white/15 focus:border-blue-400 text-foreground placeholder:text-muted-foreground transition-all rounded-xl min-h-11"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button onClick={handleAddRecipe} className="shrink-0 glass-button rounded-xl border-none min-h-11">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Meal</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                  {isAuthenticated && (
                    <Button variant="secondary" onClick={() => setGenerateAIModalOpen(true)} className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/15 text-foreground rounded-xl min-h-11">
                      <Sparkles className="h-4 w-4 sm:mr-2 text-cyan-500" />
                      <span className="hidden sm:inline">AI Generate</span>
                    </Button>
                  )}
                </div>

                <div className="glass-card overflow-hidden rounded-2xl border-white/20">
                  <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                    <div className="p-5 md:p-6 space-y-2.5">
                      <p className="text-xs uppercase tracking-wider text-blue-200/80">Meal Library</p>
                      <h3 className="text-xl md:text-2xl font-semibold text-white">Build your high-protein rotation.</h3>
                      <p className="text-sm text-muted-foreground">
                        Save your go-to meals and quickly drop them into your weekly plan.
                      </p>
                    </div>
                    <div className="image-surface relative min-h-[210px] md:min-h-[190px] m-3 md:m-4">
                      <img
                        src="https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&auto=format&fit=crop&q=60"
                        alt="Meal prep containers"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1220]/65 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>

                {filteredRecipes.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-xl border-dashed">
                    <div className="bg-white/5 w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
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
                        <div className="glass-card overflow-hidden hover:border-blue-300/35 transition-all cursor-pointer group relative rounded-xl h-full flex flex-col">
                          <div className="image-surface h-40 md:h-32 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 relative overflow-hidden rounded-none border-x-0 border-t-0 border-b border-white/12">
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
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1220]/50 via-transparent to-transparent z-[1]" />
                            <Badge className="absolute top-3 left-3 z-[3] bg-black/60 backdrop-blur-sm border-none text-white text-xs">
                              {recipe.difficulty}
                            </Badge>
                          </div>

                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-3 right-3 z-[5] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity rounded-lg w-9 h-9"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRecipeToDelete(recipe)
                            }}
                            aria-label={`Delete recipe ${recipe.title}`}
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
                                <div className="flex items-center gap-1.5 font-mono font-semibold text-blue-300 bg-blue-500/15 px-2.5 py-1 rounded-md">
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
                                className="w-full rounded-lg border-white/15 bg-white/5 hover:bg-white/5 hover:border-blue-300/35 text-foreground transition-colors"
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
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Weekly Fuel Plan
                    <Badge className="bg-blue-500/20 border border-blue-300/35 text-blue-200">This Week</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">Plan your nutrition to hit your daily targets.</p>
                </div>

                {recipes.length === 0 && (
                  <div className="rounded-2xl border border-amber-300/25 bg-amber-500/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-sm text-amber-100">Add meals first so your weekly plan has options.</p>
                    <Button size="sm" variant="outline" onClick={() => setActiveTab("recipes")} className="border-amber-200/30 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20">
                      Go to Meals
                    </Button>
                  </div>
                )}

                <div className="md:hidden grid grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <Button
                      key={day}
                      variant="ghost"
                      className="mobile-day-chip text-xs px-2"
                      data-active={selectedPlanDay === day ? "true" : "false"}
                      onClick={() => setSelectedPlanDay(day)}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  {weekDays.map((day) => {
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
                        setActiveTab("recipes")
                        return
                      }
                      const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]

                      // Calculate date for the day
                      const today = new Date()
                      const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                      const currentDayIndex = today.getDay() || 7
                      const targetDayIndexAdjusted = DAYS.indexOf(dayName) + 1
                      let daysToAdd = targetDayIndexAdjusted - currentDayIndex
                      if (daysToAdd < 0) daysToAdd += 7
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

                    const dayMealsCount = ["Breakfast", "Lunch", "Dinner", "Snack"].reduce(
                      (total, mealType) => total + getMealsForDay(day, mealType).length,
                      0
                    )

                    return (
                      <div
                        key={day}
                        className={`glass-card rounded-2xl p-4 md:p-5 border-white/20 ${day !== selectedPlanDay ? "hidden md:block" : ""}`}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="font-semibold text-blue-300 text-sm uppercase tracking-wider">{day}</div>
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{dayMealsCount} planned</Badge>
                        </div>
                        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                          {["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType) => {
                            const plannedMeals = getMealsForDay(day, mealType)
                            return (
                              <div key={mealType} className="bg-[#11182a]/75 rounded-xl p-3 text-sm border border-white/12 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{mealType}</span>
                                  {plannedMeals.length === 0 && recipes.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 md:h-6 md:w-6 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-md"
                                      onClick={() => handleRandomise(day, mealType)}
                                      title="Randomise"
                                    >
                                      <Shuffle className="h-3.5 w-3.5 md:h-3 md:w-3" />
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
                                            className="h-8 w-8 md:h-7 md:w-7 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-md"
                                            onClick={() => {
                                              setMealToEdit(plannedMeals[0])
                                              setEditMealModalOpen(true)
                                            }}
                                            title="Edit"
                                            aria-label="Edit planned meal"
                                          >
                                            <Pencil className="h-4 w-4 md:h-3.5 md:w-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 md:h-7 md:w-7 text-muted-foreground hover:text-destructive hover:bg-white/10 rounded-md"
                                            onClick={() => {
                                              void handleDeletePlannedMeal(plannedMeals[0].id)
                                            }}
                                            title="Remove"
                                            aria-label="Remove planned meal"
                                          >
                                            <X className="h-4 w-4 md:h-3.5 md:w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                      {plannedMeals[0].recipe?.nutritionalInfo?.protein !== undefined && (
                                        <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-blue-300 bg-blue-500/15 px-1.5 py-0.5 rounded w-fit">
                                          <Dumbbell className="h-3 w-3" />
                                          {plannedMeals[0].recipe.nutritionalInfo.protein}g
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-full justify-between bg-white/5 border-white/15 text-foreground hover:bg-white/10 h-8">
                                          <span className="truncate">{plannedMeals[0].recipeName}</span>
                                          <Badge variant="secondary" className="ml-1 bg-secondary text-secondary-foreground">{plannedMeals.length}</Badge>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>Planned Meals</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {plannedMeals.map(meal => (
                                          <DropdownMenuItem
                                            key={meal.id}
                                            onSelect={(e) => e.preventDefault()}
                                            className="flex items-center justify-between"
                                          >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                              <span className="text-sm font-medium text-foreground truncate">
                                                {meal.recipeName || 'Unknown Recipe'}
                                              </span>
                                              {meal.recipe?.nutritionalInfo?.protein !== undefined && (
                                                <div className="flex items-center gap-1 text-[10px] font-mono text-blue-300 bg-blue-500/15 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                  <Dumbbell className="h-3 w-3" />
                                                  {meal.recipe.nutritionalInfo.protein}g
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex gap-1">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 md:h-7 md:w-7 text-muted-foreground hover:text-foreground"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setMealToEdit(meal)
                                                  setEditMealModalOpen(true)
                                                }}
                                                aria-label="Edit planned meal"
                                              >
                                                <Pencil className="h-4 w-4 md:h-3.5 md:w-3.5" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 md:h-7 md:w-7 text-muted-foreground hover:text-destructive hover:bg-white/10"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  void handleDeletePlannedMeal(meal.id)
                                                }}
                                                aria-label="Remove planned meal"
                                              >
                                                <X className="h-4 w-4 md:h-3.5 md:w-3.5" />
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
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      My Groceries
                      <Badge className="bg-cyan-500/20 border border-cyan-300/30 text-cyan-200">{groceryItems.length}</Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">Track ingredients and expiration dates</p>
                  </div>
                  <div className="flex w-full sm:w-auto gap-2">
                    <Button onClick={handleAddGroceryItem} className="glass-button rounded-lg border-none flex-1 sm:flex-none">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {groceryItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="rounded-xl border border-red-300/25 bg-red-500/10 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-red-200/80">Urgent</p>
                      <p className="text-lg font-semibold text-red-100">{grocerySummary.urgent}</p>
                    </div>
                    <div className="rounded-xl border border-amber-300/25 bg-amber-500/10 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-amber-200/80">Soon</p>
                      <p className="text-lg font-semibold text-amber-100">{grocerySummary.soon}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-300/25 bg-emerald-500/10 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-emerald-200/80">Fresh</p>
                      <p className="text-lg font-semibold text-emerald-100">{grocerySummary.fresh}</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/5 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-white/70">No Expiry</p>
                      <p className="text-lg font-semibold text-white/90">{grocerySummary.noExpiry}</p>
                    </div>
                  </div>
                )}

                {groceryItems.length === 0 ? (
                  <div className="glass-card p-12 text-center rounded-xl border-dashed">
                    <div className="bg-white/5 w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
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
                  <div className="space-y-2.5">
                      {groceryItems.map((item) => {
                        const expStatus = getExpirationStatus(item.expirationDate)
                        return (
                          <div
                            key={item.id}
                            className={`rounded-2xl border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 transition-colors group ${expStatus.status === 'urgent' || expStatus.status === 'expired'
                              ? 'bg-red-500/10 border-red-300/25'
                              : expStatus.status === 'soon'
                                ? 'bg-amber-500/10 border-amber-300/25'
                                : 'bg-white/5 border-white/15 hover:bg-white/10'
                              }`}
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-foreground text-base sm:text-lg">{item.name}</div>
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
                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
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
                              <div className="flex gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-lg"
                                  onClick={() => handleEditGroceryItem(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-white/10 rounded-lg"
                                  onClick={() => setGroceryToDelete(item)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
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
      <Dialog open={!!groceryToDelete} onOpenChange={(open) => !open && setGroceryToDelete(null)}>
        <DialogContent className="max-w-sm border-white/15 bg-[#1a2133]/80">
          <DialogHeader>
            <DialogTitle>Delete Grocery Item?</DialogTitle>
            <DialogDescription>
              {groceryToDelete
                ? `Are you sure you want to remove "${groceryToDelete.name}" from your grocery list?`
                : "Are you sure you want to remove this item?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-white/15" onClick={() => setGroceryToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteGrocery}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!recipeToDelete} onOpenChange={(open) => !open && setRecipeToDelete(null)}>
        <DialogContent className="max-w-sm border-white/15 bg-[#1a2133]/80">
          <DialogHeader>
            <DialogTitle>Delete Recipe?</DialogTitle>
            <DialogDescription>
              {recipeToDelete
                ? `Are you sure you want to delete "${recipeToDelete.title}"?`
                : "Are you sure you want to delete this recipe?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-white/15" onClick={() => setRecipeToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteRecipe}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isSignOutConfirmOpen} onOpenChange={setSignOutConfirmOpen}>
        <DialogContent className="max-w-sm border-white/15 bg-[#1a2133]/80">
          <DialogHeader>
            <DialogTitle>Sign Out?</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? Your data will remain in the cloud.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-white/15" onClick={() => setSignOutConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}
