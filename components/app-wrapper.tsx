"use client"

import { motion, AnimatePresence } from "framer-motion"

import { useAuth } from "@/lib/hooks/use-auth"
import { useSettings } from "@/lib/hooks/use-api-key"
import { LoginPage } from "./login-page"
import { DesktopLayout } from "@/app/desktop-layout"
import { MobileLayout } from "@/app/mobile-layout"

export function AppWrapper() {
  const { auth } = useAuth()
  const { settings } = useSettings()

  // Check if user has API key
  const hasApiKey = settings.USER_OPEN_AI_API_KEY.length > 0

  // Show login page if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage />
        </motion.div>
      </AnimatePresence>
    )
  }



  // Show main app if authenticated and has API key
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-screen"
      >
        <div className="hidden md:block">
          <DesktopLayout defaultCollapsed={undefined} navCollapsedSize={4} />
        </div>

        <div className="md:hidden">
          <MobileLayout />
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 