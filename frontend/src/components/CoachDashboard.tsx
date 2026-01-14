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

export function CoachDashboard() {
    const { user } = useStore()
    const [clients, setClients] = useState<ClientSummary[]>([])
    const [isLoadingClients, setIsLoadingClients] = useState(false)
    const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(null)
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
        if (!confirm("Are you sure you want to unlink this client?")) return

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
        }
    }

    if (user?.role !== "coach") {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
                <Users className="h-12 w-12 text-zinc-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coach Access Only</h3>
                <p className="text-zinc-500 dark:text-zinc-400">Please sign in as a coach to access this dashboard.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Coach Dashboard</h2>
                    <p className="text-zinc-400">Manage your clients and track their progress.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="md:col-span-1 border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle>Link New Client</CardTitle>
                        <CardDescription>Enter client's email and their unique code.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddClient} className="space-y-4">
                            {addError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{addError}</AlertDescription>
                                </Alert>
                            )}
                            {addSuccess && (
                                <Alert className="border-green-600 text-green-600">
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
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Unique Client Code</Label>
                                <Input
                                    value={addClientCode}
                                    onChange={(e) => setAddClientCode(e.target.value)}
                                    placeholder="e.g. A1B2C3D4"
                                    required
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={isAddingClient}>
                                {isAddingClient ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Link Client
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-1 border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle>My Clients</CardTitle>
                        <CardDescription>Select a client to view their meal plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingClients ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                            </div>
                        ) : clients.length === 0 ? (
                            <div className="text-center p-8 text-zinc-500 border border-dashed border-gray-200 dark:border-zinc-800 rounded-lg">
                                <p>No clients linked yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {clients.map((client) => (
                                    <div
                                        key={client.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedClient?.id === client.id
                                            ? "bg-orange-50 border-orange-500/50 dark:bg-purple-900/20 dark:border-purple-500/50"
                                            : "bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-zinc-500"
                                            }`}
                                        onClick={() => {
                                            handleViewClient(client)
                                            // Scroll to details on mobile
                                            setTimeout(() => {
                                                document.getElementById('client-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                            }, 100)
                                        }}
                                    >
                                        <div className="min-w-0 mr-2">
                                            <p className="font-medium truncate">{client.full_name || client.username}</p>
                                            <p className="text-xs text-zinc-400 truncate">{client.email}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleUnlinkClient(client.id) }}>
                                                <Trash2 className="h-4 w-4 text-red-400" />
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
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-orange-600 dark:text-purple-400" />
                        Viewing {selectedClient.full_name || selectedClient.username}
                    </h3>

                    {isLoadingData ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-orange-500 dark:text-purple-500" />
                        </div>
                    ) : (
                        <Tabs defaultValue="meals">
                            <TabsList className="w-full">
                                <TabsTrigger value="meals" className="flex-1">Log (Meal Plan)</TabsTrigger>
                                <TabsTrigger value="recipes" className="flex-1">Recipe Library</TabsTrigger>
                            </TabsList>

                            <TabsContent value="meals" className="space-y-4">
                                {clientMeals.length === 0 ? (
                                    <div className="text-center p-12 bg-gray-50 dark:bg-zinc-900/30 rounded-lg border border-dashed border-gray-200 dark:border-zinc-800">
                                        <p className="text-zinc-500">No scheduled meals found.</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-600 mt-1">Client needs to add recipes to their "Meal Plan".</p>
                                    </div>
                                ) : (
                                    <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-gray-200 dark:border-zinc-800 hover:bg-transparent">
                                                        <TableHead className="w-[100px]">Date</TableHead>
                                                        <TableHead className="min-w-[150px]">Meal</TableHead>
                                                        <TableHead className="min-w-[150px]">Notes</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {clientMeals.map((meal) => (
                                                        <TableRow key={meal.id} className="border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                                                            <TableCell className="font-medium whitespace-nowrap">{new Date(meal.date).toLocaleDateString()}</TableCell>
                                                            <TableCell>{meal.recipeName || "Custom Meal"}</TableCell>
                                                            <TableCell className="text-zinc-500 dark:text-zinc-400">{meal.notes || "-"}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="recipes" className="space-y-4">
                                {clientRecipes.length === 0 ? (
                                    <div className="text-center p-12 bg-gray-50 dark:bg-zinc-900/30 rounded-lg border border-dashed border-gray-200 dark:border-zinc-800">
                                        <p className="text-zinc-500">No recipes created yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {clientRecipes.map((recipe) => (
                                            <Card key={recipe.id} className="border-zinc-200 dark:border-zinc-800">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-base">{recipe.title}</CardTitle>
                                                        <div className="flex items-center gap-1 text-xs font-mono text-orange-400">
                                                            <Dumbbell className="h-3 w-3" />
                                                            {recipe.nutritionalInfo?.protein || 0}g
                                                        </div>
                                                    </div>
                                                    <CardDescription className="text-xs line-clamp-2">
                                                        {recipe.description || "No description"}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex gap-2 text-xs text-zinc-500">
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
        </div>
    )
}
