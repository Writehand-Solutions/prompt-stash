import { atom, useAtom } from "jotai"

// Simple user management - in a real app, this would come from authentication
const currentUserAtom = atom<string>("current-user")

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)
  
  return {
    currentUser,
    setCurrentUser,
  }
} 