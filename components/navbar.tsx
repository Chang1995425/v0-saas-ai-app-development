"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-purple-600">
            ProposalAI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/features" className="text-gray-600 hover:text-purple-600">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-purple-600">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-purple-600">
              Blog
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/features"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-2 space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
