'use client'

import Link from 'next/link'
import { Navigation } from '../../components/Navigation'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            {/* Icône d'annulation */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Paiement annulé
            </h1>

            <p className="mt-2 text-gray-600">
              Votre paiement a été annulé. Aucun montant n'a été débité et vos articles sont toujours dans votre panier.
            </p>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-blue-900">
                Besoin d'aide ?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Si vous avez rencontré un problème lors du paiement,
                  n'hésitez pas à nous contacter ou réessayer.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/cart"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retour au panier
              </Link>

              <Link
                href="/"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continuer mes achats
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Vous pouvez également nous contacter à{' '}
                <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
