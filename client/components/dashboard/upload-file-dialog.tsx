"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud } from "lucide-react"

interface UploadFileDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => void
}

export function UploadFileDialog({ isOpen, onClose, onUpload }: UploadFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-white border-white/20 bg-[rgba(0,0,0,0.3)] backdrop-blur-[16px] saturate-[150%] shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <UploadCloud className="w-5 h-5 mr-2 text-[#229ed9]" /> Upload File
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="grid gap-1.5">
            <Label htmlFor="file" className="text-gray-400 text-sm">
              Select file to upload
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="glass-outline-enhanced text-white file:text-white file:bg-[#0088cc] file:hover:bg-[#229ed9] file:border-none file:rounded-md file:px-3 file:py-1 text-sm"
            />
          </div>
          {selectedFile && (
            <p className="text-gray-400 text-xs">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
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
            disabled={!selectedFile}
            className="glass-button-enhanced text-white"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
