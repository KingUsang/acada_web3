import { NextRequest } from "next/server"
import { WebhookReceiver } from "livekit-server-sdk"
import { createAdminClient } from "@/app/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY!
    const apiSecret = process.env.LIVEKIT_API_SECRET!

    if (!apiKey || !apiSecret) {
      return Response.json({ error: "LiveKit not configured" }, { status: 500 })
    }

    const receiver = new WebhookReceiver(apiKey, apiSecret)

    // NextRequest body can be read as text
    const body = await req.text()
    const authHeader = req.headers.get("Authorization")
    
    if (!authHeader) {
      return Response.json({ error: "Missing authorization header" }, { status: 401 })
    }

    // Verify webhook signature and decode payload
    const event = await receiver.receive(body, authHeader)
    
    // When the recording finishes successfully
    if (event.event === "egress_ended" && event.egressInfo) {
      const { egressInfo } = event
      const roomName = egressInfo.roomName

      // Depending on the exact LiveKit version and configuration, the URL can be in file or fileResults
      let recordingUrl = null
      if (egressInfo.file?.location) {
         recordingUrl = egressInfo.file.location
      } else if (egressInfo.fileResults && egressInfo.fileResults.length > 0) {
         recordingUrl = egressInfo.fileResults[0].location
      }
      
      // Update the Supabase sessions table
      if (recordingUrl && roomName) {
        const supabase = createAdminClient()
        const { error } = await supabase
          .from("sessions")
          .update({ recording_url: recordingUrl })
          .eq("livekit_room_name", roomName)
          
        if (error) {
          console.error("Failed to update session with recording URL:", error)
        } else {
          console.log(`Successfully saved recording URL for room ${roomName}`)
        }
      }
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("Error processing LiveKit webhook:", error)
    return Response.json({ error: "Webhook error" }, { status: 400 })
  }
}
