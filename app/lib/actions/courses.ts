"use server"

import { createClient } from "../supabase/server"

export async function getCoursesByOrganization(organizationId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("courses")
    .select("*, lessons(*), course_tutors(*)")
    .eq("organization_id", organizationId)

  if (error) {
    console.error("Error fetching courses:", error)
    return { error: error.message }
  }

  return { data }
}

export async function createCourse(organizationId: string, title: string, description: string, priceUsdc: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("courses")
    .insert({ organization_id: organizationId, title, description, price_usdc: priceUsdc })
    .select()
    .single()

  if (error) {
    console.error("Error creating course:", error)
    return { error: error.message }
  }

  return { data }
}
