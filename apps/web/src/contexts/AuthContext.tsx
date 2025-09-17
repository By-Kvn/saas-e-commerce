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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
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
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
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

      const data = await response.json()
      console.log('Register response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'inscription')
      }

      // Save to localStorage and state
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)

      return data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
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
