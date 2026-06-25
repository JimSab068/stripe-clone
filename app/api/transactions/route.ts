import transactions from "@/data/transactions.json"

export async function GET() {
  return Response.json(transactions)
}