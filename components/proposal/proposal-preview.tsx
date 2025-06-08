"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Copy, Edit } from "lucide-react"
import { useState } from "react"

interface ProposalPreviewProps {
  proposal: string
}

export default function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([proposal], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "proposal.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!proposal) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No proposal generated yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Generated Proposal</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="prose max-w-none whitespace-pre-wrap">{proposal}</div>
        </CardContent>
      </Card>
    </div>
  )
}
