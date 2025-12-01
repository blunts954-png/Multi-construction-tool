export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Construction SaaS
          </h1>
          <p className="text-gray-600">
            AI-Powered Construction Management Platform
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
          <a
            href="/register"
            className="block w-full py-3 px-4 bg-gray-100 text-gray-800 text-center rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Sign Up
          </a>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Features
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>AI-powered invoice extraction & QuickBooks sync</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Email to RFI & Change Order automation</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Voice-to-text daily reports</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Multi-tenant project management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
