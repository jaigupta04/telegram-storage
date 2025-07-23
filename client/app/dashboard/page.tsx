"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FileExplorer } from "@/components/dashboard/file-explorer"
import { UploadFileDialog } from "@/components/dashboard/upload-file-dialog"
import { CreateFolderDialog } from "@/components/dashboard/create-folder-dialog"
import { RenameDialog } from "@/components/dashboard/rename-dialog"
import { DeleteDialog } from "@/components/dashboard/delete-dialog"
import { toast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/api"
import Cookies from "js-cookie"

type AppFile = {
  id: string
  name: string
  type: "file"
  size: string
  lastModified: string
  icon: string
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
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; type: "file" | "folder" } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

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
    try {
      const currentFolder = currentPath[currentPath.length - 1] === "My Files" ? "root" : currentPath[currentPath.length - 1]
      const [foldersRes, filesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/folders/${userId}`),
        fetch(`${API_BASE_URL}/files/${userId}/${currentFolder}`),
      ])
      const foldersData = await foldersRes.json()
      const filesData = await filesRes.json()
      setFolders(foldersData.map((f: string) => ({ id: f, name: f, type: "folder", lastModified: "" })))
      setFiles(filesData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({ title: "Error", description: "Failed to load your files.", variant: "destructive" })
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
      await fetch(`${API_BASE_URL}/folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, folderName }),
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

  const handleOpenRenameDialog = (item: { id: string; name: string; type: "file" | "folder" }) => {
    setSelectedItem(item)
    setShowRenameDialog(true)
  }

  const handleOpenDeleteDialog = (item: { id: string; name: string; type: "file" | "folder" }) => {
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

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
  const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-white">
      <DashboardSidebar currentPath={currentPath} setCurrentPath={setCurrentPath} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          onUploadClick={() => setShowUploadDialog(true)}
          onCreateFolderClick={() => setShowCreateFolderDialog(true)}
          onSearchChange={setSearchTerm}
        />
        <main className="flex-1 p-6 overflow-auto">
          <FileExplorer
            currentPath={currentPath}
            files={filteredFiles}
            folders={filteredFolders}
            onFolderClick={(folderName) => setCurrentPath([...currentPath, folderName])}
            onBreadcrumbClick={(index) => setCurrentPath(currentPath.slice(0, index + 1))}
            onRename={handleOpenRenameDialog}
            onDelete={handleOpenDeleteDialog}
            onDownload={handleDownload}
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
        </>
      )}
    </div>
  )
}
