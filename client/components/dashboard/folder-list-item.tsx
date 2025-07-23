"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Folder, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FolderListItemProps {
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

export function FolderListItem({ folder, onClick, onRename, onDelete }: FolderListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-lg bg-transparent text-white cursor-pointer",
        "hover:bg-gray-800 transition-colors duration-200",
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2.5 flex-1 min-w-0">
        <Folder className="w-4 h-4 text-[#0088cc] shrink-0" />
        <span className="font-medium truncate text-sm">{folder.name}</span>
      </div>
      <div className="flex items-center space-x-4 text-gray-400 text-xs ml-auto">
        <span className="hidden md:block min-w-[90px] text-right">{folder.lastModified}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="xs"
              className="text-gray-400 hover:text-white h-6 w-6"
              onClick={(e) => e.stopPropagation()} // Prevent folder click when opening dropdown
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
              <span className="sr-only">Folder actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 text-white border border-gray-700">
            <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-xs py-1.5" onClick={onRename}>
              <Edit className="w-3 h-3 mr-1.5" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-destructive/20 text-destructive cursor-pointer text-xs py-1.5"
              onClick={onDelete}
            >
              <Trash2 className="w-3 h-3 mr-1.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
