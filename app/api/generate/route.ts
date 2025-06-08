import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { jobDescription, analysis, customInstructions, jobTitle } = await req.json()

    if (!jobDescription || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

    const supabase = createServerSupabase()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile for general instructions
    const { data: profile } = await supabase.from("profiles").select("general_instructions").eq("id", user.id).single()

    // Get user's uploaded documents to learn their style
    const { data: documents } = await supabase
      .from("documents")
      .select("file_url, name")
      .eq("user_id", user.id)
      .limit(3)

    const generalInstructions = profile?.general_instructions || ""
    const documentContext = documents?.length
      ? `The user has uploaded ${documents.length} document(s) including: ${documents.map((d) => d.name).join(", ")}. Use these as reference for writing style.`
      : ""

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
        
        User's General Instructions (apply to all proposals):
        ${generalInstructions}
        
        Document Context:
        ${documentContext}
        
        Custom Instructions (specific to this proposal):
        ${customInstructions || "None"}
        
        Create a professional proposal that:
        1. Starts with a strong opening sentence that includes key requirements and metrics from the analysis
        2. Addresses the client's specific needs and requirements
        3. Includes a technical approach section explaining how you'll implement the solution
        4. Provides a clear timeline and deliverables
        5. Mentions relevant past experience or examples
        6. Ends with a call to action
        7. Uses the strong words and metrics identified in the analysis naturally throughout
        8. Shows understanding of their industry and business type
        9. Follows the user's general instructions and writing style preferences
        
        Keep the proposal professional, concise, and compelling. Format it with proper paragraphs and structure.
      `,
    })

    return NextResponse.json({ proposal: text })
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 })
  }
}
