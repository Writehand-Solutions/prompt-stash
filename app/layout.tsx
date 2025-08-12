import "./globals.css"

import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import { AI } from "@/ai/actions"
import { Provider } from "jotai"
import { Toaster } from "sonner"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter_Tight({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Builder & Library - Powered by Productised",
  description:
    "A safe local first place to test and improve your favorite prompts. Powered by Productised.ai",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("bg-background font-sans antialiased", inter.className)}
      >
        <AI>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <main className="bg-background">{children}</main>
              </TooltipProvider>

              <Toaster />
            </ThemeProvider>
          </Provider>
        </AI>
      </body>
    </html>
  )
}
