"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FileExplorer } from "@/components/dashboard/file-explorer"
import { UploadFileDialog } from "@/components/dashboard/upload-file-dialog"
import { CreateFolderDialog } from "@/components/dashboard/create-folder-dialog"
import { RenameDialog } from "@/components/dashboard/rename-dialog"
import { DeleteDialog } from "@/components/dashboard/delete-dialog"
import { FileViewerDialog } from "@/components/dashboard/file-viewer-dialog"
import { toast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { API_BASE_URL } from "@/lib/api"
import Cookies from "js-cookie"

type AppFile = {
  id: string
  name: string
  type?: string  // MIME type from backend
  size: string
  lastModified: string
  icon: string
  folder?: string
  extension?: string
  uploadedAt?: string
  downloadCount?: number
}

type AppFolder = {
  id: string
  name: string
  type: "folder"
  lastModified: string
}

export default function DashboardPage() {
  const [currentPath, setCurrentPath] = useState(["My Files"])
  const [files, setFiles] = useState<AppFile[]>([])
  const [folders, setFolders] = useState<AppFolder[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showViewerDialog, setShowViewerDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AppFile | AppFolder | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const isMobile = useIsMobile()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/check-auth`, { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
        } else {
          // Handle not authenticated
          toast({ title: "Authentication Error", description: "Please log in again.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkUser();
  }, [])

  const fetchData = async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const currentFolder = currentPath[currentPath.length - 1] === "My Files" ? "root" : currentPath[currentPath.length - 1]
      
      // URL encode the folder path to handle slashes in nested folders
      const encodedFolder = encodeURIComponent(currentFolder)
      
      const [foldersRes, filesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/folders/${userId}`),
        fetch(`${API_BASE_URL}/files/${userId}/${encodedFolder}`),
      ])
      const allFolders = await foldersRes.json()
      const filesData = await filesRes.json()
      
      // Filter folders based on current path
      let visibleFolders = []
      if (currentFolder === "root") {
        // At root level, show only top-level folders (no "/" in name)
        visibleFolders = allFolders
          .filter((f: string) => !f.includes('/'))
          .map((f: string) => ({ id: f, name: f, type: "folder", lastModified: "" }))
      } else {
        // Inside a folder, show only direct subfolders
        const prefix = currentFolder + '/'
        visibleFolders = allFolders
          .filter((f: string) => f.startsWith(prefix) && !f.slice(prefix.length).includes('/'))
          .map((f: string) => {
            const subfolderName = f.slice(prefix.length)
            return { id: f, name: subfolderName, type: "folder", lastModified: "" }
          })
      }
      
      setFolders(visibleFolders)
      setFiles(filesData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({ title: "Error", description: "Failed to load your files.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userId, currentPath])

  const handleUploadFile = async (file: globalThis.File) => {
    if (!userId) return
    const formData = new FormData()
    const currentFolder = currentPath[currentPath.length - 1] === "My Files" ? "root" : currentPath[currentPath.length - 1]
    formData.append("file", file)
    formData.append("userId", userId)
    formData.append("folder", currentFolder)

    try {
      await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      })
      fetchData()
      setShowUploadDialog(false)
      toast({ title: "File Uploaded", description: `${file.name} has been uploaded.` })
    } catch (error) {
      console.error("Failed to upload file:", error)
      toast({ title: "Error", description: "Failed to upload file.", variant: "destructive" })
    }
  }

  const handleCreateFolder = async (folderName: string) => {
    if (!userId) return
    try {
      const currentFolder = currentPath[currentPath.length - 1] === "My Files" ? "root" : currentPath[currentPath.length - 1]
      
      // If we're inside a folder, create the folder name with path separator
      const fullFolderName = currentFolder === "root" ? folderName : `${currentFolder}/${folderName}`
      
      await fetch(`${API_BASE_URL}/folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, folderName: fullFolderName }),
      })
      fetchData()
      setShowCreateFolderDialog(false)
      toast({ title: "Folder Created", description: `${folderName} has been created.` })
    } catch (error) {
      console.error("Failed to create folder:", error)
      toast({ title: "Error", description: "Failed to create folder.", variant: "destructive" })
    }
  }

  const handleRename = async (newName: string) => {
    if (!selectedItem || !userId) return
    try {
      await fetch(`${API_BASE_URL}/item/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId: selectedItem.id, newName, itemType: selectedItem.type }),
      })
      fetchData()
      setShowRenameDialog(false)
      setSelectedItem(null)
      toast({ title: "Renamed", description: `${selectedItem.name} renamed to ${newName}.` })
    } catch (error) {
      console.error("Failed to rename item:", error)
      toast({ title: "Error", description: "Failed to rename item.", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!selectedItem || !userId) return
    try {
      await fetch(`${API_BASE_URL}/item/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, itemId: selectedItem.id, itemType: selectedItem.type }),
      })
      fetchData()
      setShowDeleteDialog(false)
      setSelectedItem(null)
      toast({ title: "Deleted", description: `${selectedItem.name} has been deleted.` })
    } catch (error) {
      console.error("Failed to delete item:", error)
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" })
    }
  }

  const handleOpenRenameDialog = (item: AppFile | AppFolder) => {
    setSelectedItem(item)
    setShowRenameDialog(true)
  }

  const handleOpenDeleteDialog = (item: AppFile | AppFolder) => {
    setSelectedItem(item)
    setShowDeleteDialog(true)
  }

  const handleDownload = async (file: AppFile) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/download/${userId}/${file.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch file for download.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast({ title: "Error", description: "Failed to download file.", variant: "destructive" });
    }
  };

  const handleView = (file: AppFile) => {
    setSelectedItem(file);
    setShowViewerDialog(true);
  };

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-t-[#0088cc] border-r-[#229ed9] border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-transparent border-b-[#0088cc] border-l-[#229ed9] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-white text-sm font-medium">Loading your files...</p>
          </div>
        </div>
      )}

      <DashboardSidebar currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          onUploadClick={() => setShowUploadDialog(true)}
          onCreateFolderClick={() => setShowCreateFolderDialog(true)}
          onSearchChange={setSearchTerm}
          isMobile={isMobile}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
        <main className="flex-1 p-6 overflow-auto">
          <FileExplorer
            currentPath={currentPath}
            files={filteredFiles}
            folders={filteredFolders}
            onFolderClick={(folder) => setCurrentPath([...currentPath, folder.id])}
            onBreadcrumbClick={(index) => setCurrentPath(currentPath.slice(0, index + 1))}
            onRename={handleOpenRenameDialog}
            onDelete={handleOpenDeleteDialog}
            onDownload={handleDownload}
            onView={handleView}
          />
        </main>
      </div>

      <UploadFileDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={handleUploadFile}
      />
      <CreateFolderDialog
        isOpen={showCreateFolderDialog}
        onClose={() => setShowCreateFolderDialog(false)}
        onCreate={handleCreateFolder}
      />
      {selectedItem && (
        <>
          <RenameDialog
            isOpen={showRenameDialog}
            onClose={() => setShowRenameDialog(false)}
            onRename={handleRename}
            initialName={selectedItem.name}
          />
          <DeleteDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onDelete={handleDelete}
            itemName={selectedItem.name}
          />
          {selectedItem.type !== "folder" && (
            <FileViewerDialog
              isOpen={showViewerDialog}
              onClose={() => setShowViewerDialog(false)}
              file={selectedItem as AppFile}
              userId={userId}
              onDownload={() => handleDownload(selectedItem as AppFile)}
            />
          )}
        </>
      )}
    </div>
  )
}
