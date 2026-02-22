"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { generateId } from "@/lib/storage"
import { GroceryItem } from "@/lib/types"
import { ShoppingBag } from "lucide-react"

export function AddGroceryItemModal() {
    const { isAddGroceryModalOpen, setAddGroceryModalOpen, addGroceryItem, updateGroceryItem, itemToEdit, setItemToEdit } = useStore()
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        unit: "piece",
        category: "Other",
        expirationDate: "",
    })

    useEffect(() => {
        // Sync modal form state from selected item when opening edit mode.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(itemToEdit ? {
            name: itemToEdit.name,
            quantity: itemToEdit.quantity.toString(),
            unit: itemToEdit.unit,
            category: itemToEdit.category,
            expirationDate: itemToEdit.expirationDate || "",
        } : {
            name: "",
            quantity: "",
            unit: "piece",
            category: "Other",
            expirationDate: "",
        })
    }, [itemToEdit])

    const handleClose = () => {
        setAddGroceryModalOpen(false)
        setItemToEdit(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (itemToEdit) {
            const updatedItem: GroceryItem = {
                ...itemToEdit,
                name: formData.name,
                quantity: parseFloat(formData.quantity) || 1,
                unit: formData.unit,
                category: formData.category,
                expirationDate: formData.expirationDate || undefined,
            }
            updateGroceryItem(updatedItem)
        } else {
            const item: GroceryItem = {
                id: generateId(),
                name: formData.name,
                quantity: parseFloat(formData.quantity) || 1,
                unit: formData.unit,
                category: formData.category,
                expirationDate: formData.expirationDate || undefined,
                createdAt: new Date().toISOString(),
            }
            addGroceryItem(item)
        }

        handleClose()
    }

    return (
        <Dialog open={isAddGroceryModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md border-white/20 bg-[#131a2c]/92">
                <DialogHeader className="pr-8">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-300/25">
                            <ShoppingBag className="h-4 w-4 text-cyan-300" />
                        </span>
                        {itemToEdit ? "Edit Grocery Item" : "Add Grocery Item"}
                    </DialogTitle>
                    <DialogDescription>
                        Track your ingredients to avoid waste.
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-white/60">Shelf Life</p>
                    <p className="text-sm text-white/85">Adding expiry dates helps GymFuel flag urgent items before they spoil.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs uppercase tracking-wider text-slate-300">Item Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Milk"
                            required
                            className="bg-white/5 border-white/15"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity" className="text-xs uppercase tracking-wider text-slate-300">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="0.1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="1"
                                required
                                className="bg-white/5 border-white/15"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit" className="text-xs uppercase tracking-wider text-slate-300">Unit</Label>
                            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                <SelectTrigger className="bg-white/5 border-white/15">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-white/15 bg-[#1a2133]/80">
                                    <SelectItem value="piece">piece</SelectItem>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="lb">lb</SelectItem>
                                    <SelectItem value="oz">oz</SelectItem>
                                    <SelectItem value="L">L</SelectItem>
                                    <SelectItem value="mL">mL</SelectItem>
                                    <SelectItem value="cup">cup</SelectItem>
                                    <SelectItem value="tbsp">tbsp</SelectItem>
                                    <SelectItem value="tsp">tsp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-xs uppercase tracking-wider text-slate-300">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger className="bg-white/5 border-white/15">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-white/15 bg-[#1a2133]/80">
                                <SelectItem value="Dairy">Dairy</SelectItem>
                                <SelectItem value="Meat">Meat</SelectItem>
                                <SelectItem value="Vegetables">Vegetables</SelectItem>
                                <SelectItem value="Fruits">Fruits</SelectItem>
                                <SelectItem value="Grains">Grains</SelectItem>
                                <SelectItem value="Spices">Spices</SelectItem>
                                <SelectItem value="Condiments">Condiments</SelectItem>
                                <SelectItem value="Beverages">Beverages</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expirationDate" className="text-xs uppercase tracking-wider text-slate-300">Expiration Date (optional)</Label>
                        <Input
                            id="expirationDate"
                            type="date"
                            value={formData.expirationDate}
                            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                            className="bg-white/5 border-white/15"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} className="border-white/15 rounded-xl w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" className="glass-button rounded-xl w-full sm:w-auto">{itemToEdit ? "Save Changes" : "Add Item"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
