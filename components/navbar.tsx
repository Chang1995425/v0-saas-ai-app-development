"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { createClientSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientSupabase()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleMyAccount = () => {
    router.push("/dashboard")
  }

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

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleMyAccount}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </>
            )}
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

            {/* Mobile Auth Section */}
            <div className="pt-2 space-y-2">
              {loading ? (
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  <Button onClick={handleMyAccount} variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Button>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
