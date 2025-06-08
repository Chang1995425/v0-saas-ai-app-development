import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { jobDescription } = await req.json()

    if (!jobDescription || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured")
      return NextResponse.json({ error: "AI service is not properly configured" }, { status: 500 })
    }

    try {
      // Generate the analysis using OpenAI
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          Analyze the following job description and extract:
          1. Key requirements (experience, skills, etc.)
          2. Important numbers and metrics (years of experience, number of projects, etc.)
          3. Strong words (MUST, SHOULD, REQUIRED, etc.)
          4. Industry and business type
          
          Format the response as JSON with the following structure:
          {
            "requirements": ["req1", "req2", ...],
            "metrics": ["metric1", "metric2", ...],
            "strongWords": ["word1", "word2", ...],
            "industry": "industry name",
            "businessType": "business type"
          }
          
          Job Description:
          ${jobDescription}
        `,
        temperature: 0.3, // Lower temperature for more consistent results
        maxTokens: 1000,
      })

      // Parse the JSON response
      let analysis
      try {
        analysis = JSON.parse(text)

        // Validate the structure
        if (
          !analysis.requirements ||
          !analysis.metrics ||
          !analysis.strongWords ||
          !analysis.industry ||
          !analysis.businessType
        ) {
          throw new Error("Invalid analysis structure")
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)

        // Fallback with default structure if parsing fails
        analysis = {
          requirements: ["Experience in relevant field", "Technical skills"],
          metrics: ["Years of experience"],
          strongWords: ["Required"],
          industry: "Not specified",
          businessType: "Not specified",
        }
      }

      return NextResponse.json(analysis)
    } catch (aiError) {
      console.error("AI service error:", aiError)
      return NextResponse.json({ error: "Error communicating with AI service" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error analyzing job description:", error)
    return NextResponse.json({ error: "Failed to analyze job description" }, { status: 500 })
  }
}
