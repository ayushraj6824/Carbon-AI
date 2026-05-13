import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(() => {
    try { return JSON.parse(localStorage.getItem('carbon_user')) } catch { return null }
  })
  const [token,       setToken]       = useState(() => localStorage.getItem('carbon_token') || null)
  const [lastResult,  setLastResult]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('carbon_last_result')) } catch { return null }
  })

  const login = useCallback((tokenValue, userData) => {
    localStorage.setItem('carbon_token', tokenValue)
    localStorage.setItem('carbon_user',  JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('carbon_token')
    localStorage.removeItem('carbon_user')
    localStorage.removeItem('carbon_last_result')
    setToken(null)
    setUser(null)
    setLastResult(null)
  }, [])

  const saveResult = useCallback((result) => {
    localStorage.setItem('carbon_last_result', JSON.stringify(result))
    setLastResult(result)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, lastResult, login, logout, saveResult }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
