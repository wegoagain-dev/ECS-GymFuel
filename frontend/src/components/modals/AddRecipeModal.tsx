"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { ChefHat, Loader2 } from "lucide-react"
import { generateId } from "@/lib/storage"

export function AddRecipeModal() {
    const { isAddRecipeModalOpen, setAddRecipeModalOpen, addRecipe } = useStore()
    const [isLoading, setIsLoading] = useState(false)

    // Simplified State
    const [title, setTitle] = useState("")
    const [protein, setProtein] = useState("")
    const [description, setDescription] = useState("")
    const [ingredientsText, setIngredientsText] = useState("")
    const [tags, setTags] = useState("")

    const resetForm = () => {
        setTitle("")
        setProtein("")
        setDescription("")
        setIngredientsText("")
        setTags("")
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const ingredients = ingredientsText
                .split(/\n|,/)
                .map(i => i.trim())
                .filter(Boolean)

            const newRecipe = {
                id: generateId(),
                title,
                description,
                instructions: "No instructions provided.",
                ingredients,
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
            <DialogContent className="sm:max-w-[500px] border-white/20 bg-[#131a2c]/92">
                <DialogHeader className="pr-8">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-300/25">
                            <ChefHat className="h-4 w-4 text-blue-300" />
                        </span>
                        Add New Meal
                    </DialogTitle>
                    <DialogDescription>
                        Add a high-protein meal to your collection.
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-white/60">Quick Tip</p>
                    <p className="text-sm text-white/85">Add protein and tags now so planning and search work better later.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs uppercase tracking-wider text-slate-300">Meal Name *</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Chicken & Rice"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="bg-white/5 border-white/15"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="protein" className="text-xs uppercase tracking-wider text-slate-300">Protein (g) *</Label>
                        <div className="relative">
                            <Input
                                id="protein"
                                type="number"
                                placeholder="e.g. 40"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                required
                                className="pr-8 bg-white/5 border-white/15"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">g</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs uppercase tracking-wider text-slate-300">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-white/5 border-white/15"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ingredients" className="text-xs uppercase tracking-wider text-slate-300">Ingredients (for grocery generation)</Label>
                        <Textarea
                            id="ingredients"
                            placeholder={"e.g. 200g chicken breast\n1 cup rice\n1 tbsp olive oil"}
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            className="bg-white/5 border-white/15 min-h-20"
                        />
                        <p className="text-xs text-muted-foreground">Use one ingredient per line (or comma-separated) so “From Plan” can build groceries.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags" className="text-xs uppercase tracking-wider text-slate-300">Tags (Optional, comma-separated)</Label>
                        <Input
                            id="tags"
                            placeholder="Lunch, Bulking, Quick"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="bg-white/5 border-white/15"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setAddRecipeModalOpen(false)} className="border-white/15 rounded-xl w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="glass-button rounded-xl w-full sm:w-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Meal
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
