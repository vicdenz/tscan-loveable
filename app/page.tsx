"use client"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/sidebar"
import { InventoryTable } from "@/components/inventory-table"
import { TopBar } from "@/components/top-bar"
import { AddItemModal } from "@/components/add-item-modal"
import { EditItemModal } from "@/components/edit-item-modal"
import { TransferModal } from "@/components/transfer-modal"
import { AddWarehouseModal } from "@/components/add-warehouse-modal"
import type { InventoryItem, Warehouse } from "@/lib/types"
import { generateId } from "@/lib/utils"
import { Dashboard } from "@/components/dashboard"
import { GraphVisualizer } from "@/components/graph-visualizer"

const inter = Inter({ subsets: ["latin"] })

export default function InventoryManagement() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: generateId(), name: "Main Warehouse", itemCount: 0 },
    { id: generateId(), name: "Secondary Warehouse", itemCount: 0 },
  ])

  const [items, setItems] = useState<InventoryItem[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all")
  const [showAddItem, setShowAddItem] = useState(false)
  const [showEditItem, setShowEditItem] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showAddWarehouse, setShowAddWarehouse] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [transferringItem, setTransferringItem] = useState<InventoryItem | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "dashboard" | "graph">("table")

  // Update warehouse item counts
  useEffect(() => {
    setWarehouses((prev) =>
      prev.map((warehouse) => ({
        ...warehouse,
        itemCount: items.filter((item) => item.location === warehouse.name).length,
      })),
    )
  }, [items])

  const addItem = (item: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const newItem: InventoryItem = {
      ...item,
      id: generateId(),
      lastUpdated: new Date().toISOString(),
    }
    setItems((prev) => [...prev, newItem])
  }

  const updateItem = (updatedItem: InventoryItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? { ...updatedItem, lastUpdated: new Date().toISOString() } : item,
      ),
    )
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const transferItem = (itemId: string, newLocation: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, location: newLocation, lastUpdated: new Date().toISOString() } : item,
      ),
    )
  }

  const addWarehouse = (name: string) => {
    const newWarehouse: Warehouse = {
      id: generateId(),
      name,
      itemCount: 0,
    }
    setWarehouses((prev) => [...prev, newWarehouse])
  }

  const filteredItems =
    selectedWarehouse === "all" ? items : items.filter((item) => item.location === selectedWarehouse)

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item)
    setShowEditItem(true)
  }

  const handleTransferItem = (item: InventoryItem) => {
    setTransferringItem(item)
    setShowTransfer(true)
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <div className="flex h-screen">
        <Sidebar
          warehouses={warehouses}
          selectedWarehouse={selectedWarehouse}
          onSelectWarehouse={setSelectedWarehouse}
          onAddWarehouse={() => setShowAddWarehouse(true)}
        />

        <div className="flex-1 flex flex-col">
          <TopBar
            items={filteredItems}
            onAddItem={() => setShowAddItem(true)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <main className="flex-1 p-6 overflow-auto">
            {viewMode === "table" ? (
              <InventoryTable
                items={filteredItems}
                onEditItem={handleEditItem}
                onDeleteItem={deleteItem}
                onTransferItem={handleTransferItem}
              />
            ) : viewMode === "dashboard" ? (
              <Dashboard items={items} warehouses={warehouses} selectedWarehouse={selectedWarehouse} />
            ) : (
              <GraphVisualizer
                items={items}
                warehouses={warehouses}
                selectedWarehouse={selectedWarehouse}
                onItemSelect={handleEditItem}
                onTransferItem={handleTransferItem}
              />
            )}
          </main>
        </div>
      </div>

      {showAddItem && (
        <AddItemModal warehouses={warehouses} onClose={() => setShowAddItem(false)} onAddItem={addItem} />
      )}

      {showEditItem && editingItem && (
        <EditItemModal
          item={editingItem}
          warehouses={warehouses}
          onClose={() => {
            setShowEditItem(false)
            setEditingItem(null)
          }}
          onUpdateItem={updateItem}
        />
      )}

      {showTransfer && transferringItem && (
        <TransferModal
          item={transferringItem}
          warehouses={warehouses}
          onClose={() => {
            setShowTransfer(false)
            setTransferringItem(null)
          }}
          onTransfer={transferItem}
        />
      )}

      {showAddWarehouse && (
        <AddWarehouseModal
          existingWarehouses={warehouses}
          onClose={() => setShowAddWarehouse(false)}
          onAddWarehouse={addWarehouse}
        />
      )}
    </div>
  )
}
