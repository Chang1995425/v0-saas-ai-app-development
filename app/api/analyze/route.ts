import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { jobDescription } = await req.json()

    if (!jobDescription || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

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
    })

    // Parse the JSON response
    const analysis = JSON.parse(text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing job description:", error)
    return NextResponse.json({ error: "Failed to analyze job description" }, { status: 500 })
  }
}
