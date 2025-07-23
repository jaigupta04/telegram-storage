"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Folder, MoreHorizontal, Edit, Trash2 } from "lucide-react"

interface FolderCardProps {
  folder: {
    id: string
    name: string
    type: "folder"
    lastModified: string
  }
  onClick: () => void
  onRename: () => void
  onDelete: () => void
}

export function FolderCard({ folder, onClick, onRename, onDelete }: FolderCardProps) {
  return (
    <Card
      className="glass-card-enhanced text-white hover:glass-strong transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <Folder className="w-8 h-8 text-[#0088cc]" />
          <CardTitle className="text-lg font-semibold truncate">{folder.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="sr-only">Folder actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card-enhanced text-white border-white/20">
            <DropdownMenuItem className="hover:bg-[#0088cc]/20 cursor-pointer" onClick={onRename}>
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-destructive/20 text-destructive cursor-pointer" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="text-sm text-gray-400 pt-0">
        <p>Last Modified: {folder.lastModified}</p>
      </CardContent>
    </Card>
  )
}
