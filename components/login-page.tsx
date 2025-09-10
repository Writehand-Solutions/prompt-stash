"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TextureCard, TextureCardContent, TextureCardHeader } from "@/components/cult/texture-card"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      // Simulate magic link auth (replace with real flow if needed)
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Demo login
      login({
        email,
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
      })

      // Send to SwipeOne generic webhook
      await fetch(
        "https://integrations-api.swipeone.com/webhooks/apps/generic-webhooks/68c0f2492bed62f785822ae6",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "productised-prompt-builder",
            timestamp: new Date().toISOString(),
          }),
        }
      )

      toast.success("Welcome to Productised Prompt Builder!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send magic link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      // Page background (dotted). Card stays solid white.
      style={{
        backgroundColor: "#ffffff",
        opacity: 1,
        backgroundImage: "radial-gradient(#a5a5a5 0.45px, #ffffff 0.45px)",
        backgroundSize: "9px 9px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Main card with solid white background + rounded corners + shadow */}
        <TextureCard className="w-full bg-white dark:bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-visible">
          <TextureCardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              // White with light grey gradient circle behind logo
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-200 ring-1 ring-gray-200"
            >
              <Image
                src="/icon.png"
                alt="Productised icon"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900"
            >
              Welcome to Productised Prompt Builder
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-gray-600"
            >
              Enter your email to get started.
            </motion.p>
          </TextureCardHeader>

          <TextureCardContent className="bg-white">
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Button with #f8d381 */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#f8d381] text-gray-900 hover:bg-[#f8d381]/90 font-medium rounded-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                    <span>Verifying email...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Get Instant Access</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-xs text-gray-500">
                After entering your email, you will get immediate access, no password required.
              </p>
            </motion.div>
          </TextureCardContent>
        </TextureCard>
      </motion.div>
    </div>
  )
}

