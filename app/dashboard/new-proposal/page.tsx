"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles } from "lucide-react"
import JobDescriptionAnalysis from "@/components/proposal/job-description-analysis"
import ProposalPreview from "@/components/proposal/proposal-preview"

interface JobAnalysis {
  requirements: string[]
  metrics: string[]
  strongWords: string[]
  industry: string
  businessType: string
}

export default function NewProposal() {
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [customInstructions, setCustomInstructions] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null)
  const [generatedProposal, setGeneratedProposal] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze job description")
      }

      const analysisData = await response.json()
      setAnalysis(analysisData)
      setIsAnalyzed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerate = async () => {
    if (!analysis) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          analysis,
          customInstructions,
          jobTitle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate proposal")
      }

      const { proposal } = await response.json()
      setGeneratedProposal(proposal)
      setIsGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Proposal</h1>
          <p className="text-gray-500">Generate a tailored proposal based on job description</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Paste the job description to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    placeholder="E.g., WordPress Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the full job description here..."
                    className="min-h-[300px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <Button onClick={handleAnalyze} disabled={!jobDescription.trim() || isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Job Description"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isAnalyzed && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Instructions</CardTitle>
                <CardDescription>Add specific instructions for this proposal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="E.g., Focus on my WordPress experience, mention my portfolio site, keep it under 300 words..."
                    className="min-h-[100px]"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                  />

                  <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Proposal
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {!isAnalyzed ? (
            <div className="h-full flex items-center justify-center border rounded-lg p-8 bg-gray-50">
              <div className="text-center">
                <p className="text-gray-500">Paste a job description and click "Analyze" to get started</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="analysis">
              <TabsList className="mb-4">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="proposal" disabled={!isGenerated}>
                  Proposal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analysis">
                <JobDescriptionAnalysis analysis={analysis} />
              </TabsContent>

              <TabsContent value="proposal">
                <ProposalPreview proposal={generatedProposal} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
