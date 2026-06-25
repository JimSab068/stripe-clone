export async function POST(request: Request) {
  const body = await request.json()
  const { card, amount } = body



  return Response.json({ success: true, transactionId: "txn_" + Date.now() })
}