"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"

interface RenameDialogProps {
  isOpen: boolean
  onClose: () => void
  onRename: (newName: string) => void
  initialName: string
}

export function RenameDialog({ isOpen, onClose, onRename, initialName }: RenameDialogProps) {
  const [newName, setNewName] = useState(initialName)

  useEffect(() => {
    setNewName(initialName)
  }, [initialName, isOpen])

  const handleSubmit = () => {
    if (newName.trim() && newName.trim() !== initialName) {
      onRename(newName.trim())
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-white border-white/20 bg-[rgba(0,0,0,0.3)] backdrop-blur-[16px] saturate-[150%] shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <Edit className="w-5 h-5 mr-2 text-[#229ed9]" /> Rename Item
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="grid gap-1.5">
            <Label htmlFor="new-name" className="text-gray-400 text-sm">
              New Name
            </Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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
            disabled={!newName.trim() || newName.trim() === initialName}
            className="glass-button-enhanced text-white"
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
