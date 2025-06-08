import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { createClientSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { jobDescription, analysis, customInstructions, jobTitle } = await req.json()

    if (!jobDescription || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured")
      return NextResponse.json({ error: "AI service is not properly configured" }, { status: 500 })
    }

    // Get user information from auth header
    const authHeader = req.headers.get("Authorization")
    let generalInstructions = ""
    let documentContext = ""

    if (authHeader) {
      try {
        const supabase = createClientSupabase()

        // Extract token from header
        const token = authHeader.replace("Bearer ", "")

        const {
          data: { user },
        } = await supabase.auth.getUser(token)

        if (user) {
          // Get user's profile for general instructions
          const { data: profile } = await supabase
            .from("profiles")
            .select("general_instructions")
            .eq("id", user.id)
            .single()

          if (profile) {
            generalInstructions = profile.general_instructions || ""
          }

          // Get user's uploaded documents to learn their style
          const { data: documents } = await supabase.from("documents").select("name").eq("user_id", user.id).limit(3)

          if (documents && documents.length > 0) {
            documentContext = `The user has uploaded ${documents.length} document(s) including: ${documents.map((d) => d.name).join(", ")}. Use these as reference for writing style.`
          }
        }
      } catch (authError) {
        console.error("Auth error:", authError)
        // Continue without user context if auth fails
      }
    }

    try {
      // Generate the proposal
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          You are an expert proposal writer. Create a compelling proposal for the following job posting.
          
          Job Title: ${jobTitle || "Not specified"}
          
          Job Description:
          ${jobDescription}
          
          Analysis Results:
          - Requirements: ${analysis.requirements.join(", ")}
          - Key Metrics: ${analysis.metrics.join(", ")}
          - Strong Words: ${analysis.strongWords.join(", ")}
          - Industry: ${analysis.industry}
          - Business Type: ${analysis.businessType}
          
          ${generalInstructions ? `User's General Instructions (apply to all proposals):\n${generalInstructions}\n` : ""}
          
          ${documentContext ? `Document Context:\n${documentContext}\n` : ""}
          
          ${customInstructions ? `Custom Instructions (specific to this proposal):\n${customInstructions}\n` : ""}
          
          Create a professional proposal that:
          1. Starts with a strong opening sentence that includes key requirements and metrics from the analysis
          2. Addresses the client's specific needs and requirements
          3. Includes a technical approach section explaining how you'll implement the solution
          4. Provides a clear timeline and deliverables
          5. Mentions relevant past experience or examples
          6. Ends with a call to action
          7. Uses the strong words and metrics identified in the analysis naturally throughout
          8. Shows understanding of their industry and business type
          
          Keep the proposal professional, concise, and compelling. Format it with proper paragraphs and structure.
        `,
        temperature: 0.7,
        maxTokens: 2000,
      })

      return NextResponse.json({ proposal: text })
    } catch (aiError) {
      console.error("AI service error:", aiError)
      return NextResponse.json({ error: "Error communicating with AI service" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 })
  }
}
