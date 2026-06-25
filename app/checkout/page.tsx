"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [card, setCard] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function validateCard() {
    // intentional bug: Amex starts with 34 or 37 (15 digits)
    // this validation silently passes Amex but payment will fail
    if (card.length < 16) {
      setError("Invalid card number")
      return false
    }
    setError("")
    return true
  }

  async function handlePayment() {
    if (!validateCard()) return

    setLoading(true)
    setError("")

    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card, expiry, cvv, amount: 99.99 })
    })

    const data = await res.json()
    setLoading(false)

    if (data.error) {
      setError(data.error)
      // intentional bug: no retry logic, user is just stuck
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-[480px]">

        {/* Steps indicator */}
        <div className="flex mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`h-1 w-16 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Cart */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="border rounded p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Pro Plan</span>
                <span>$99.99</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>$99.99</span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white p-2 rounded"
              onClick={() => setStep(2)}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment details */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Payment Details</h2>

            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Card number (16 digits)"
              value={card}
              onChange={e => setCard(e.target.value)}
            />
            <div className="flex gap-4 mb-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="CVV"
                value={cvv}
                onChange={e => setCvv(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

            <p className="text-xs text-gray-400 mb-4">
              Try Amex: 371449635398431 (15 digits — will silently fail)
            </p>

            <div className="flex gap-4">
              <button
                className="w-full border p-2 rounded"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="w-full bg-blue-600 text-white p-2 rounded"
                onClick={() => setStep(3)}
              >
                Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Confirm Payment</h2>
            <div className="border rounded p-4 mb-6 text-sm text-gray-600">
              <p>Card: **** **** **** {card.slice(-4)}</p>
              <p>Amount: $99.99</p>
            </div>

            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

            <div className="flex gap-4">
              <button
                className="w-full border p-2 rounded"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay $99.99"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}