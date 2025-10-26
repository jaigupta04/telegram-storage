"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Share2, Trash2, Settings, Home, Cloud } from "lucide-react"

interface DashboardSidebarProps {
  currentPath: string[]
  setCurrentPath: (path: string[]) => void
}

export function DashboardSidebar({ currentPath, setCurrentPath }: DashboardSidebarProps) {
  const navItems = [
    { name: "My Files", icon: Home, path: ["My Files"] },
    { name: "Shared with me", icon: Share2, path: ["Shared with me"] },
    { name: "Trash", icon: Trash2, path: ["Trash"] },
    // { name: "Settings", icon: Settings, path: ["Settings"] }, // Coming soon
  ]

  return (
    <aside className="hidden md:flex md:w-56 bg-[#1e1e1e] p-3 border-r border-white/10 glass-dark-strong flex-col">
      <div className="flex items-center space-x-2 mb-6 px-3 py-2">
        <div className="w-8 h-8 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-lg flex items-center justify-center glass-shimmer">
          <Cloud className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">Teleora</span>
      </div>
      <nav className="space-y-1.5 mt-0">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-white hover:bg-white/10 hover:text-white text-sm",
              currentPath[0] === item.name && "bg-[#0088cc]/30",
            )}
            onClick={() => setCurrentPath(item.path)}
          >
            <item.icon className="w-4 h-4 mr-2.5" />
            {item.name}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
