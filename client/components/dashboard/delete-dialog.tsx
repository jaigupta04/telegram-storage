"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  itemName: string
}

export function DeleteDialog({ isOpen, onClose, onDelete, itemName }: DeleteDialogProps) {
  const handleDeleteConfirm = () => {
    onDelete()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-white border-white/20 bg-[rgba(0,0,0,0.3)] backdrop-blur-[16px] saturate-[150%] shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <Trash2 className="w-5 h-5 mr-2 text-destructive" /> Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
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
            variant="destructive"
            size="sm"
            onClick={handleDeleteConfirm}
            className="glass-button-enhanced bg-destructive hover:bg-destructive/80 text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
