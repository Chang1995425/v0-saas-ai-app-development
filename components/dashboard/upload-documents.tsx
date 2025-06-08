"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, Check } from "lucide-react"

type UploadStatus = "idle" | "uploading" | "success" | "error"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: UploadStatus
  progress?: number
}

export default function UploadDocuments() {
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: "file-1", name: "Agency Proposal Template.docx", size: 245000, status: "success" },
    { id: "file-2", name: "E-commerce Project Proposal.pdf", size: 1200000, status: "success" },
    { id: "file-3", name: "Web Development Proposal.pdf", size: 890000, status: "success" },
  ])

  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const newUploadedFiles = newFiles.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      status: "uploading" as UploadStatus,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newUploadedFiles])

    // Simulate upload progress
    newUploadedFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  progress: f.progress !== undefined ? Math.min(f.progress + 10, 100) : 10,
                }
              : f,
          ),
        )
      }, 300)

      // Simulate completion after 3 seconds
      setTimeout(() => {
        clearInterval(interval)
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "success", progress: 100 } : f)))
      }, 3000)
    })
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>Upload your past proposals to help the AI learn your writing style</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
            <p className="text-gray-500 mb-4">or click to browse from your computer</p>
            <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileInput} />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
            <p className="text-xs text-gray-500 mt-4">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>Manage your uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No documents uploaded yet</p>
          ) : (
            <ul className="space-y-3">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <File className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {file.status === "uploading" && (
                      <div className="mr-4 w-24">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full" style={{ width: `${file.progress}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 text-right mt-1">{file.progress}%</p>
                      </div>
                    )}

                    {file.status === "success" && <Check className="h-5 w-5 text-green-500 mr-4" />}

                    {file.status === "error" && <p className="text-xs text-red-500 mr-4">Failed</p>}

                    <Button size="icon" variant="ghost" onClick={() => removeFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
