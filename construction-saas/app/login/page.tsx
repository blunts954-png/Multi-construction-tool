'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockUsers, mockAccount } from '@/lib/mockData'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Demo mode: Accept ANY credentials and load demo user
    const demoUser = mockUsers[0]
    const demoAccount = mockAccount

    // Store in localStorage
    localStorage.setItem('token', 'demo-token-' + Date.now())
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('account', JSON.stringify(demoAccount))

    // Redirect to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Construction SaaS</h1>
          <p className="text-gray-600">AI-Powered Project Management</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 font-semibold">🎯 DEMO MODE</p>
          <p className="text-xs text-blue-700 mt-1">
            Enter ANY email and password to access the demo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="demo@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter any password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Sign In to Demo
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Demo User: <span className="font-semibold">John Martinez</span>
          </p>
          <p className="text-sm text-gray-600">
            Company: <span className="font-semibold">Premier Construction Co.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
