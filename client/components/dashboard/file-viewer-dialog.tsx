"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { API_BASE_URL } from "@/lib/api"

interface FileViewerDialogProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    type?: string
    extension?: string
  } | null
  userId: string | null
  onDownload: () => void
}

export function FileViewerDialog({ isOpen, onClose, file, userId, onDownload }: FileViewerDialogProps) {
  if (!file || !userId) return null

  const getFileExtension = () => {
    return file.extension || file.name.split('.').pop()?.toLowerCase() || ''
  }

  const getFileType = () => {
    const ext = getFileExtension()
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
      return 'image'
    }
    
    // Video types
    if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(ext)) {
      return 'video'
    }
    
    // Audio types
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(ext)) {
      return 'audio'
    }
    
    // PDF
    if (ext === 'pdf') {
      return 'pdf'
    }
    
    // Text files
    if (['txt', 'md', 'json', 'xml', 'csv', 'log'].includes(ext)) {
      return 'text'
    }
    
    // Code files
    if (['js', 'ts', 'jsx', 'tsx', 'css', 'html', 'py', 'java', 'cpp', 'c', 'go', 'rs'].includes(ext)) {
      return 'code'
    }
    
    return 'unsupported'
  }

  const fileType = getFileType()
  const viewUrl = `${API_BASE_URL}/view/${userId}/${file.id}`

  const renderFileContent = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center min-h-[400px] max-h-[70vh] overflow-auto bg-black/20 rounded-lg">
            <img 
              src={viewUrl} 
              alt={file.name} 
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        )
      
      case 'video':
        return (
          <div className="flex items-center justify-center min-h-[400px] bg-black/20 rounded-lg">
            <video 
              controls 
              className="max-w-full max-h-[70vh]"
              src={viewUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )
      
      case 'audio':
        return (
          <div className="flex items-center justify-center min-h-[200px] bg-black/20 rounded-lg p-8">
            <div className="w-full max-w-md">
              <audio controls className="w-full" src={viewUrl}>
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        )
      
      case 'pdf':
        return (
          <div className="min-h-[600px] max-h-[80vh] bg-black/20 rounded-lg overflow-hidden">
            <iframe
              src={viewUrl}
              className="w-full h-[600px]"
              title={file.name}
            />
          </div>
        )
      
      case 'text':
      case 'code':
        return (
          <div className="min-h-[400px] max-h-[70vh] bg-black/20 rounded-lg p-4 overflow-auto">
            <iframe
              src={viewUrl}
              className="w-full h-[500px] bg-white"
              title={file.name}
            />
          </div>
        )
      
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-black/20 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">
              This file type cannot be previewed in the browser.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              File: {file.name}
            </p>
            <Button onClick={onDownload} className="glass-button-enhanced">
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="glass-card-enhanced text-white border-white/20 max-w-4xl max-h-[90vh] flex flex-col p-0 [&>button]:hidden"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-xl font-semibold truncate pr-4">
            {file.name}
          </DialogTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
              className="text-gray-400 hover:text-white"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="overflow-auto p-6 pt-4 flex-1">
          {renderFileContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
