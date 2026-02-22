"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { api } from "@/lib/api"
import { generateId } from "@/lib/storage"
import { Recipe } from "@/lib/types"
import { Loader2, Sparkles } from "lucide-react"

export function GenerateRecipeModal() {
    const { isGenerateAIModalOpen, setGenerateAIModalOpen, addRecipe, isAuthenticated } = useStore()

    const [prompt, setPrompt] = useState("")
    const [dietaryRestrictions, setDietaryRestrictions] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return

        setIsLoading(true)
        setError(null)

        try {
            const generatedRecipe = await api.generateAIRecipe(prompt, dietaryRestrictions || undefined)

            const recipe: Recipe = {
                id: generateId(),
                ...generatedRecipe,
                createdAt: new Date().toISOString(),
            }

            addRecipe(recipe)
            setGenerateAIModalOpen(false)
            setPrompt("")
            setDietaryRestrictions("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate recipe. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <Dialog open={isGenerateAIModalOpen} onOpenChange={setGenerateAIModalOpen}>
            <DialogContent className="max-w-lg border-white/20 bg-[#131a2c]/92">
                <DialogHeader className="pr-8">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-300/25">
                            <Sparkles className="h-4 w-4 text-cyan-300" />
                        </span>
                        AI Recipe Generator
                    </DialogTitle>
                    <DialogDescription>
                        Generate personalised, high-protein recipes with AI.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/12 to-blue-500/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-white/60">AI Assistant</p>
                    <p className="text-sm text-white/85">Describe your goal and GymFuel will generate a recipe suggestion with macros.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-sm text-rose-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="ai-prompt" className="text-xs uppercase tracking-wider text-slate-300">Goal or meal idea</Label>
                        <Input
                            id="ai-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. 40g protein post-workout dinner"
                            className="bg-white/5 border-white/15"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ai-restrictions" className="text-xs uppercase tracking-wider text-slate-300">Dietary restrictions (optional)</Label>
                        <Input
                            id="ai-restrictions"
                            value={dietaryRestrictions}
                            onChange={(e) => setDietaryRestrictions(e.target.value)}
                            placeholder="e.g. dairy-free, low carb"
                            className="bg-white/5 border-white/15"
                            disabled={isLoading}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setGenerateAIModalOpen(false)} className="border-white/15 rounded-xl w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" className="glass-button rounded-xl w-full sm:w-auto" disabled={isLoading || !prompt.trim()}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            Generate
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
