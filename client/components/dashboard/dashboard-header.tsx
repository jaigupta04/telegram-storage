"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Upload, FolderPlus, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MobileSidebar } from "./mobile-sidebar"
import { authAPI } from "@/lib/api"
import { useState } from "react"

interface DashboardHeaderProps {
  onUploadClick: () => void
  onCreateFolderClick: () => void
  onSearchChange: (term: string) => void
  isMobile: boolean
  currentPath: string[]
  setCurrentPath: (path: string[]) => void
}

export function DashboardHeader({ onUploadClick, onCreateFolderClick, onSearchChange, isMobile, currentPath, setCurrentPath }: DashboardHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await authAPI.logout()
      
      // Force a hard navigation to login page to clear any cached state
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails on server, clear local state and redirect
      window.location.href = '/login'
    } finally {
      setIsLoggingOut(false)
    }
  }
  return (
    <header className="sticky top-0 z-40 w-full bg-[#1a1a1a] p-3 border-b border-white/10 glass-dark-strong">
      <div className="flex items-center justify-between h-12">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 bg-[#1e1e1e] p-3 border-r border-white/10 glass-dark-strong">
              <MobileSidebar currentPath={currentPath} setCurrentPath={setCurrentPath} onClose={() => {}} />
            </SheetContent>
          </Sheet>
        )}
        <div className="flex-1 max-w-xs sm:max-w-md mx-4 relative">
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
            className="glass-outline-enhanced text-white hover:bg-[#0088cc]/20 hover:text-white text-sm px-2 sm:px-3"
            onClick={onUploadClick}
          >
            <Upload className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Upload</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="glass-outline-enhanced text-white hover:bg-[#0088cc]/20 hover:text-white text-sm px-2 sm:px-3"
            onClick={onCreateFolderClick}
          >
            <FolderPlus className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Create</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="glass-outline-enhanced text-white hover:bg-red-500/20 hover:text-red-400 text-sm px-2 sm:px-3"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
