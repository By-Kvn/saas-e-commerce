'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireEmailVerification?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requireEmailVerification = false, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (requireEmailVerification && user && !user.emailVerified) {
        router.push('/verify-email')
        return
      }
    }
  }, [isAuthenticated, user, loading, router, requireEmailVerification, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (requireEmailVerification && user && !user.emailVerified) {
    return null // Will redirect to email verification
  }

  return <>{children}</>
}
