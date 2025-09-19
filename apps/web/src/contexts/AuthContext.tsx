'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthenticatedUser, AuthResponse, LoginInput, RegisterInput } from '@saas/types'

interface AuthContextType {
  user: AuthenticatedUser | null
  token: string | null
  login: (credentials: LoginInput) => Promise<AuthResponse>
  register: (credentials: RegisterInput) => Promise<AuthResponse>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'

// Utilitaires sécurisés pour localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key)
      } catch (error) {
        console.error('Error reading from localStorage:', error)
        return null
      }
    }
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        console.error('Error writing to localStorage:', error)
      }
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error('Error removing from localStorage:', error)
      }
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window !== 'undefined') {
      const savedToken = safeLocalStorage.getItem('auth_token')
      const savedUser = safeLocalStorage.getItem('auth_user')

      if (savedToken && savedUser) {
        try {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing saved user:', error)
          // Nettoyer les données corrompues
          safeLocalStorage.removeItem('auth_token')
          safeLocalStorage.removeItem('auth_user')
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      // Save to localStorage and state
      safeLocalStorage.setItem('auth_token', data.token)
      safeLocalStorage.setItem('auth_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (credentials: RegisterInput): Promise<AuthResponse> => {
    try {
      console.log('Register attempt with API URL:', API_URL)
      console.log('Register credentials:', { email: credentials.email, name: credentials.name })
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      console.log('Register response status:', response.status)
      console.log('Register response headers:', response.headers)

      let data;
      const responseText = await response.text()
      console.log('Register response text:', responseText)
      
      try {
        data = JSON.parse(responseText)
        console.log('Register response data:', data)
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
        console.log('Raw response:', responseText)
        throw new Error('Réponse serveur invalide (pas du JSON)')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'inscription')
      }

      // Save to localStorage and state
      safeLocalStorage.setItem('auth_token', data.token)
      safeLocalStorage.setItem('auth_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)

      return data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = () => {
    safeLocalStorage.removeItem('auth_token')
    safeLocalStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
