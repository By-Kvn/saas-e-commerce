'use client'

import { useAuth } from '../contexts/AuthContext'
import { Button } from '@saas/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              SaaS App
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Tableau de bord
                </Link>
                <Link href="/payment" className="text-gray-700 hover:text-gray-900">
                  Abonnements
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                  Profil
                </Link>
                <span className="text-sm text-gray-500">
                  {user.email}
                </span>
                <Button onClick={handleLogout} variant="secondary">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Connexion
                </Link>
                <Link href="/register">
                  <Button>S'inscrire</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
