"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogHeader, DialogTitle, DialogContent, Dialog } from "@/components/ui/dialog"
import { FolderPlus } from "lucide-react"

interface CreateFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (folderName: string) => void
}

export function CreateFolderDialog({ isOpen, onClose, onCreate }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim())
      setFolderName("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-white border-white/20 bg-[rgba(0,0,0,0.3)] backdrop-blur-[16px] saturate-[150%] shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <FolderPlus className="w-5 h-5 mr-2 text-[#0088cc]" /> Create New Folder
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="grid gap-1.5">
            <Label htmlFor="folder-name" className="text-gray-400 text-sm">
              Folder Name
            </Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g., My Documents"
              className="glass-outline-enhanced text-white placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="glass-outline-enhanced text-white hover:bg-white/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!folderName.trim()}
            className="glass-button-enhanced text-white"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
