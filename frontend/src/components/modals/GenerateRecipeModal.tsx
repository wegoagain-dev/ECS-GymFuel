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
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        AI Recipe Generator
                    </DialogTitle>
                    <DialogDescription>
                        Generate personalised, high-protein recipes with AI.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Coming Soon</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                            We&apos;re building an AI-powered recipe generator that creates personalised meals based on your fitness goals and dietary preferences.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setGenerateAIModalOpen(false)} className="w-full">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
