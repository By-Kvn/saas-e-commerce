'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button, Input } from '@saas/ui'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Token de réinitialisation manquant')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      setLoading(false)
      return
    }

    if (!token) {
      setError('Token de réinitialisation manquant')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation')
      }

      setMessage(data.message)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Lien invalide
            </h2>
            <p className="text-gray-600 mb-6">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <Link href="/forgot-password">
              <Button className="w-full">
                Demander un nouveau lien
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Mot de passe réinitialisé !
            </h2>
            <p className="text-gray-600 mb-6">
              Votre mot de passe a été réinitialisé avec succès.
              Vous allez être redirigé vers la page de connexion dans quelques secondes.
            </p>
            <Link href="/login">
              <Button className="w-full">
                Se connecter maintenant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Nouveau mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum 8 caractères
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Réinitialisation...
                  </div>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
              >
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chargement...
          </h2>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
