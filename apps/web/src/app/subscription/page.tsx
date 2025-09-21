'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@saas/ui'
import { Navigation } from '../../components/Navigation'
import { useAuth } from '../../contexts/AuthContext'

interface Subscription {
  id: string
  status: string
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
  priceId: string
  productId: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  description: string
  created: number
  receiptUrl: string
}

const planNames: { [key: string]: string } = {
  'prod_T5G7COaEXVVvW7': 'Starter',
  'prod_T5G8rWE1zf5BvN': 'Standard',
  'prod_T5G8mo3lbvofMF': 'Premium',
}

export default function SubscriptionPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchSubscriptionData = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      // Fetch subscription status
      const subResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/subscription-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const subData = await subResponse.json()

      if (subData.hasSubscription) {
        setSubscription(subData.subscription)
      }

      // Fetch payment history
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/payment-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const paymentData = await paymentResponse.json()
      setPayments(paymentData.payments || [])

    } catch (err) {
      console.error('Error fetching subscription data:', err)
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated) {
      fetchSubscriptionData()
    }
  }, [isAuthenticated, authLoading, fetchSubscriptionData])

  const handleCancelSubscription = async () => {
    setActionLoading('cancel')
    setError(null)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        fetchSubscriptionData() // Refresh data
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erreur lors de l\'annulation')
    } finally {
      setActionLoading(null)
    }
  }

  const handleChangePlan = async (newProductId: string) => {
    setActionLoading('change')
    setError(null)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/change-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newProductId })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        fetchSubscriptionData() // Refresh data
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erreur lors du changement de plan')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR')
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Gestion des Abonnements
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Gérez votre abonnement et consultez l'historique de vos paiements
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* Current Subscription */}
          <Card className="mb-8 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Abonnement Actuel</h2>

            {subscription ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Plan</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {planNames[subscription.productId] || 'Plan Inconnu'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <p className={`text-lg font-semibold ${
                      subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {subscription.status === 'active' ? 'Actif' : 'Inactif'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prochaine facturation</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Annulation programmée</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {subscription.cancelAtPeriodEnd ? 'Oui' : 'Non'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  {!subscription.cancelAtPeriodEnd && (
                    <Button
                      onClick={handleCancelSubscription}
                      disabled={actionLoading === 'cancel'}
                      variant="secondary"
                    >
                      {actionLoading === 'cancel' ? 'Annulation...' : 'Annuler l\'abonnement'}
                    </Button>
                  )}

                  <Button
                    onClick={() => router.push('/payment')}
                    variant="outline"
                  >
                    Changer de plan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Aucun abonnement actif</p>
                <Button onClick={() => router.push('/payment')}>
                  S'abonner maintenant
                </Button>
              </div>
            )}
          </Card>

          {/* Payment History */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Historique des Paiements</h2>

            {payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reçu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.created)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.description || 'Paiement'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'succeeded'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status === 'succeeded' ? 'Réussi' : 'Échoué'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.receiptUrl && (
                            <a
                              href={payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Voir le reçu
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucun paiement effectué</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
