"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { api } from "@/lib/api"
import { ClientSummary, Meal, Recipe } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Users, Trash2, Utensils, ChefHat, Dumbbell } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function CoachDashboard() {
    const { user } = useStore()
    const [clients, setClients] = useState<ClientSummary[]>([])
    const [isLoadingClients, setIsLoadingClients] = useState(false)
    const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(null)
    const [clientToUnlink, setClientToUnlink] = useState<ClientSummary | null>(null)
    const [clientMeals, setClientMeals] = useState<Meal[]>([])
    const [clientRecipes, setClientRecipes] = useState<Recipe[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)

    // Add Client State
    const [addClientEmail, setAddClientEmail] = useState("")
    const [addClientCode, setAddClientCode] = useState("")
    const [isAddingClient, setIsAddingClient] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)
    const [addSuccess, setAddSuccess] = useState<string | null>(null)

    useEffect(() => {
        if (user?.role === "coach") {
            loadClients()
        }
    }, [user])

    const loadClients = async () => {
        setIsLoadingClients(true)
        try {
            const data = await api.getClients()
            setClients(data)
        } catch (error) {
            console.error("Failed to load clients:", error)
        } finally {
            setIsLoadingClients(false)
        }
    }

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddError(null)
        setAddSuccess(null)
        setIsAddingClient(true)

        try {
            await api.linkClient(addClientEmail, addClientCode)
            setAddSuccess("Client linked successfully!")
            setAddClientEmail("")
            setAddClientCode("")
            loadClients()
        } catch (error) {
            setAddError(error instanceof Error ? error.message : "Failed to link client")
        } finally {
            setIsAddingClient(false)
        }
    }

    const handleViewClient = async (client: ClientSummary) => {
        setSelectedClient(client)
        setIsLoadingData(true)
        try {
            const [meals, recipes] = await Promise.all([
                api.getClientMeals(client.id),
                api.getClientRecipes(client.id)
            ])
            setClientMeals(meals)
            setClientRecipes(recipes)
        } catch (error) {
            console.error("Failed to load client data:", error)
        } finally {
            setIsLoadingData(false)
        }
    }

    const handleUnlinkClient = async (clientId: number) => {
        try {
            await api.unlinkClient(clientId)
            loadClients()
            if (selectedClient?.id === clientId) {
                setSelectedClient(null)
                setClientMeals([])
                setClientRecipes([])
            }
        } catch (error) {
            console.error("Failed to unlink client:", error)
        } finally {
            setClientToUnlink(null)
        }
    }

    const getCurrentWeekBounds = () => {
        const now = new Date()
        const start = new Date(now)
        const day = start.getDay() || 7
        start.setDate(start.getDate() - (day - 1))
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)
        return { start, end }
    }

    const getClientWeekSnapshot = () => {
        const { start, end } = getCurrentWeekBounds()
        const weekMeals = clientMeals.filter((meal) => {
            const d = new Date(`${meal.date}T12:00:00`)
            return d >= start && d <= end
        })
        const plannedDays = new Set(weekMeals.map((m) => m.date)).size
        const recipesWithProtein = clientRecipes.filter((r) => (r.nutritionalInfo?.protein || 0) > 0).length
        const coverage = Math.round((plannedDays / 7) * 100)

        return {
            plannedMeals: weekMeals.length,
            plannedDays,
            recipesWithProtein,
            coverage,
        }
    }

    if (user?.role !== "coach") {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center glass-card rounded-xl">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Coach Access Only</h3>
                <p className="text-muted-foreground">Please sign in as a coach to access this dashboard.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Coach Dashboard</h2>
                    <p className="text-muted-foreground">Manage your clients and track their progress.</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden rounded-3xl border border-white/15">
                <div className="grid md:grid-cols-[1.2fr_1fr]">
                    <div className="p-6 space-y-3">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Coach Overview</p>
                        <h3 className="text-xl font-semibold text-foreground">Client nutrition snapshots in one place.</h3>
                        <p className="text-sm text-muted-foreground">Link clients, review plans, and keep accountability high with faster weekly check-ins.</p>
                    </div>
                    <div className="image-surface relative min-h-[180px] m-3 md:m-4">
                        <img
                            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=60"
                            alt="Coach planning session"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0f1220]/70 to-transparent" />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 md:gap-8">
                <Card className="md:col-span-1 border-white/15 bg-[#1a2133]/80">
                    <CardHeader>
                        <CardTitle>Link New Client</CardTitle>
                        <CardDescription>Enter client&apos;s email and their unique code.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddClient} className="space-y-4">
                            {addError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{addError}</AlertDescription>
                                </Alert>
                            )}
                            {addSuccess && (
                                <Alert className="border-emerald-500 text-emerald-500">
                                    <AlertDescription>{addSuccess}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label>Client Email</Label>
                                <Input
                                    value={addClientEmail}
                                    onChange={(e) => setAddClientEmail(e.target.value)}
                                    placeholder="client@example.com"
                                    required
                                    className="bg-white/5 border-white/15"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Unique Client Code</Label>
                                <Input
                                    value={addClientCode}
                                    onChange={(e) => setAddClientCode(e.target.value)}
                                    placeholder="e.g. A1B2C3D4"
                                    required
                                    className="bg-white/5 border-white/15"
                                />
                            </div>
                            <Button className="w-full glass-button" type="submit" disabled={isAddingClient}>
                                {isAddingClient ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Link Client
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1 border-white/15 bg-[#1a2133]/80">
                    <CardHeader>
                        <CardTitle>My Clients</CardTitle>
                        <CardDescription>Select a client to view their meal plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingClients ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : clients.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground border border-dashed border-white/15 rounded-lg">
                                <p>No clients linked yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {clients.map((client) => (
                                    <div
                                        key={client.id}
                                        className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedClient?.id === client.id
                                            ? "bg-blue-500/15 border-blue-300/45"
                                            : "bg-white/5 border-white/15 hover:border-blue-300/35"
                                            }`}
                                        onClick={() => {
                                            handleViewClient(client)
                                            // Scroll to details on mobile
                                            setTimeout(() => {
                                                document.getElementById('client-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                            }, 100)
                                        }}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium truncate text-foreground">{client.full_name || client.username}</p>
                                            <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button variant="ghost" size="sm" className="rounded-lg" onClick={(e) => { e.stopPropagation(); setClientToUnlink(client) }}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {selectedClient && (
                <div id="client-details" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-20">
                    {(() => {
                        const snapshot = getClientWeekSnapshot()
                        return (
                            <div className="glass-card rounded-2xl border border-white/15 p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Weekly Compliance Snapshot</p>
                                        <p className="text-sm text-foreground">Signals from planned meals and recipe library.</p>
                                    </div>
                                    <div className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider border ${snapshot.coverage >= 70
                                        ? "border-emerald-300/30 bg-emerald-500/15 text-emerald-100"
                                        : snapshot.coverage >= 40
                                            ? "border-amber-300/30 bg-amber-500/15 text-amber-100"
                                            : "border-rose-300/30 bg-rose-500/15 text-rose-100"
                                        }`}>
                                        {snapshot.coverage}% day coverage
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Planned Meals</p>
                                        <p className="mt-1 text-lg font-semibold text-foreground">{snapshot.plannedMeals}</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Days</p>
                                        <p className="mt-1 text-lg font-semibold text-foreground">{snapshot.plannedDays}/7</p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Protein Recipes</p>
                                        <p className="mt-1 text-lg font-semibold text-foreground">{snapshot.recipesWithProtein}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}

                    <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                        <Utensils className="h-5 w-5 text-blue-300" />
                        Viewing {selectedClient.full_name || selectedClient.username}
                    </h3>

                    {isLoadingData ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-300" />
                        </div>
                    ) : (
                        <Tabs defaultValue="meals" className="space-y-4">
                            <TabsList className="w-full h-auto grid grid-cols-2 gap-1 bg-white/5 border-white/20">
                                <TabsTrigger value="meals" className="mobile-dock-trigger min-h-10 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">Log (Meal Plan)</TabsTrigger>
                                <TabsTrigger value="recipes" className="mobile-dock-trigger min-h-10 text-xs sm:text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">Recipe Library</TabsTrigger>
                            </TabsList>

                            <TabsContent value="meals" className="space-y-4">
                                {clientMeals.length === 0 ? (
                                    <div className="text-center p-12 glass-card rounded-xl border-dashed">
                                        <p className="text-muted-foreground">No scheduled meals found.</p>
                                        <p className="text-xs text-muted-foreground mt-1">Client needs to add recipes to their &quot;Meal Plan&quot;.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2 md:hidden">
                                            {clientMeals.map((meal) => (
                                                <div key={meal.id} className="rounded-xl border border-white/15 bg-white/5 p-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-xs uppercase tracking-wider text-muted-foreground">{new Date(meal.date).toLocaleDateString()}</p>
                                                        <span className="text-[10px] rounded-md bg-blue-500/20 text-blue-200 px-2 py-0.5 uppercase tracking-wide">{meal.mealType}</span>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-foreground">{meal.recipeName || "Custom Meal"}</p>
                                                    {meal.notes && <p className="mt-1 text-xs text-muted-foreground">{meal.notes}</p>}
                                                </div>
                                            ))}
                                        </div>
                                        <Card className="hidden md:block border-white/15 bg-[#1a2133]/80">
                                            <CardContent className="p-0">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-white/15 hover:bg-transparent">
                                                            <TableHead className="w-[100px]">Date</TableHead>
                                                            <TableHead className="min-w-[150px]">Meal</TableHead>
                                                            <TableHead className="min-w-[150px]">Notes</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {clientMeals.map((meal) => (
                                                            <TableRow key={meal.id} className="border-white/15 hover:bg-white/5">
                                                                <TableCell className="font-medium whitespace-nowrap">{new Date(meal.date).toLocaleDateString()}</TableCell>
                                                                <TableCell>{meal.recipeName || "Custom Meal"}</TableCell>
                                                                <TableCell className="text-muted-foreground">{meal.notes || "-"}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="recipes" className="space-y-4">
                                {clientRecipes.length === 0 ? (
                                    <div className="text-center p-12 glass-card rounded-xl border-dashed">
                                        <p className="text-muted-foreground">No recipes created yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {clientRecipes.map((recipe) => (
                                            <Card key={recipe.id} className="border-white/15 bg-[#1a2133]/80">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-base">{recipe.title}</CardTitle>
                                                        <div className="flex items-center gap-1 text-xs font-mono text-blue-300">
                                                            <Dumbbell className="h-3 w-3" />
                                                            {recipe.nutritionalInfo?.protein || 0}g
                                                        </div>
                                                    </div>
                                                    <CardDescription className="text-xs line-clamp-2">
                                                        {recipe.description || "No description"}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <ChefHat className="h-3 w-3" />
                                                            {recipe.difficulty}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            )}
            <Dialog open={!!clientToUnlink} onOpenChange={(open) => !open && setClientToUnlink(null)}>
                <DialogContent className="max-w-sm border-white/15 bg-[#1a2133]/80">
                    <DialogHeader>
                        <DialogTitle>Unlink Client?</DialogTitle>
                        <DialogDescription>
                            {clientToUnlink
                                ? `Are you sure you want to unlink ${clientToUnlink.full_name || clientToUnlink.username}?`
                                : "Are you sure you want to unlink this client?"}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="border-white/15" onClick={() => setClientToUnlink(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => clientToUnlink && handleUnlinkClient(clientToUnlink.id)}>
                            Unlink
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
