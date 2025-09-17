'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/ui/Button'
import { ApiResponse } from '@/types'

export default function HomePage() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const fetchHello = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/hello`)
      const data: ApiResponse = await response.json()
      setMessage(data.message)
    } catch (error) {
      console.error('Error fetching hello:', error)
      setMessage('Error connecting to API')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHello()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to SaaS Monorepo
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">API Response:</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <p className="text-green-600 font-medium">{message}</p>
          )}
        </div>

        <Button onClick={fetchHello} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh API Call'}
        </Button>

        <div className="mt-8 space-y-2 text-sm text-gray-600">
          <p>🚀 Next.js 15 + TypeScript</p>
          <p>⚡ Fastify + Prisma Backend</p>
          <p>🎨 Shared UI Components</p>
          <p>🔧 Turborepo Monorepo</p>
        </div>
      </div>
    </div>
  )
}
