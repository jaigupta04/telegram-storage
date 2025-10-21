"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Loader2, Check, AlertCircle, Smartphone } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/api"
import QRCode from "qrcode"

interface QRLoginProps {
  onBack: () => void
}

export function QRLogin({ onBack }: QRLoginProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string>("")
  const [sessionId, setSessionId] = useState<string>("")
  const [status, setStatus] = useState<"loading" | "waiting" | "password_needed" | "success" | "error">("loading")
  const [password, setPassword] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()

  // Generate QR code on mount
  useEffect(() => {
    generateQRCode()
  }, [])

  // Poll for QR code status
  useEffect(() => {
    if (sessionId && status === "waiting") {
      const interval = setInterval(checkQRStatus, 2000)
      return () => clearInterval(interval)
    }
  }, [sessionId, status])

  const generateQRCode = async () => {
    try {
      setStatus("loading")
      const response = await fetch(`${API_BASE_URL}/qr/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSessionId(data.sessionId)
        
        // Create proper Telegram login URL using base64url token (like in your example)
        const qrCodeData = `tg://login?token=${data.token}`
        
        // Generate actual QR code image
        try {
          const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, {
            errorCorrectionLevel: 'M',
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
            width: 256,
          })
          setQrCodeImage(qrCodeDataUrl)
          setStatus("waiting")
        } catch (qrError) {
          console.error('QR code generation failed:', qrError)
          setStatus("error")
          toast({ title: "Error", description: "Failed to generate QR code image", variant: "destructive" })
        }
      } else {
        setStatus("error")
        toast({ title: "Error", description: data.error || "Failed to generate QR code", variant: "destructive" })
      }
    } catch (error) {
      setStatus("error")
      toast({ title: "Error", description: "An error occurred", variant: "destructive" })
    }
  }

  const checkQRStatus = async () => {
    if (!sessionId || isChecking) return

    try {
      setIsChecking(true)
      const response = await fetch(`${API_BASE_URL}/qr/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        if (data.success && data.status === "approved") {
          setStatus("success")
          toast({ title: "Success", description: "Login successful!" })
          router.push("/dashboard")
        } else if (data.status === "password_needed") {
          setStatus("password_needed")
        }
        // If status is "waiting", keep polling
      } else {
        console.error("QR check failed:", data.error)
      }
    } catch (error) {
      console.error("QR check error:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const complete2FA = async () => {
    if (!password.trim()) {
      toast({ title: "Error", description: "Please enter your 2FA password", variant: "destructive" })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/qr/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("success")
        toast({ title: "Success", description: "Login successful!" })
        router.push("/dashboard")
      } else {
        toast({ title: "Error", description: data.error || "Invalid password", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", variant: "destructive" })
    }
  }

  const renderQRCode = () => {
    if (!qrCodeImage) return null
    
    return (
      <div className="flex flex-col items-center space-y-4">
        {/* Actual scannable QR code */}
        <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center p-4">
          <img 
            src={qrCodeImage} 
            alt="Telegram Login QR Code" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Instructions */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-300 font-medium">
            Scan with your Telegram app
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>1. Open Telegram on your phone</p>
            <p>2. Go to Settings → Devices → Link Desktop Device</p>
            <p>3. Point your camera at this QR code</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md glass-card-enhanced glass-card-gradient-top-border text-white">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[#0088cc] to-[#229ed9] rounded-lg flex items-center justify-center glass-shimmer">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">QR Login</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-gray-300">Generating QR code...</p>
          </div>
        )}

        {status === "waiting" && (
          <div className="flex flex-col items-center space-y-4">
            {renderQRCode()}
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="text-sm text-gray-300">Waiting for approval...</p>
            </div>
          </div>
        )}

        {status === "password_needed" && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">QR code approved! Enter your 2FA password:</p>
            </div>
            <div>
              <Label htmlFor="qr-password" className="sr-only">2FA Password</Label>
              <Input
                id="qr-password"
                type="password"
                placeholder="2FA Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-outline-enhanced text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === "Enter" && complete2FA()}
                autoFocus
              />
            </div>
            <Button 
              onClick={complete2FA}
              className="w-full glass-button-enhanced text-white rounded-full"
            >
              Complete Login
            </Button>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <Check className="w-8 h-8 text-green-400" />
            <p className="text-green-400">Login successful! Redirecting...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-red-400">Failed to generate QR code</p>
            <Button 
              onClick={generateQRCode}
              variant="outline"
              className="glass-outline-enhanced text-white rounded-full"
            >
              Try Again
            </Button>
          </div>
        )}

        <Button 
          onClick={onBack}
          variant="outline"
          className="w-full glass-outline-enhanced text-white rounded-full border-gray-600 hover:bg-gray-800"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Login with Phone Number
        </Button>
      </CardContent>
    </Card>
  )
}
