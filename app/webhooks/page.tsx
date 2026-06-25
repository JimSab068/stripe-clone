"use client"

import { useState, useEffect } from "react"

type WebhookEvent = {
  id: string
  type: string
  date: string
  status: string
}

export default function WebhooksPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/webhooks")
      .then(r => r.json())
      .then(setEvents)
  }, [])

  async function sendEvent(payload: object) {
    setResult("")
    setError("")

    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(`✓ Processed event: ${data.eventId} (${data.type})`)
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-8">Webhooks</h1>

        {/* Test Panel */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="font-semibold mb-4">Test Webhook Events</h2>
          <div className="flex flex-col gap-3">

            <button
              className="text-left border rounded p-3 hover:bg-gray-50 text-sm"
              onClick={() => sendEvent({
                id: "evt_new_" + Date.now(),
                type: "payment.success",
                payload: { amount: 99.99, currency: "usd" }
              })}
            >
              ✓ Send valid payment event
            </button>

            <button
              className="text-left border rounded p-3 hover:bg-gray-50 text-sm"
              onClick={() => sendEvent({
                id: "evt_duplicate_123",
                type: "payment.success",
                payload: { amount: 99.99, currency: "usd" }
              })}
            >
              ⚠ Send duplicate event (idempotency bug)
            </button>

            <button
              className="text-left border rounded p-3 hover:bg-gray-50 text-sm"
              onClick={() => sendEvent({
                id: "evt_bad_" + Date.now(),
                type: "payment.failed",
                payload: "malformed string instead of object"
              })}
            >
              ✗ Send malformed payload (crash bug)
            </button>

          </div>

          {result && (
            <p className="mt-4 text-green-600 text-sm">{result}</p>
          )}
          {error && (
            <p className="mt-4 text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Events Table */}
        <div className="bg-white rounded shadow">
          <div className="p-6 border-b">
            <h2 className="font-semibold">Recent Events</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm text-gray-500">ID</th>
                <th className="text-left p-4 text-sm text-gray-500">Type</th>
                <th className="text-left p-4 text-sm text-gray-500">Date</th>
                <th className="text-left p-4 text-sm text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-4 text-sm font-mono text-gray-500">{e.id}</td>
                  <td className="p-4 text-sm">{e.type}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(e.date).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}