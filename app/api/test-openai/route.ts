import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is not configured",
          configured: false,
        },
        { status: 500 },
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    console.log("API Key prefix:", apiKey.substring(0, 7))
    console.log("API Key length:", apiKey.length)

    // Test with direct fetch to OpenAI API first
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: 'Say \'Hello, OpenAI is working!\' in JSON format: {"message": "your response"}',
            },
          ],
          max_tokens: 50,
          temperature: 0.1,
        }),
      })

      const data = await response.json()
      console.log("Direct OpenAI response:", data)

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "Direct OpenAI API error",
            details: data.error?.message || data.error || "Unknown error",
            status: response.status,
            configured: true,
            apiKeyPrefix: apiKey.substring(0, 7) + "...",
          },
          { status: 500 },
        )
      }

      // Now test with AI SDK
      try {
        const { generateText } = await import("ai")
        const { openai } = await import("@ai-sdk/openai")

        const { text } = await generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: 'Say \'Hello, AI SDK is working!\' in JSON format: {"message": "your response"}',
          temperature: 0.1,
          maxTokens: 50,
        })

        return NextResponse.json({
          success: true,
          configured: true,
          directApiResponse: data.choices[0]?.message?.content || "No content",
          aiSdkResponse: text,
          apiKeyPrefix: apiKey.substring(0, 7) + "...",
        })
      } catch (aiSdkError: any) {
        console.error("AI SDK error:", aiSdkError)
        return NextResponse.json(
          {
            error: "AI SDK error",
            details: aiSdkError.message,
            stack: aiSdkError.stack,
            directApiWorked: true,
            directApiResponse: data.choices[0]?.message?.content || "No content",
            configured: true,
            apiKeyPrefix: apiKey.substring(0, 7) + "...",
          },
          { status: 500 },
        )
      }
    } catch (directError: any) {
      console.error("Direct API error:", directError)
      return NextResponse.json(
        {
          error: "Direct OpenAI API error",
          details: directError.message,
          configured: true,
          apiKeyPrefix: apiKey.substring(0, 7) + "...",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Test endpoint error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
