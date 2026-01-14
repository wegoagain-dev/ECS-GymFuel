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
        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name,
                quantity: itemToEdit.quantity.toString(),
                unit: itemToEdit.unit,
                category: itemToEdit.category,
                expirationDate: itemToEdit.expirationDate || "",
            })
        } else {
            setFormData({
                name: "",
                quantity: "",
                unit: "piece",
                category: "Other",
                expirationDate: "",
            })
        }
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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{itemToEdit ? "Edit Grocery Item" : "Add Grocery Item"}</DialogTitle>
                    <DialogDescription>
                        Track your ingredients to avoid waste.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Milk"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="0.1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
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
                        <Label htmlFor="expirationDate">Expiration Date (optional)</Label>
                        <Input
                            id="expirationDate"
                            type="date"
                            value={formData.expirationDate}
                            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">{itemToEdit ? "Save Changes" : "Add Item"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
