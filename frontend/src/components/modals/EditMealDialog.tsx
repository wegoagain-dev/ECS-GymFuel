
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { Meal } from "@/lib/types"
import { Loader2, Pencil } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"]

interface EditMealModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    meal: Meal | null
}

export function EditMealDialog({ isOpen, onOpenChange, meal }: EditMealModalProps) {
    const { updateMeal } = useStore()

    const [day, setDay] = useState("")
    const [mealType, setMealType] = useState("")
    const [notes, setNotes] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (meal && isOpen) {
            setMealType(meal.mealType)
            setNotes(meal.notes || "")
            // Determine Day from Date
            const d = new Date(meal.date)
            // Fix timezone offset issue if necessary, or just rely on local date
            // Date string "YYYY-MM-DD" usually parses as UTC midnight, which might be day-before in some TZs
            // Using a simple array map assuming meal.date is correct string:
            const dayIndex = d.getDay() || 7 // 1=Mon, 7=Sun
            // Wait, d.getDay() depends on local time vs UTC. 
            // Better to parse YYYY-MM-DD explicitly.
            const [y, m, dateDay] = meal.date.split('-').map(Number)
            const localDate = new Date(y, m - 1, dateDay)
            const dayName = localDate.toLocaleDateString('en-US', { weekday: 'long' })
            setDay(dayName)
        }
    }, [meal, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!meal) return

        setIsLoading(true)

        try {
            // Calculate new date based on selected Day
            // We want to keep the same WEEK but change the DAY.
            // Assuming "This Week" logic.
            // Or, simpler: Just change the day relative to the current meal date?
            // If I move Monday -> Tuesday, I add 1 day.
            // If I move Sunday -> Monday, I subtract 6 days.
            // This is complex. 

            // SIMPLER FOR MVP: Just assume the date doesn't change OR ask for exact date?
            // User request: "people start to make modifications".
            // If they want to move it to another day, we need logic.
            // Let's implement: Recalculate date based on the *closest* chosen day from Today?
            // Or relative to the original meal date?

            // Strategy: Calculate the difference between current meal day and new day.
            const currentDayIndex = new Date(meal.date).getDay() || 7
            const targetDayIndex = DAYS.indexOf(day) + 1
            const diff = targetDayIndex - currentDayIndex

            const originalDate = new Date(meal.date)
            originalDate.setDate(originalDate.getDate() + diff)

            const updatedMeal: Meal = {
                ...meal,
                date: originalDate.toISOString().split('T')[0],
                mealType: mealType as Meal['mealType'],
                notes: notes
            }

            await updateMeal(updatedMeal)
            onOpenChange(false)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    if (!meal) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm z-[100]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="h-5 w-5 text-orange-500" />
                        Edit Meal
                    </DialogTitle>
                    <DialogDescription>
                        Modify details for <strong>{meal.recipeName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Day of the Week</Label>
                        <Select value={day} onValueChange={setDay}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[101]">
                                {DAYS.map(d => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Moves meal to this day in the same week.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Meal Type</Label>
                        <Select value={mealType} onValueChange={setMealType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[101]">
                                {MEAL_TYPES.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes..."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
