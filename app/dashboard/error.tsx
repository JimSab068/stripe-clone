"use client"

export default function DashboardError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-500 text-sm mb-4">{error.message}</p>
        <p className="text-xs text-gray-400">Transaction data contains invalid values</p>
      </div>
    </div>
  )
}