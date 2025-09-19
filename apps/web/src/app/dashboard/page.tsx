'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@saas/ui'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const { user, logout, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isAuthenticated, loading, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Ne pas rendre avant que le composant soit monté côté client
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Mon profil
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Déconnexion
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenue{user?.name ? `, ${user.name}` : ''} !
              </h2>
              <p className="text-gray-600 text-lg">
                Votre email : <span className="font-medium">{user?.email}</span>
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user?.emailVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.emailVerified ? (
                  <>
                    <span className="mr-1">✅</span>
                    Email vérifié
                  </>
                ) : (
                  <>
                    <span className="mr-1">⚠️</span>
                    Email non vérifié
                  </>
                )}
              </div>
            </div>
          </div>

          {!user?.emailVerified && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Vérification d'email en attente
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Votre email n'est pas encore vérifié. Certaines fonctionnalités peuvent être limitées.
                  </p>
                  <div className="mt-3">
                    <Link href="/verify-email">
                      <Button size="sm" variant="outline">
                        Vérifier maintenant
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👤</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Statut du compte</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.emailVerified ? 'Vérifié' : 'En attente'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🔒</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sécurité</p>
                <p className="text-2xl font-bold text-gray-900">Protégé</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⚡</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Plan</p>
                <p className="text-2xl font-bold text-gray-900">Gratuit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/profile">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">👤</div>
                  <div>
                    <h4 className="font-medium text-gray-900">Modifier mon profil</h4>
                    <p className="text-sm text-gray-600">Mettre à jour vos informations</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="text-2xl mr-3">💳</div>
                <div>
                  <h4 className="font-medium text-gray-900">Abonnements</h4>
                  <p className="text-sm text-gray-600">Gérer votre plan</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🛠️</div>
                <div>
                  <h4 className="font-medium text-gray-900">Paramètres</h4>
                  <p className="text-sm text-gray-600">Configurer votre compte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
