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
            const targetDayIndex = DAYS.indexOf(day) + 1 // 1-7 (Mon-Sun) if we map properly?
            // Actually JS getDay() is 0=Sun, 1=Mon.
            // Let's stick to simple day names for now if the Meal type allows, 
            // BUT Meal interface asks for `date: string` (ISO).
            // Let's calculate the real date.

            const currentDayIndex = today.getDay() || 7 // Make Sunday 7 instead of 0 for easier math with Mon=1
            const targetDayIndexAdjusted = DAYS.indexOf(day) + 1

            let daysToAdd = targetDayIndexAdjusted - currentDayIndex
            if (daysToAdd <= 0) {
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
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Add to Meal Plan
                    </DialogTitle>
                    <DialogDescription>
                        Schedule <strong>{selectedRecipeForPlan.title}</strong> for the week.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Day of the Week</Label>
                        <Select value={day} onValueChange={setDay}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {DAYS.map(d => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Meal Type</Label>
                        <Select value={mealType} onValueChange={setMealType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MEAL_TYPES.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setAddToMealPlanModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
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
