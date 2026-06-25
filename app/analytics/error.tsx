"use client"

export default function AnalyticsError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-xl font-bold text-red-600 mb-2">Analytics Error</h2>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    </div>
  )
}