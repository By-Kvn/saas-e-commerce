'use client'

import { useState } from 'react'
import { Button, Input } from '@saas/ui'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testRegistration = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Utilisateur Test',
          email: email,
          password: 'motdepasse123'
        }),
      })

      const data = await response.json()
      
      setResult({
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toLocaleTimeString()
      })

    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test d'Envoi d'Email
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tester l'inscription</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email à tester
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full"
              />
            </div>

            <Button 
              onClick={testRegistration}
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? '⏳ Test en cours...' : '📧 Tester l\'envoi d\'email'}
            </Button>
          </div>
        </div>

        {result && (
          <div className={`rounded-lg shadow p-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              {result.success ? '✅ Succès' : '❌ Erreur'}
              <span className="ml-2 text-sm font-normal text-gray-500">
                {result.timestamp}
              </span>
            </h3>

            <div className="space-y-3">
              <div>
                <strong>Status HTTP:</strong> {result.status}
              </div>
              
              {result.data && (
                <div>
                  <strong>Réponse:</strong>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
{JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {result.error && (
                <div>
                  <strong>Erreur:</strong> {result.error}
                </div>
              )}
            </div>

            {result.success && (
              <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">
                  🔍 Comment vérifier l'email :
                </h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>1. Vérifiez votre boîte email ({email})</li>
                  <li>2. Regardez dans le dossier spam/indésirables</li>
                  <li>3. Ouvrez la console du navigateur (F12) pour plus de détails</li>
                  <li>4. Vérifiez les logs de l'API dans votre terminal</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            📋 Instructions de vérification :
          </h3>
          <div className="text-yellow-700 text-sm space-y-2">
            <p><strong>Mode Test (Ethereal):</strong> Recherchez dans les logs de l'API une URL comme : https://ethereal.email/message/...</p>
            <p><strong>Mode Gmail:</strong> L'email sera envoyé à l'adresse saisie ci-dessus</p>
            <p><strong>Logs API:</strong> Ouvrez votre terminal où l'API tourne pour voir les détails d'envoi</p>
          </div>
        </div>
      </div>
    </div>
  )
}