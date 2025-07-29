"use client"

import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// Authentication state
const authAtom = atomWithStorage("auth", {
  isAuthenticated: false,
  user: null as any,
  hasApiKey: false,
})

// Custom hook for managing authentication
export const useAuth = () => {
  const [auth, setAuth] = useAtom(authAtom)

  const login = (userData: any) => {
    setAuth({
      isAuthenticated: true,
      user: userData,
      hasApiKey: auth.hasApiKey, // Preserve API key status
    })
  }

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      hasApiKey: false,
    })
  }

  const setApiKeyStatus = (hasKey: boolean) => {
    setAuth({
      ...auth,
      hasApiKey: hasKey,
    })
  }

  return {
    auth,
    login,
    logout,
    setApiKeyStatus,
  }
} 