'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@saas/ui'
import { useAuth } from '../../contexts/AuthContext'

export default function CancelPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page</p>
          <Button onClick={() => router.push('/login')}>
            Se connecter
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full mx-4">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement annulé
          </h1>

          <p className="text-gray-600 mb-6">
            Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Pourquoi mon paiement a-t-il été annulé ?</p>
                <p>Le paiement peut être annulé pour plusieurs raisons : vous avez fermé la fenêtre, votre carte a été refusée, ou vous avez cliqué sur "Annuler".</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => router.push('/payment')} className="w-full">
              Réessayer le paiement
            </Button>
            <Button onClick={() => router.push('/dashboard')} variant="secondary" className="w-full">
              Retour au tableau de bord
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Besoin d'aide ? <a href="mailto:support@votreapp.com" className="text-blue-600 hover:underline">Contactez notre support</a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
