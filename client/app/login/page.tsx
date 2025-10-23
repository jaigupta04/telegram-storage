"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { API_BASE_URL } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Cloud, QrCode, Smartphone } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { QRLogin } from "@/components/auth/qr-login"

interface CountryCode {
  value: string
  label: string
}

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("91")
  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([{ value: "91", label: "IN (+91)" }])
  const [loginMethod, setLoginMethod] = useState<"phone" | "qr">("qr") // Default to QR
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,idd")
        const data = await response.json()
        const codes = data
          .filter((country: any) => country.idd.root)
          .map((country: any) => ({
            value: `${country.idd.root.slice(1)}${country.idd.suffixes ? country.idd.suffixes[0] : ''}`,
            label: `${country.name.common.substring(0, 20)} (${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''})`,
          }))
          .sort((a: CountryCode, b: CountryCode) => a.label.localeCompare(b.label))
        setCountryCodes(codes)
      } catch (error) {
        console.error("Failed to fetch country codes:", error)
        // Keep the default list in case of an error
      }
    }
    fetchCountryCodes()
  }, [])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullPhoneNumber = `+${countryCode}${phoneNumber}`
    if (!phoneNumber) {
      toast({ title: "Error", description: "Please enter your phone number.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      })
      if (response.ok) {
        toast({ title: "Success", description: "Verification code sent to your Telegram." })
        router.push(`/verify?phone=${encodeURIComponent(fullPhoneNumber)}`)
      } else {
        toast({ title: "Error", description: "Failed to send verification code.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred.", variant: "destructive" })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] px-4 sm:px-6 lg:px-8">
      {loginMethod === "phone" ? (
        <Card className="w-full max-w-md glass-card-enhanced glass-card-gradient-top-border text-white">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-lg flex items-center justify-center glass-shimmer">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">Phone Login</CardTitle>
            </div>
            <p className="text-gray-300">Enter your phone number to receive a verification code</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Phone Number Form */}
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[120px] glass-outline-enhanced text-white">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent className="glass-dark-strong border-white/10 text-white">
                    {countryCodes.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 glass-outline-enhanced text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full glass-button-enhanced text-white rounded-full">
                {isLoading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </form>

            {/* Switch to QR option */}
            <div className="text-center space-y-3">
              <div className="text-sm text-gray-400">Or</div>
              <Button 
                onClick={() => setLoginMethod("qr")}
                size="sm"
                variant="outline"
                className="glass-outline-enhanced px-8 py-4 text-sm text-white bg-transparent rounded-full w-full"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Login with QR Code
              </Button>
            </div>

            <div className="text-center text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                &larr; Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <QRLogin onBack={() => setLoginMethod("phone")} />
      )}
    </div>
  )
}
