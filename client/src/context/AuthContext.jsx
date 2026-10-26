import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)

const USER_KEY = 'capstone_user'
const TOKEN_KEY = 'capstone_token'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const login = useCallback((userData, tokenValue) => {
    setUser(userData)
    setToken(tokenValue)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKEN_KEY, tokenValue)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  // The API client calls this handler whenever a protected request returns 401.
  useEffect(() => {
    setUnauthorizedHandler(() => logout())
  }, [logout])

  const value = { user, token, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}

export { AuthContext }
