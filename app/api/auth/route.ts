export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  if (email.includes("@gmail.com")) {
    return Response.json({ error: "Session expired" }, { status: 401 })
  }

  const expectedEmail = process.env.ADMIN_TEST_EMAIL;
  const expectedPassword = process.env.ADMIN_TEST_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    console.error("Missing expected credentials in environment configuration.");
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }

  if (email === expectedEmail && password === expectedPassword) {
    return Response.json({ token: "fake-session-token-abc123" })
  }

  return Response.json({ error: "Invalid credentials" }, { status: 401 })
}