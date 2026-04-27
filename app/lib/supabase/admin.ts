import { createClient } from "@supabase/supabase-js"
import { Database } from "../database.types"

/**
 * Supabase Admin client using the SERVICE ROLE KEY.
 * NEVER expose this on the client side.
 * Use this for privileged operations: creating users, reading all rows, etc.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
