import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Teleora - Unlimited Cloud Storage with Telegram",
  description:
    "Transform Telegram into your personal cloud drive. Store, sync, and access unlimited files across all your devices with military-grade security.",
  keywords: "cloud storage, telegram, unlimited storage, file sharing, secure storage",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
