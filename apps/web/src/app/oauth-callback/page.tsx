'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function OAuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get('token')
      const provider = searchParams.get('provider')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        setError('Erreur lors de la connexion OAuth')
        setLoading(false)
        return
      }

      if (!token) {
        setError('Token manquant')
        setLoading(false)
        return
      }

      try {
        // Store the token and fetch user info
        localStorage.setItem('auth_token', token)
        
        // Fetch user profile
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const data = await response.json()
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        
        // Update auth context
        window.location.reload()
        
        // Redirect to dashboard
        router.push('/dashboard')
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError('Erreur lors de la finalisation de la connexion')
      } finally {
        setLoading(false)
      }
    }

    handleOAuthCallback()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Finalisation de la connexion...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous configurons votre compte.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Erreur de connexion
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return null
}
