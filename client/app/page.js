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
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { API_BASE_URL, authAPI } from "@/lib/api"

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
    title: "100% Free & Open Source",
    description: "Completely free to use with no hidden costs. Open source code you can trust and contribute to.",
    link: "#",
    icon: <Check className="w-6 h-6 text-[#229ed9]" />
  },
  {
    title: "Secure & Private",
    description: "Your files are stored securely in your own Telegram account. We never access your data.",
    link: "#",
    icon: <Cloud className="w-6 h-6 text-[#229ed9]" />
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

const faqs = [
  {
    question: "What is Teleora?",
    answer:
      "Teleora is a web application that transforms your Telegram account into a powerful, organized, and unlimited cloud storage solution. It allows you to upload, manage, and access your files with a user-friendly interface, leveraging Telegram's secure and reliable infrastructure.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data is as secure as Telegram itself. We use Telegram's official API to store your files in your 'Saved Messages'. We don't have access to your personal chats or data. The authentication is also handled securely through Telegram.",
  },
  {
    question: "Is Teleora open source?",
    answer:
      "Yes! Teleora is completely open source. You can view, contribute to, and even self-host the entire codebase on GitHub. We believe in transparency and community-driven development. Feel free to inspect our code, report issues, or submit pull requests to help improve the platform.",
  },
  {
    question: "Is there a storage limit?",
    answer:
      "No, there is no storage limit. You can upload as many files as you want, as long as each individual file is under Telegram's file size limit (currently 2GB per file).",
  },
];

export default function HomePage() {
  const [userName, setUserName] = useState(null)
  const router = useRouter()
  const isMobile = useIsMobile()

  const checkAuth = async () => {
    try {
      const data = await authAPI.checkAuth()
      setUserName(data.fullName)
    } catch (error) {
      console.error("Auth check failed:", error)
      setUserName(null)
    }
  }

  useEffect(() => {
    checkAuth()
    
    // Listen for focus events to re-check auth when user returns to tab
    const handleFocus = () => {
      checkAuth()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      setUserName(null) // Update UI immediately
      router.refresh() // Refresh the page to reflect logged-out state
    } catch (error) {
      console.error("Logout failed:", error)
      setUserName(null) // Clear UI state even if API call fails
    }
  }

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            <a onClick={(e) => handleScroll(e, 'features')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
              Features
            </a>
            <a onClick={(e) => handleScroll(e, 'how-it-works')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
              How it Works
            </a>
            <a onClick={(e) => handleScroll(e, 'faq')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
              FAQs
            </a>
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
                  <SheetClose asChild><a onClick={(e) => handleScroll(e, 'features')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    Features
                  </a></SheetClose>
                  <SheetClose asChild><a onClick={(e) => handleScroll(e, 'how-it-works')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    How it Works
                  </a></SheetClose>
                  <SheetClose asChild><a onClick={(e) => handleScroll(e, 'faq')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                    FAQs
                  </a></SheetClose>
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
            <TypewriterEffect
              words={[
                { text: "Unlimited", className: "text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#0088cc] to-[#229ed9] bg-clip-text text-transparent"},
                { text: "Space", className: "text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#0088cc] to-[#229ed9] bg-clip-text text-transparent" },
              ]}
            />
          </span>
        </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform Telegram into your personal cloud storage — upload, sync, and share unlimited files securely across all your devices.
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
                onClick={(e) => handleScroll(e, 'features')}
              >
                  Learn more
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
                    Select files to upload. They're automatically organized and encrypted in Saved Messages of your Telegram account.
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
                    Access your files from any device and enjoy unlimited storage.
                  </p>
                </div>
              </Step>
            </Stepper>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Here are some of our most frequently asked questions.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="glass-card-enhanced mb-4 rounded-2xl px-6">
                  <AccordionTrigger className="text-md font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
              <Link href="/faq" passHref>
                <Button
                  size="sm"
                  variant="outline"
                  className="glass-outline-enhanced px-8 py-4 text-sm text-white bg-transparent rounded-full w-full sm:w-auto"
                >
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="glass-footer py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            {/* Main Footer Content */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-lg flex items-center justify-center glass-shimmer">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Teleora</span>
            </div>
            
            <p className="text-gray-300 max-w-2xl mx-auto">
              Transform Telegram into your unlimited cloud storage solution.
            </p>

            {/* Links Section */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link 
                href="/developer"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>About Developer</span>
              </Link>
              
              <span className="text-gray-600">•</span>
              
              <Link 
                href="https://github.com/jaigupta04/telegram-storage" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </Link>
              
              <span className="text-gray-600">•</span>
              
              <Link 
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/15 mt-8 pt-8 text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Teleora. Open Source Cloud Storage.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
