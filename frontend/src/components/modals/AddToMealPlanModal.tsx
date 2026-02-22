"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { generateId } from "@/lib/storage"
import { Meal } from "@/lib/types"
import { Calendar, Loader2 } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"]

export function AddToMealPlanModal() {
    const {
        isAddToMealPlanModalOpen,
        setAddToMealPlanModalOpen,
        selectedRecipeForPlan,
        addMeal
    } = useStore()

    const [day, setDay] = useState("Monday")
    const [mealType, setMealType] = useState("Lunch")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedRecipeForPlan) return

        setIsLoading(true)

        try {
            // Calculate date for the next occurrence of the selected day
            // For MVP simplicity, we'll just store the day name as the date string or 
            // handle it better in specific logic. 
            // Ideally, we should pick a real date. Let's pick the NEXT occurrence of this day.

            const today = new Date()
            // Actually JS getDay() is 0=Sun, 1=Mon.
            // Let's stick to simple day names for now if the Meal type allows, 
            // BUT Meal interface asks for `date: string` (ISO).
            // Let's calculate the real date.

            const currentDayIndex = today.getDay() || 7 // Make Sunday 7 instead of 0 for easier math with Mon=1
            const targetDayIndexAdjusted = DAYS.indexOf(day) + 1

            let daysToAdd = targetDayIndexAdjusted - currentDayIndex
            if (daysToAdd < 0) {
                daysToAdd += 7
            }

            const targetDate = new Date(today)
            targetDate.setDate(today.getDate() + daysToAdd)

            const meal: Meal = {
                id: generateId(),
                date: targetDate.toISOString().split('T')[0], // YYYY-MM-DD
                mealType: mealType as Meal['mealType'],
                recipeId: selectedRecipeForPlan.id,
                recipeName: selectedRecipeForPlan.title,
                notes: `Planned via Recipe Card`,
                createdAt: new Date().toISOString(),
            }

            await addMeal(meal)
            setAddToMealPlanModalOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    if (!selectedRecipeForPlan) return null

    return (
        <Dialog open={isAddToMealPlanModalOpen} onOpenChange={setAddToMealPlanModalOpen}>
            <DialogContent className="max-w-sm border-white/20 bg-[#131a2c]/92">
                <DialogHeader className="pr-8">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-300/25">
                            <Calendar className="h-4 w-4 text-blue-300" />
                        </span>
                        Add to Meal Plan
                    </DialogTitle>
                    <DialogDescription>
                        Schedule <strong>{selectedRecipeForPlan.title}</strong> for the week.
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/15 to-violet-500/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-white/60">Planning</p>
                    <p className="text-sm text-white/85">Pick a day and meal slot. GymFuel will place it into your weekly view.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-slate-300">Day of the Week</Label>
                        <Select value={day} onValueChange={setDay}>
                            <SelectTrigger className="bg-white/5 border-white/15">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-white/15 bg-[#1a2133]/80">
                                {DAYS.map(d => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wider text-slate-300">Meal Type</Label>
                        <Select value={mealType} onValueChange={setMealType}>
                            <SelectTrigger className="bg-white/5 border-white/15">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-white/15 bg-[#1a2133]/80">
                                {MEAL_TYPES.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setAddToMealPlanModalOpen(false)} className="border-white/15 rounded-xl w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="glass-button rounded-xl w-full sm:w-auto">
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Add to Plan"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
