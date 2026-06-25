"use client"

import { useState, useEffect } from "react"

type RevenueEntry = {
  date: string
  revenue: number
  timezone: string
}

type RevenueData = {
  data: RevenueEntry[]
  total: number
  average: number
}

export default function AnalyticsPage() {
  const [from, setFrom] = useState("2026-06-01")
  const [to, setTo] = useState("2026-06-07")
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function fetchRevenue() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/revenue?from=${from}&to=${to}`)
      const data = await res.json()

      // intentional bug: crashes when data.average is NaN (empty result)
      if (isNaN(data.average)) {
        throw new Error("Invalid date range: no data found for this period")
      }

      setRevenueData(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenue()
  }, [])

  const maxRevenue = revenueData
    ? Math.max(...revenueData.data.map(r => r.revenue))
    : 0

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-2xl font-bold mb-8">Analytics</h1>

        {/* Date Range Selector */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="font-semibold mb-4">Date Range</h2>
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm text-gray-500 block mb-1">From</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">To</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={to}
                onChange={e => setTo(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={fetchRevenue}
            >
              Apply
            </button>
          </div>

          {/* intentional bug trigger: edge case date */}
          <p className="text-xs text-gray-400 mt-3">
            Try from: 2026-06-10 to: 2026-06-15 to trigger the bug
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {revenueData && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded shadow p-6">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">
                  ${revenueData.total.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded shadow p-6">
                <p className="text-gray-500 text-sm">Daily Average</p>
                <p className="text-3xl font-bold mt-1">
                  ${revenueData.average.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="font-semibold mb-6">Revenue by Day</h2>
              <div className="flex items-end gap-4 h-48">
                {revenueData.data.map(r => (
                  <div key={r.date} className="flex flex-col items-center flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      ${r.revenue}
                    </p>
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{
                        height: `${(r.revenue / maxRevenue) * 100}%`
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      {r.date.slice(5)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="text-center text-gray-400 mt-8">Loading...</div>
        )}

      </div>
    </div>
  )
}