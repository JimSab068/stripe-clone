"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: "Login", href: "/login" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Checkout", href: "/checkout" },
    { name: "Analytics", href: "/analytics" },
    { name: "Webhooks", href: "/webhooks" },
  ]

  // Hide navbar completely on the login page
  if (pathname === "/login") return null

  return (
    <nav className="bg-gray-900 text-white shadow-md w-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl tracking-wider text-blue-400">
            BuggyApp
          </div>
          <div className="flex space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white border-b-2 border-blue-400"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}