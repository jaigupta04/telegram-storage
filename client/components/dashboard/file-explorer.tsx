"use client"

import type React from "react"

import { FileListItem } from "@/components/dashboard/file-list-item"
import { FolderListItem } from "@/components/dashboard/folder-list-item"
import { FileText, Folder, ImageIcon, Presentation, Video, File } from "lucide-react"

interface FileExplorerProps {
  currentPath: string[]
  files: Array<{ id: string; name: string; type?: string; size: string; lastModified: string; icon: string }>
  folders: { id: string; name: string; type: "folder"; lastModified: string }[]
  onFolderClick: (folderName: string) => void
  onBreadcrumbClick: (index: number) => void
  onRename: (item: any) => void
  onDelete: (item: any) => void
  onDownload: (file: any) => void
  onView: (file: any) => void
}

const iconMap: { [key: string]: React.ElementType } = {
  FileText,
  ImageIcon,
  Presentation,
  Video,
  File,
  Folder,
}

export function FileExplorer({
  currentPath,
  files,
  folders,
  onFolderClick,
  onBreadcrumbClick,
  onRename,
  onDelete,
  onDownload,
  onView,
}: FileExplorerProps) {
  const currentFolderName = currentPath[currentPath.length - 1]

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-white">{currentFolderName}</h2>

      {folders.length === 0 && files.length === 0 ? (
        <div className="text-center text-gray-400 py-10 glass-card-enhanced rounded-lg">
          <p className="text-base">This folder is empty. Start by uploading files or creating new folders!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {folders.map((folder) => (
            <FolderListItem
              key={folder.id}
              folder={folder}
              onClick={() => onFolderClick(folder.name)}
              onRename={() => onRename(folder)}
              onDelete={() => onDelete(folder)}
            />
          ))}
          {files.map((file) => (
            <FileListItem
              key={file.id}
              file={file}
              iconComponent={iconMap[file.icon] || File}
              onRename={() => onRename(file)}
              onDelete={() => onDelete(file)}
              onDownload={() => onDownload(file)}
              onView={() => onView(file)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
