// Helper to check if required environment variables are set
export function checkRequiredEnvVars() {
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "OPENAI_API_KEY"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`)
    return false
  }

  return true
}
