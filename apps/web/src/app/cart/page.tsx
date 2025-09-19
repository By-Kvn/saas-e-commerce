'use client'

import { useCart } from '../../contexts/CartContext'
import { Button, Card } from '@saas/ui'
import { Navigation } from '../../components/Navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal + shipping

  const handleCheckout = () => {
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8">
              Découvrez notre collection et ajoutez des produits à votre panier
            </p>
            <Link href="/">
              <Button size="lg">
                Continuer mes achats
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panier ({items.length} article{items.length > 1 ? 's' : ''})
          </h1>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Vider le panier
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.subtitle}
                    </p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-center min-w-[3rem] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800 p-1 transition-colors"
                      aria-label="Supprimer l'article"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Résumé de commande
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 Livraison gratuite activée !
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-sm text-gray-600">
                    Livraison gratuite dès {formatPrice(50)}
                  </p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-black text-white hover:bg-gray-800 mb-4"
                onClick={handleCheckout}
              >
                Procéder au paiement
              </Button>

              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Continuer mes achats
                </Button>
              </Link>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>🚚</span>
                  <span>Livraison suivie</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
