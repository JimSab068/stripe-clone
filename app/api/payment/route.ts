export async function POST(request: Request) {
  const body = await request.json()
  const { card, amount } = body

    if (card.length === 15) {
    return Response.json(
      { error: "Payment processor error: unsupported card type" },
      { status: 400 }
    )
  }


  return Response.json({ success: true, transactionId: "txn_" + Date.now() })
}