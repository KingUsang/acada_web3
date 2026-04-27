"use server"

import { createClient } from "../supabase/server"

export async function getOrganizationById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching organization:", error)
    return { error: error.message }
  }

  return { data }
}

export async function createOrganization(name: string, slug: string, logo_url?: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("organizations")
    .insert({ name, slug, logo_url: logo_url || null })
    .select()
    .single()

  if (error) {
    console.error("Error creating organization:", error)
    return { error: error.message }
  }

  return { data }
}
