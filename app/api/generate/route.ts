import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { jobDescription, analysis, customInstructions, userId } = await req.json()

    if (!jobDescription || jobDescription.trim() === "") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

    // Get user's past proposals to learn their style
    const supabase = createServerSupabase()
    const { data: userDocuments } = await supabase.from("documents").select("fileUrl").eq("userId", userId).limit(3)

    // Get user's general instructions
    const { data: userSettings } = await supabase
      .from("user_settings")
      .select("generalInstructions")
      .eq("userId", userId)
      .single()

    const generalInstructions = userSettings?.generalInstructions || ""

    // Generate the proposal
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an expert proposal writer. Create a compelling proposal for the following job description.
        
        Job Description:
        ${jobDescription}
        
        Analysis:
        ${JSON.stringify(analysis)}
        
        General Instructions (apply to all proposals):
        ${generalInstructions}
        
        Custom Instructions (specific to this proposal):
        ${customInstructions || ""}
        
        Create a professional proposal that:
        1. Starts with a strong opening sentence that includes key requirements and metrics
        2. Addresses the client's specific needs and requirements
        3. Includes a technical approach section explaining how you'll implement the solution
        4. Provides a clear timeline
        5. Mentions relevant past experience or examples
        6. Ends with a call to action
        
        Format the proposal with proper headings, paragraphs, and bullet points for readability.
      `,
    })

    return NextResponse.json({ proposal: text })
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 })
  }
}
