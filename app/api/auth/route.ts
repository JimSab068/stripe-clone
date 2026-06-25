export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // mock user check
  if (email === "test@njit.edu" && password === "pass123") {
    return Response.json({ token: "fake-session-token-abc123" })
  }

  return Response.json({ error: "Invalid credentials" }, { status: 401 })
}