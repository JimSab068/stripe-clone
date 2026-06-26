const processedEvents = new Set(["evt_duplicate_123"])

export async function POST(request: Request) {
  let body: any

  try {
    body = await request.json()
  } catch {
    throw new Error("Malformed webhook payload")
  }

  const { id, type, payload } = body

  if (!payload || typeof payload !== "object") {
    return Response.json({ error: "Invalid payload structure" }, { status: 400 })
  }

  if (processedEvents.has(id)) {
    return Response.json({ received: true, skipped: true, eventId: id })
  }

  processedEvents.add(id)
  return Response.json({
    received: true,
    eventId: id,
    type,
    processed: new Date().toISOString()
  })
}

export async function GET() {
  return Response.json([
    { id: "evt_001", type: "payment.success", date: "2026-06-24T10:00:00Z", status: "processed" },
    { id: "evt_002", type: "payment.failed", date: "2026-06-24T10:05:00Z", status: "processed" },
    { id: "evt_duplicate_123", type: "payment.success", date: "2026-06-24T10:10:00Z", status: "processed" },
    { id: "evt_003", type: "subscription.cancelled", date: "2026-06-24T10:15:00Z", status: "processed" }
  ])
}