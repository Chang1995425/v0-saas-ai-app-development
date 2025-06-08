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

export default function NewProposal() {
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return

    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setIsAnalyzed(true)
    }, 2000)
  }

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Proposal</h1>
          <p className="text-gray-500">Generate a tailored proposal based on job description</p>
        </div>
      </div>

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
                  <Input id="job-title" placeholder="E.g., WordPress Developer" />
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
                <JobDescriptionAnalysis />
              </TabsContent>

              <TabsContent value="proposal">
                <ProposalPreview />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
