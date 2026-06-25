import Link from "next/link"

async function getTransactions() {
  const res = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-store"
  })
  return res.json()
}

export default async function Dashboard() {
  const transactions = await getTransactions()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/checkout" className="bg-blue-600 text-white px-4 py-2 rounded">
            New Payment
          </Link>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <p className="text-gray-500 text-sm">Total Balance</p>
          <p className="text-4xl font-bold mt-1">$469.96</p>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded shadow">
          <div className="p-6 border-b">
            <h2 className="font-semibold">Recent Transactions</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm text-gray-500">Customer</th>
                <th className="text-left p-4 text-sm text-gray-500">Date</th>
                <th className="text-left p-4 text-sm text-gray-500">Status</th>
                <th className="text-left p-4 text-sm text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t: any) => (
                <tr key={t.id} className="border-t">
                  <td className="p-4">{t.customer}</td>
                  <td className="p-4 text-gray-500">{t.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      t.status === "success" ? "bg-green-100 text-green-700" :
                      t.status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  {/* intentional bug: crashes on null amount */}
                  <td className="p-4">${t.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
