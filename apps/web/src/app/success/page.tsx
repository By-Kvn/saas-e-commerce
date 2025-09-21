'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '../../contexts/CartContext'
import { Navigation } from '../../components/Navigation'

// Composant qui utilise useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const session_id = searchParams.get('session_id')
    setSessionId(session_id)

    // Clear cart after successful payment
    if (session_id) {
      clearCart()
      // Petit délai pour s'assurer que le panier est vidé
      setTimeout(() => {
        setIsProcessing(false)
      }, 1000)
    } else {
      setIsProcessing(false)
    }
  }, [searchParams, clearCart])

  const handleContinueShopping = () => {
    // Forcer un rechargement complet pour éviter les problèmes de cache
    window.location.href = '/'
  }

  const handleViewProfile = () => {
    // Forcer un rechargement complet pour éviter les problèmes de cache
    window.location.href = '/profile'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            {/* Icône de succès */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Commande confirmée !
            </h1>

            <p className="mt-2 text-gray-600">
              Merci pour votre achat. Votre commande a été traitée avec succès et votre panier a été vidé.
            </p>

          {sessionId && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>ID de session :</strong>
              </p>
              <p className="text-xs text-gray-500 font-mono break-all">
                {sessionId}
              </p>
            </div>
          )}

            <div className="mt-8 space-y-3">
              <button
                onClick={handleContinueShopping}
                disabled={isProcessing}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Traitement...' : 'Continuer mes achats'}
              </button>

              <button
                onClick={handleViewProfile}
                disabled={isProcessing}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voir mon profil
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Un email de confirmation vous sera envoyé sous peu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant principal avec Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}