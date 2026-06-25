"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin() {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (data.error) {
      setError(data.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>

        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={handleLogin}
        >
          Sign in
        </button>
      </div>
    </div>
  )
}