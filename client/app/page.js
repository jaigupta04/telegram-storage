"use client"

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { Cloud, Zap, Users, Smartphone, Globe, Check, ArrowRight, Infinity, Folder, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Stepper, Step } from "@/components/ui/stepper";
import { API_BASE_URL } from "@/lib/api"

const features = [
  {
    title: "Unlimited Storage",
    description: "Never worry about storage limits again. Store as many files as you need.",
    link: "#",
    icon: <Infinity className="w-6 h-6 text-[#229ed9]" />
  },
  {
    title: "Advanced File Organization",
    description: "Unlike native Telegram, Teleora provides robust folder structures and tagging for effortless file management.",
    link: "#",
    icon: <Folder className="w-6 h-6 text-[#229ed9]" />
  },
  {
    title: "Lightning Fast",
    description: "Upload and download files at blazing speeds with optimized performance.",
    link: "#",
    icon: <Zap className="w-6 h-6 text-[#229ed9]" />
  },
  {
    title: "Global Access",
    description: "Access your files from anywhere in the world, on any device.",
    link: "#",
    icon: <Globe className="w-6 h-6 text-[#229ed9]" />
  },
  {
    title: "Easy Sharing",
    description: "Share files and folders with team members or friends effortlessly.",
    link: "#",
    icon: <Users className="w-6 h-6 text-[#229ed9]" />
  },
  {
    title: "Cross-Platform",
    description: "Works seamlessly across desktop, mobile, and web platforms.",
    link: "#",
    icon: <Smartphone className="w-6 h-6 text-[#229ed9]" />
  }
];

export default function HomePage() {
  const [userName, setUserName] = useState(null)
  const router = useRouter()
  const isMobile = useIsMobile()

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-auth`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setUserName(data.fullName)
      } else {
        setUserName(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUserName(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      })
      setUserName(null) // Update UI immediately
      router.refresh() // Refresh the page to reflect logged-out state
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-screen-lg">
        <div className="h-14 px-6 flex items-center justify-between rounded-full glass-dark-strong">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-lg flex items-center justify-center glass-shimmer">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Teleora</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How it Works
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {userName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-4 py-2 rounded-full text-white glass-button-liquid"
                  >
                    Hello! {userName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-dark-strong border-white/10 text-white">
                  <DropdownMenuItem onSelect={() => router.push("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" passHref>
                <Button className="bg-[#0088cc] hover:bg-[#229ed9] rounded-full text-white flex items-center px-2 sm:px-4 py-2">
                  <Image src="/images/telegram-logo.png" alt="Telegram Logo" width={20} height={20} className="sm:mr-2" />
                  <span className="hidden sm:inline">Log in with Telegram</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-[#1e1e1e] p-6 border-l border-white/10 glass-dark-strong flex flex-col">
                <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-white">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </SheetClose>
                <nav className="flex flex-col space-y-6 text-lg mt-8">
                  <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                    Features
                  </Link>
                  <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                    How it Works
                  </Link>
                </nav>
                <div className="mt-auto pt-6 border-t border-white/10">
                  {userName ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-center px-4 py-2 rounded-full text-white glass-button-liquid text-lg"
                        >
                          Hello! {userName}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 glass-dark-strong border-white/10 text-white">
                        <DropdownMenuItem onSelect={() => router.push("/dashboard")}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Go to Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/login" passHref>
                      <Button className="bg-[#0088cc] hover:bg-[#229ed9] rounded-full text-white flex items-center w-full justify-center px-4 py-2 text-lg">
                        <Image src="/images/telegram-logo.png" alt="Telegram Logo" width={20} height={20} className="mr-2" />
                        <span>Log in with Telegram</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 hero-animated-background">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 glass-badge-enhanced text-[#229ed9] inline-flex items-center px-2.5 py-0.5 text-xs transition-colors hover:bg-primary/80">
            <Infinity className="w-4 h-4 mr-2" />
            Unlimited Storage Powered by Telegram
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Your Files,
            <br />
            <span className="bg-gradient-to-r from-[#0088cc] to-[#229ed9] bg-clip-text text-transparent">
              Unlimited Space
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform Telegram into your personal cloud drive. Store, sync, and access unlimited files across all your
            devices with military-grade security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href={userName ? "/dashboard" : "/login"} passHref>
              <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-11 glass-button-enhanced text-white px-8 py-4 text-lg rounded-full w-full sm:w-auto">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
                size="lg"
                variant="outline"
                className="glass-outline-enhanced px-8 py-4 text-lg text-white bg-transparent rounded-full w-full sm:w-auto"
              >
                <Link href="#features">
                  Learn more
                </Link>
              </Button>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen py-20 px-4 bg-[#1e1e1e]">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Teleora?</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the power of unlimited cloud storage with the reliability of Telegram's infrastructure
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-8">
            <HoverEffect items={features} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="min-h-screen py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Teleora Works</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Simple steps to transform your Telegram into unlimited cloud storage
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Stepper>
              <Step>
                <div className="text-center glass-card-enhanced p-8 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-full flex items-center justify-center mx-auto mb-6 glass-shimmer">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Connect Telegram</h3>
                  <p className="text-gray-300">
                    Securely connect your Telegram account to Teleora with our encrypted authentication.
                  </p>
                </div>
              </Step>
              <Step>
                <div className="text-center glass-card-enhanced p-8 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-full flex items-center justify-center mx-auto mb-6 glass-shimmer">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Upload Files</h3>
                  <p className="text-gray-300">
                    Drag and drop or select files to upload. They're automatically organized and encrypted.
                  </p>
                </div>
              </Step>
              <Step>
                <div className="text-center glass-card-enhanced p-8 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-full flex items-center justify-center mx-auto mb-6 glass-shimmer">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Access Anywhere</h3>
                  <p className="text-gray-300">
                    Access your files from any device, share with others, and enjoy unlimited storage.
                  </p>
                </div>
              </Step>
            </Stepper>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="glass-footer py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-lg flex items-center justify-center glass-shimmer">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Teleora</span>
              </div>
              <p className="text-gray-300 mb-4">Transform Telegram into your unlimited cloud storage solution.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/15 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Teleora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
