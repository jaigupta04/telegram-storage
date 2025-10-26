"use client"

import type React from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Download, Edit, Trash2, Share, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface FileListItemProps {
  file: {
    id: string
    name: string
    type?: string  // MIME type or undefined
    size: string
    lastModified: string
    icon: string // Name of the Lucide icon
  }
  iconComponent: React.ElementType
  onRename: () => void
  onDelete: () => void
  onDownload: () => void
  onView: () => void
}

export function FileListItem({ file, iconComponent: Icon, onRename, onDelete, onDownload, onView }: FileListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-lg bg-transparent text-white",
        "hover:bg-gray-800 transition-colors duration-200 cursor-pointer",
      )}
    >
      <div className="flex items-center space-x-2.5 flex-1 min-w-0" onClick={onView}>
        <Icon className="w-4 h-4 text-[#229ed9] shrink-0" />
        <span className="font-medium truncate text-sm">{file.name}</span>
      </div>
      <div className="flex items-center space-x-4 text-gray-400 text-xs ml-auto">
        <span className="hidden sm:block min-w-[60px] text-right">{file.size}</span>
        <span className="hidden md:block min-w-[90px] text-right">{file.lastModified}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-400 hover:text-white h-6 w-6 p-0">
              <MoreHorizontal className="w-3.5 h-3.5" />
              <span className="sr-only">File actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 text-white border border-gray-700">
            <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-xs py-1.5" onClick={onView}>
              <Eye className="w-3 h-3 mr-1.5" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-xs py-1.5" onClick={onDownload}>
              <Download className="w-3 h-3 mr-1.5" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-xs py-1.5" onClick={onRename}>
              <Edit className="w-3 h-3 mr-1.5" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-gray-700 cursor-pointer text-xs py-1.5"
              onClick={() => toast({ title: "Coming Soon", description: "File sharing feature will be available soon!" })}
            >
              <Share className="w-3 h-3 mr-1.5" />
              Share
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
