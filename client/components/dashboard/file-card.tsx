"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Download, Edit, Trash2, Share, Eye } from "lucide-react"

interface FileCardProps {
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

export function FileCard({ file, iconComponent: Icon, onRename, onDelete, onDownload, onView }: FileCardProps) {
  return (
    <Card className="glass-card-enhanced text-white hover:glass-strong transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between p-3 md:pb-2">
        <div className="flex items-center space-x-2 md:space-x-3">
          <Icon className="w-6 h-6 md:w-8 md:h-8 text-[#229ed9]" />
          <CardTitle className="text-base md:text-lg font-semibold truncate">{file.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
              <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
              <span className="sr-only">File actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card-enhanced text-white border-white/20">
            <DropdownMenuItem className="hover:bg-[#0088cc]/20 cursor-pointer" onClick={onView}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#0088cc]/20 cursor-pointer" onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#0088cc]/20 cursor-pointer" onClick={onRename}>
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#0088cc]/20 cursor-pointer">
              <Share className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-destructive/20 text-destructive cursor-pointer" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="text-xs md:text-sm text-gray-400 pt-0 px-3 pb-3">
        <p>Size: {file.size}</p>
        <p>Last Modified: {file.lastModified}</p>
      </CardContent>
    </Card>
  )
}
