'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export function Navigation() {
  const { user, logout } = useAuth()
  const { getTotalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const totalItems = getTotalItems()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className="bg-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-white">ERZA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8 text-white">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/payment"
                  className=" px-3 py-2 rounded-md text-sm font-medium"
                >
                  Abonnements
                </Link>
                <Link
                  href="/profile"
                  className=" px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profil
                </Link>
                <Link
                  href="/cart"
                  className=" px-3 py-2 rounded-md text-sm font-medium relative"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9m-9-6h10"
                    />
                  </svg>
                  <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ${totalItems > 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    {totalItems}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className=" px-3 py-2 rounded-md text-sm font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/products"
                  className=" px-3 py-2 rounded-md text-sm font-medium"
                >
                  Produits
                </Link>
                <Link
                  href="/cart"
                  className=" px-3 py-2 rounded-md text-sm font-medium relative"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9m-9-6h10"
                    />
                  </svg>
                  <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-200 ${totalItems > 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    {totalItems}
                  </span>
                </Link>
                <Link
                  href="/login"
                  className=" px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className=" focus:outline-none focus:text-gray-900"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              title={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block  px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/payment"
                    className="block  px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Abonnements
                  </Link>
                  <Link
                    href="/profile"
                    className="block  px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center  px-3 py-2 rounded-md text-base font-medium relative"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9m-9-6h10"
                      />
                    </svg>
                    Panier {totalItems > 0 && `(${totalItems})`}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left  px-3 py-2 rounded-md text-base font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/products"
                    className="block  px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Produits
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center  px-3 py-2 rounded-md text-base font-medium relative"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9m-9-6h10"
                      />
                    </svg>
                    Panier {totalItems > 0 && `(${totalItems})`}
                  </Link>
                  <Link
                    href="/login"
                    className="block  px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
