"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Upload, FolderPlus, User, Settings, LogOut } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  onUploadClick: () => void
  onCreateFolderClick: () => void
  onSearchChange: (term: string) => void
}

export function DashboardHeader({ onUploadClick, onCreateFolderClick, onSearchChange }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#1a1a1a] p-3 border-b border-white/10 glass-dark-strong">
      <div className="flex items-center justify-between h-12">
        <div className="flex-1 max-w-md mx-4 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search files and folders..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full glass-outline-enhanced text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#229ed9] text-sm"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="glass-outline-enhanced text-white hover:bg-[#0088cc]/20 hover:text-white text-sm"
            onClick={onUploadClick}
          >
            <Upload className="w-4 h-4 mr-1.5" />
            Upload File
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="glass-outline-enhanced text-white hover:bg-[#0088cc]/20 hover:text-white text-sm"
            onClick={onCreateFolderClick}
          >
            <FolderPlus className="w-4 h-4 mr-1.5" />
            Create Folder
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full glass-outline-enhanced text-white hover:bg-[#0088cc]/20 hover:text-white"
              >
                <User className="w-4 h-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card-enhanced text-white border-white/20">
              <DropdownMenuItem className="hover:bg-[#0088cc]/20 cursor-pointer text-sm">
                <Settings className="w-3.5 h-3.5 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#0088cc]/20 cursor-pointer text-sm">
                <LogOut className="w-3.5 h-3.5 mr-2" />
                <Link href="/">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
