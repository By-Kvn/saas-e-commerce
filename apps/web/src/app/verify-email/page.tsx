'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@saas/ui'
import { useAuth } from '../../contexts/AuthContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de vérification')
      }

      setMessage('Votre email a été vérifié avec succès !')
      setVerified(true)
      
      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de vérification')
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!user?.email) return

    setResendLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du renvoi')
      }

      setMessage('Un nouvel email de vérification a été envoyé.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du renvoi')
    } finally {
      setResendLoading(false)
    }
  }

  if (loading && token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Vérification en cours...
            </h2>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous vérifions votre email.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {verified ? (
            <div>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                Email vérifié !
              </h2>
              <p className="text-gray-600 mb-6">
                Votre adresse email a été vérifiée avec succès. 
                Vous allez être redirigé vers votre tableau de bord dans quelques secondes.
              </p>
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Aller au tableau de bord
              </Button>
            </div>
          ) : error ? (
            <div>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-700 mb-4">
                Erreur de vérification
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              {user && !user.emailVerified && (
                <div className="space-y-4">
                  <Button
                    onClick={resendVerification}
                    disabled={resendLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {resendLoading ? 'Envoi...' : 'Renvoyer l\'email de vérification'}
                  </Button>
                  <div className="text-sm text-gray-500">
                    ou{' '}
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="text-indigo-600 hover:text-indigo-500 underline"
                    >
                      continuer sans vérifier
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vérifiez votre email
              </h2>
              <p className="text-gray-600 mb-6">
                Un email de vérification a été envoyé à votre adresse.
                Cliquez sur le lien dans l'email pour vérifier votre compte.
              </p>
              
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-6">
                  {message}
                </div>
              )}

              {user && !user.emailVerified && (
                <div className="space-y-4">
                  <Button
                    onClick={resendVerification}
                    disabled={resendLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {resendLoading ? 'Envoi...' : 'Renvoyer l\'email de vérification'}
                  </Button>
                  <div className="text-sm text-gray-500">
                    ou{' '}
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="text-indigo-600 hover:text-indigo-500 underline"
                    >
                      continuer sans vérifier
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
