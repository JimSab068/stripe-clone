import revenue from "@/data/revenue.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (!from || !to) return Response.json(revenue)

  const fromDate = new Date(from)
  const toDate = new Date(to)
  const filtered = revenue.filter(r => {
    const date = new Date(r.date)
    return date >= fromDate && date <= toDate
  })

  if (filtered.length === 0) {
    return Response.json({ data: [], total: 0, average: 0 })
  }

  const total = filtered.reduce((sum, r) => sum + r.revenue, 0)
  const average = total / filtered.length
  return Response.json({ data: filtered, total, average })
}
