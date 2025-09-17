'use client'

import { useState } from 'react'
import { Button, Card } from '@saas/ui'

// Mock cart data
const mockCartItems = [
  {
    id: '1',
    productId: '1',
    name: 'T-Shirt Classique Noir',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    variant: 'M - Noir',
    price: 29.99,
    quantity: 2
  },
  {
    id: '2',
    productId: '2',
    name: 'T-Shirt Vintage Blanc',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300',
    variant: 'L - Blanc',
    price: 27.99,
    quantity: 1
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal + shipping

  const handleCheckout = () => {
    alert('Redirection vers le paiement...')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Style Unique
              </h1>
              <nav className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  Panier (0)
                </Button>
                <Button size="sm">
                  Connexion
                </Button>
              </nav>
            </div>
          </div>
        </header>

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
            <Button size="lg" onClick={() => window.location.href = '/'}>
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Style Unique
            </h1>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                Panier ({cartItems.length})
              </Button>
              <Button size="sm">
                Connexion
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.variant}
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
                        className="px-3 py-1 text-gray-600 hover:text-gray-800"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-center min-w-[3rem]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:text-gray-800"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      🗑️
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

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Continuer mes achats
              </Button>

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
