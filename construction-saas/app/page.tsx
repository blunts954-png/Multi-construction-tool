import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Construction Management,
            <span className="text-blue-600"> Powered by AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Stop wasting hours on paperwork. Let AI handle invoice processing, RFIs, and daily reports
            while you focus on building great projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-800 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              AI Invoice Processing
            </h3>
            <p className="text-gray-600">
              Upload invoices, AI extracts all data automatically. Sync directly to QuickBooks
              with one click. Save 10+ hours per week.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Smart RFI Management
            </h3>
            <p className="text-gray-600">
              AI reads your emails and automatically creates RFIs. Track responses, deadlines,
              and keep everyone on the same page.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Change Order Tracking
            </h3>
            <p className="text-gray-600">
              Manage scope changes with complete financial impact tracking.
              AI-assisted creation from email threads.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Voice Daily Reports
            </h3>
            <p className="text-gray-600">
              Superintendents record voice logs from the field. AI converts them to
              structured daily reports instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Project Management
            </h3>
            <p className="text-gray-600">
              Track multiple projects, budgets, timelines, and costs.
              Multi-tenant architecture keeps your data secure.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              QuickBooks Integration
            </h3>
            <p className="text-gray-600">
              Seamless OAuth2 connection. Bills and expenses sync automatically.
              No more double data entry.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-blue-600 rounded-2xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Hours Saved Weekly</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Invoice Accuracy</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Secure Multi-Tenant</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-white rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Construction Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join leading contractors who are saving time and growing faster with AI.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Built specifically for small to medium-sized general contractors</p>
        </div>
      </div>
    </div>
  )
}
