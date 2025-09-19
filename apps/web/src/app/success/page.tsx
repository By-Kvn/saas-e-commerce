'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const session_id = searchParams.get('session_id')
    setSessionId(session_id)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
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
            Paiement réussi !
          </h1>

          <p className="mt-2 text-gray-600">
            Merci pour votre abonnement. Votre compte a été activé avec succès.
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
            <Link
              href="/dashboard"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aller au tableau de bord
            </Link>

            <Link
              href="/profile"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voir mon profil
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Un email de confirmation vous a été envoyé.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
