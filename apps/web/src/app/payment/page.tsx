'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@saas/ui'
import { Navigation } from '../../components/Navigation'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€9.99',
    priceId: 'price_1XXXXXXXXXXXXXXXXX', // Remplacez par votre vrai Price ID Stripe
    features: [
      'Jusqu\'à 1 000 produits',
      'Support email',
      'Tableau de bord basique',
      'Paiements Stripe'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€29.99',
    priceId: 'price_2XXXXXXXXXXXXXXXXX', // Remplacez par votre vrai Price ID Stripe
    features: [
      'Produits illimités',
      'Support prioritaire',
      'Analytics avancés',
      'API complète',
      'Webhooks'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '€99.99',
    priceId: 'price_3XXXXXXXXXXXXXXXXX', // Remplacez par votre vrai Price ID Stripe
    features: [
      'Tout de Pro',
      'Support téléphonique',
      'Intégrations personnalisées',
      'SLA garantie',
      'Formation dédiée'
    ]
  }
]

export default function PaymentPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (priceId: string, planId: string) => {
    setLoading(planId)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session')
      }

      // Redirection vers Stripe Checkout
      const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      console.error('Erreur de paiement:', err)
      setError(err instanceof Error ? err.message : 'Erreur de paiement')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choisissez votre plan
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Sélectionnez l'abonnement qui correspond le mieux à vos besoins
            </p>
          </div>

          {error && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={`p-8 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Populaire
                  </span>
                )}

                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-500">/mois</span>
                  </div>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId, plan.id)}
                  disabled={loading === plan.id}
                  className={`mt-8 w-full py-3 px-4 rounded-md font-medium text-white transition-colors
                    ${plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-800 hover:bg-gray-900'
                    }
                    ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </span>
                  ) : (
                    'S\'abonner'
                  )}
                </button>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Tous les plans incluent une période d'essai gratuite de 14 jours
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Annulez à tout moment. Aucun engagement.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
