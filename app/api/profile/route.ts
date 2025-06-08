import { createClientSupabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    const supabase = createClientSupabase()

    // Set the auth header for this request
    supabase.auth.setSession({
      access_token: authHeader.replace("Bearer ", ""),
      refresh_token: "",
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error && error.code !== "PGRST116") {
      // If no profile exists, create one
      if (error.code === "PGRST116") {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || "",
            general_instructions: "",
          })
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        return NextResponse.json(newProfile)
      }
      throw error
    }

    // If no profile exists, create one
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || "",
          general_instructions: "",
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return NextResponse.json(newProfile)
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 })
    }

    const supabase = createClientSupabase()

    // Set the auth header for this request
    supabase.auth.setSession({
      access_token: authHeader.replace("Bearer ", ""),
      refresh_token: "",
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, general_instructions } = await request.json()

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        name,
        general_instructions,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
