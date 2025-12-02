'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { apiGet } from '@/lib/utils/api'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [qbConnected, setQbConnected] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const accountData = localStorage.getItem('account')
    if (userData) setUser(JSON.parse(userData))
    if (accountData) {
      const acct = JSON.parse(accountData)
      setAccount(acct)
      setQbConnected(!!acct.qbRealmId)
    }
  }, [])

  const handleQuickBooksConnect = () => {
    window.location.href = '/api/integrations/quickbooks/connect'
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Profile Section */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={user?.firstName || ''}
                disabled
              />
              <Input
                label="Last Name"
                value={user?.lastName || ''}
                disabled
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
            />
            <Input
              label="Role"
              value={user?.role || ''}
              disabled
            />
          </div>
        </Card>

        {/* Company Section */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={account?.companyName || ''}
              disabled
            />
            <Input
              label="Plan Type"
              value={account?.planType || ''}
              disabled
            />
            <Input
              label="Account Status"
              value={account?.status || ''}
              disabled
            />
          </div>
        </Card>

        {/* QuickBooks Integration */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Integrations</h2>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-3xl mr-4">💼</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">QuickBooks Online</h3>
                  <p className="text-sm text-gray-600">
                    {qbConnected
                      ? 'Connected - Invoices will sync automatically'
                      : 'Connect to sync invoices and bills automatically'
                    }
                  </p>
                </div>
              </div>
              <div>
                {qbConnected ? (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium">✓ Connected</span>
                  </div>
                ) : (
                  <Button onClick={handleQuickBooksConnect}>
                    Connect QuickBooks
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
