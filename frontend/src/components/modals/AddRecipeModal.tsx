"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { Loader2 } from "lucide-react"
import { generateId } from "@/lib/storage"

export function AddRecipeModal() {
    const { isAddRecipeModalOpen, setAddRecipeModalOpen, addRecipe } = useStore()
    const [isLoading, setIsLoading] = useState(false)

    // Simplified State
    const [title, setTitle] = useState("")
    const [protein, setProtein] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState("")

    const resetForm = () => {
        setTitle("")
        setProtein("")
        setDescription("")
        setTags("")
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const newRecipe = {
                id: generateId(),
                title,
                description,
                instructions: "No instructions provided.",
                ingredients: [],
                prepTime: 0,
                cookTime: 0,
                servings: 1,
                difficulty: "Easy" as const,
                imageUrl: "",
                tags: tags.split(",").map(t => t.trim()).filter(t => t !== ""),
                nutritionalInfo: {
                    protein: parseInt(protein) || 0,
                    calories: 0,
                    carbs: 0,
                    fat: 0
                },
                createdAt: new Date().toISOString()
            }

            await addRecipe(newRecipe)
            setAddRecipeModalOpen(false)
            resetForm()
        } catch (error) {
            console.error("Failed to add meal:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isAddRecipeModalOpen} onOpenChange={setAddRecipeModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Meal</DialogTitle>
                    <DialogDescription>
                        Add a high-protein meal to your collection.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Meal Name *</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Chicken & Rice"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="protein">Protein (g) *</Label>
                        <div className="relative">
                            <Input
                                id="protein"
                                type="number"
                                placeholder="e.g. 40"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                required
                                className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">g</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Optional, comma-separated)</Label>
                        <Input
                            id="tags"
                            placeholder="Lunch, Bulking, Quick"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setAddRecipeModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Meal
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
