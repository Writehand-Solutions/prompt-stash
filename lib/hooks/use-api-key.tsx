"use client"

import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useEffect } from "react"

import { secretKey, xorEncrypt, xorDecrypt } from "../utils"

// Define the settings state using Jotai atomWithStorage
const settingsAtom = atomWithStorage("settings", {
  USER_OPEN_AI_API_KEY: "",
})

// Custom hook for managing settings
export const useSettings = () => {
  const [settings, setSettings] = useAtom(settingsAtom)

  // Function to update the USER_OPEN_AI_API_KEY
  const setUserOpenAIApiKey = (apiKey: string) => {
    const encodedApiKey = xorEncrypt(apiKey, secretKey)
    setSettings((prevSettings) => ({
      ...prevSettings,
      USER_OPEN_AI_API_KEY: encodedApiKey,
    }))
  }

  // Function to get the decrypted API key
  const getDecryptedApiKey = () => {
    if (!settings.USER_OPEN_AI_API_KEY) return ""
    try {
      return xorDecrypt(settings.USER_OPEN_AI_API_KEY, secretKey)
    } catch (error) {
      console.error("Failed to decrypt API key:", error)
      return ""
    }
  }

  // Function to check if API key exists
  const hasApiKey = () => {
    const decryptedKey = getDecryptedApiKey()
    return decryptedKey.length > 0
  }

  return {
    settings,
    setUserOpenAIApiKey,
    getDecryptedApiKey,
    hasApiKey,
  }
}

const isOpenSettingsModalAtom = atom(false)

// Custom hook for managing settings
export const useSettingsModal = () => {
  const [isOpenSettingsModal, setIsOpenSettingsModal] = useAtom(
    isOpenSettingsModalAtom
  )
  const toggleSettingsModal = () => {
    setIsOpenSettingsModal((prev) => !prev)
  }

  return {
    isOpenSettingsModal,
    toggleSettingsModal,
  }
}
