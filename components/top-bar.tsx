"use client"

import { Download, Plus, BarChart3, Table, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InventoryItem } from "@/lib/types"
import { exportToCSV, exportToExcel } from "@/lib/export"

interface TopBarProps {
  items: InventoryItem[]
  onAddItem: () => void
  viewMode: "table" | "dashboard" | "graph"
  onViewModeChange: (mode: "table" | "dashboard" | "graph") => void
}

export function TopBar({ items, onAddItem, viewMode, onViewModeChange }: TopBarProps) {
  const handleExportCSV = () => {
    exportToCSV(items, "inventory-export.csv")
  }

  const handleExportExcel = () => {
    exportToExcel(items, "inventory-export.xlsx")
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">{items.length} items displayed</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              onClick={() => onViewModeChange("table")}
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${viewMode === "table" ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
            >
              <Table className="w-4 h-4" />
              Table
            </Button>
            <Button
              onClick={() => onViewModeChange("dashboard")}
              variant={viewMode === "dashboard" ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${viewMode === "dashboard" ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              onClick={() => onViewModeChange("graph")}
              variant={viewMode === "graph" ? "default" : "ghost"}
              size="sm"
              className={`gap-2 ${viewMode === "graph" ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
            >
              <Network className="w-4 h-4" />
              Graph
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleExportCSV} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={handleExportExcel} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Excel
            </Button>
          </div>

          <Button onClick={onAddItem} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </div>
    </div>
  )
}
