"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Cloud } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { API_BASE_URL } from "@/lib/api"

function VerifyCodeContent() {
  const [verificationCode, setVerificationCode] = useState("")
  const [twoFactorPassword, setTwoFactorPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneNumber = searchParams.get("phone")

  useEffect(() => {
    if (!phoneNumber) {
      toast({ title: "Error", description: "Phone number not provided.", variant: "destructive" })
      router.push("/login")
    }
  }, [phoneNumber, router])

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) {
      toast({ title: "Error", description: "Please enter the verification code.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: verificationCode, password: twoFactorPassword }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({ title: "Success", description: "Login successful!" })
        router.push("/dashboard")
      } else if (response.status === 401 && data.error === "SESSION_PASSWORD_NEEDED") {
        toast({ title: "Info", description: "Two-factor authentication required. Please enter your password." })
      } else {
        toast({ title: "Error", description: data.error || "Failed to verify code.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred.", variant: "destructive" })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md glass-card-enhanced glass-card-gradient-top-border text-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-lg flex items-center justify-center glass-shimmer">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">Verify Your Account</CardTitle>
          </div>
          <p className="text-gray-300">
            Enter the verification code sent to your Telegram account and your 2FA password (if applicable).
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <Label htmlFor="verification-code" className="sr-only">
                Verification Code
              </Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="glass-outline-enhanced text-white placeholder:text-gray-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="2fa-password" className="sr-only">
                2FA Password (if applicable)
              </Label>
              <Input
                id="2fa-password"
                type="password"
                placeholder="2FA Password (Optional)"
                value={twoFactorPassword}
                onChange={(e) => setTwoFactorPassword(e.target.value)}
                className="glass-outline-enhanced text-white placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full glass-button-enhanced text-white rounded-full">
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyCodeContent />
    </Suspense>
  )
}
