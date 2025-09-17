'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input } from '@saas/ui'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function TwoFactorPage() {
  const { user, token, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Setup state
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [setupToken, setSetupToken] = useState('')
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupError, setSetupError] = useState('')
  const [setupSuccess, setSetupSuccess] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  // Disable state
  const [disablePassword, setDisablePassword] = useState('')
  const [disableToken, setDisableToken] = useState('')
  const [disableBackupCode, setDisableBackupCode] = useState('')
  const [disableLoading, setDisableLoading] = useState(false)
  const [disableError, setDisableError] = useState('')

  const [step, setStep] = useState<'main' | 'setup' | 'confirm' | 'backup-codes' | 'disable'>('main')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleSetup2FA = async () => {
    setSetupLoading(true)
    setSetupError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/2fa/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la configuration 2FA')
      }

      setQrCode(data.qrCode)
      setSecret(data.secret)
      setStep('setup')
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : 'Erreur lors de la configuration 2FA')
    } finally {
      setSetupLoading(false)
    }
  }

  const handleConfirm2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setSetupLoading(true)
    setSetupError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/2fa/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: setupToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la confirmation 2FA')
      }

      setBackupCodes(data.backupCodes)
      setStep('backup-codes')
      setSetupSuccess(data.message)
    } catch (err) {
      setSetupError(err instanceof Error ? err.message : 'Erreur lors de la confirmation 2FA')
    } finally {
      setSetupLoading(false)
    }
  }

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setDisableLoading(true)
    setDisableError('')

    try {
      const body: any = {}
      if (disablePassword) body.password = disablePassword
      if (disableToken) body.token = disableToken
      if (disableBackupCode) body.backupCode = disableBackupCode

      const response = await fetch(`${API_URL}/api/auth/2fa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la désactivation 2FA')
      }

      // Refresh page to update user state
      window.location.reload()
    } catch (err) {
      setDisableError(err instanceof Error ? err.message : 'Erreur lors de la désactivation 2FA')
    } finally {
      setDisableLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                href="/profile"
                className="text-indigo-600 hover:text-indigo-500 mr-4"
              >
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Authentification à deux facteurs (2FA)</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'main' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sécurisez votre compte
              </h2>
              <p className="text-gray-600">
                L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.
              </p>
            </div>

            {!user?.twoFactorEnabled ? (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    2FA non activé
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Activez l'authentification à deux facteurs pour protéger votre compte contre les accès non autorisés.
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1 mb-4">
                    <li>• Protection supplémentaire contre le piratage</li>
                    <li>• Codes de sauvegarde d'urgence</li>
                    <li>• Compatible avec Google Authenticator, Authy, etc.</li>
                  </ul>
                </div>

                <Button
                  onClick={handleSetup2FA}
                  disabled={setupLoading}
                  className="w-full"
                  size="lg"
                >
                  {setupLoading ? 'Configuration...' : 'Activer 2FA'}
                </Button>

                {setupError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {setupError}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    ✅ 2FA activé
                  </h3>
                  <p className="text-green-700">
                    Votre compte est protégé par l'authentification à deux facteurs.
                  </p>
                </div>

                <Button
                  onClick={() => setStep('disable')}
                  variant="outline"
                  className="w-full"
                >
                  Désactiver 2FA
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'setup' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Étape 1 : Scannez le QR code
            </h2>

            <div className="text-center mb-8">
              {qrCode && (
                <img 
                  src={qrCode} 
                  alt="QR Code 2FA" 
                  className="mx-auto mb-4 border rounded-lg"
                />
              )}
              <p className="text-gray-600 mb-4">
                Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Ou entrez manuellement cette clé :</p>
                <code className="text-sm font-mono break-all">{secret}</code>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => setStep('main')}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                className="flex-1"
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Étape 2 : Confirmez avec un code
            </h2>

            <form onSubmit={handleConfirm2FA} className="space-y-6">
              {setupError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {setupError}
                </div>
              )}

              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                  Code d'authentification
                </label>
                <Input
                  id="token"
                  type="text"
                  required
                  value={setupToken}
                  onChange={(e) => setSetupToken(e.target.value.replace(/\s+/g, ''))}
                  placeholder="123456"
                  className="w-full text-center text-xl font-mono"
                  maxLength={6}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Entrez le code à 6 chiffres affiché dans votre app d'authentification
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={() => setStep('setup')}
                  variant="outline"
                  className="flex-1"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={setupLoading || setupToken.length !== 6}
                  className="flex-1"
                >
                  {setupLoading ? 'Vérification...' : 'Confirmer'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'backup-codes' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                2FA activé avec succès !
              </h2>
              <p className="text-gray-600">
                Sauvegardez ces codes de secours dans un endroit sûr. 
                Ils vous permettront d'accéder à votre compte si vous perdez votre appareil.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                Codes de secours
              </h3>
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white p-2 rounded border text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button
                onClick={() => {
                  const codesText = backupCodes.join('\n')
                  const element = document.createElement('a')
                  const file = new Blob([codesText], { type: 'text/plain' })
                  element.href = URL.createObjectURL(file)
                  element.download = '2fa-backup-codes.txt'
                  document.body.appendChild(element)
                  element.click()
                  document.body.removeChild(element)
                }}
                variant="outline"
                className="mr-4"
              >
                📥 Télécharger
              </Button>
              <Button
                onClick={() => router.push('/profile')}
                className="ml-4"
              >
                Terminé
              </Button>
            </div>
          </div>
        )}

        {step === 'disable' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Désactiver 2FA
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                ⚠️ Attention
              </h3>
              <p className="text-red-700">
                Désactiver 2FA réduira la sécurité de votre compte. 
                Veuillez confirmer avec votre mot de passe ET un code d'authentification ou un code de secours.
              </p>
            </div>

            <form onSubmit={handleDisable2FA} className="space-y-6">
              {disableError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {disableError}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel
                </label>
                <Input
                  id="password"
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="disable-token" className="block text-sm font-medium text-gray-700 mb-2">
                  Code d'authentification OU Code de secours
                </label>
                <Input
                  id="disable-token"
                  type="text"
                  value={disableToken || disableBackupCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s+/g, '')
                    if (value.length <= 6) {
                      setDisableToken(value)
                      setDisableBackupCode('')
                    } else {
                      setDisableBackupCode(value.toUpperCase())
                      setDisableToken('')
                    }
                  }}
                  placeholder="123456 ou ABCD1234"
                  className="w-full"
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={() => setStep('main')}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={disableLoading || !disablePassword || (!disableToken && !disableBackupCode)}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                >
                  {disableLoading ? 'Désactivation...' : 'Désactiver 2FA'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
