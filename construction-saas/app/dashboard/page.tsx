'use client'

import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import Card from '@/components/Card'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to Construction SaaS
          </h2>
          <p className="text-gray-700">
            Your AI-powered construction management platform is ready. Get started by creating your first project or uploading an invoice.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card padding="md" hover>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Active Projects</p>
              <p className="text-4xl font-bold text-blue-600">0</p>
            </div>
          </Card>
          <Card padding="md" hover>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Open RFIs</p>
              <p className="text-4xl font-bold text-yellow-600">0</p>
            </div>
          </Card>
          <Card padding="md" hover>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Pending Invoices</p>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
          </Card>
          <Card padding="md" hover>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">Change Orders</p>
              <p className="text-4xl font-bold text-purple-600">0</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card padding="lg" hover>
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Project
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Start a new construction project and track budgets, timelines, and progress.
              </p>
              <Link
                href="/projects"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Go to Projects →
              </Link>
            </Card>

            <Card padding="lg" hover>
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Invoice
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                AI will extract all data and sync to QuickBooks automatically.
              </p>
              <Link
                href="/invoices"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Upload Now →
              </Link>
            </Card>

            <Card padding="lg" hover>
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create RFI
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Submit requests for information and track responses.
              </p>
              <Link
                href="/rfis"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Manage RFIs →
              </Link>
            </Card>

            <Card padding="lg" hover>
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Change Orders
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Track scope changes with financial and schedule impact.
              </p>
              <Link
                href="/change-orders"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Change Orders →
              </Link>
            </Card>

            <Card padding="lg" hover>
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Daily Report
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Record voice logs or create text reports from the field.
              </p>
              <Link
                href="/daily-reports"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Create Report →
              </Link>
            </Card>

            <Card padding="lg" hover>
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Settings
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Manage your profile, integrations, and account settings.
              </p>
              <Link
                href="/settings"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Open Settings →
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
