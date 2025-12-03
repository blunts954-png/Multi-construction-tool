'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMockData, mockAccount, mockUsers } from '@/lib/mockData'
import Link from 'next/link'

export default function ChangeOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const accountData = localStorage.getItem('account')

    if (!userData || !accountData) {
      setUser(mockUsers[0])
      setAccount(mockAccount)
      localStorage.setItem('user', JSON.stringify(mockUsers[0]))
      localStorage.setItem('account', JSON.stringify(mockAccount))
    } else {
      setUser(JSON.parse(userData))
      setAccount(JSON.parse(accountData))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('account')
    router.push('/')
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>
  }

  const changeOrders = getMockData.getChangeOrders(account?.id || '')
  const projects = getMockData.getProjects(account?.id || '')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalPriceImpact = changeOrders
    .filter(co => co.status === 'approved')
    .reduce((sum, co) => sum + Number(co.priceImpact), 0)

  const totalScheduleImpact = changeOrders
    .filter(co => co.status === 'approved')
    .reduce((sum, co) => sum + co.scheduleImpact, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">Construction SaaS</h1>
            <p className="text-sm text-gray-400 mt-1">{account?.companyName}</p>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link href="/projects" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Projects
            </Link>
            <Link href="/invoices" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              Invoices
            </Link>
            <Link href="/rfis" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              RFIs
            </Link>
            <Link href="/change-orders" className="flex items-center px-4 py-3 bg-gray-800 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Change Orders
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="px-8 py-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Change Orders</h2>
              <p className="text-gray-600 mt-1">Track scope changes and budget impacts</p>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">+ New Change Order</button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total COs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{changeOrders.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{changeOrders.filter(co => co.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Approved Budget Impact</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${(totalPriceImpact / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Schedule Impact</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                +{totalScheduleImpact} days
              </p>
            </div>
          </div>

          {/* Change Orders List */}
          <div className="space-y-4">
            {changeOrders.map((co) => {
              const project = projects.find(p => p.id === co.projectId)
              return (
                <div key={co.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-purple-600">{co.coNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(co.status)}`}>
                          {co.status.charAt(0).toUpperCase() + co.status.slice(1)}
                        </span>
                        {co.aiGenerated && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            🤖 AI Generated
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{co.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{co.description}</p>
                      {co.reason && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Reason:</p>
                          <p className="text-sm text-blue-800">{co.reason}</p>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <span className="font-semibold text-gray-900">
                          💰 Price Impact:
                          <span className={Number(co.priceImpact) >= 0 ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                            {Number(co.priceImpact) >= 0 ? '+' : ''}${Number(co.priceImpact).toLocaleString()}
                          </span>
                        </span>
                        <span className="font-semibold text-gray-900">
                          📅 Schedule Impact:
                          <span className={co.scheduleImpact > 0 ? 'text-orange-600 ml-2' : 'text-green-600 ml-2'}>
                            {co.scheduleImpact > 0 ? '+' : ''}{co.scheduleImpact} days
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📁 {project?.name || 'Unknown Project'}</span>
                        {co.submittedDate && <span>📤 Submitted: {new Date(co.submittedDate).toLocaleDateString()}</span>}
                        {co.approvedDate && <span>✅ Approved: {new Date(co.approvedDate).toLocaleDateString()}</span>}
                        {co.rejectedDate && <span>❌ Rejected: {new Date(co.rejectedDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">View Details</button>
                    {co.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">Approve</button>
                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
