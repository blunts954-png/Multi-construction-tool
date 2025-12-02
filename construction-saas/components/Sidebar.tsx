'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  companyName: string
}

export default function Sidebar({ companyName }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Projects', href: '/projects', icon: '🏗️' },
    { name: 'Invoices', href: '/invoices', icon: '📄' },
    { name: 'RFIs', href: '/rfis', icon: '❓' },
    { name: 'Change Orders', href: '/change-orders', icon: '📝' },
    { name: 'Daily Reports', href: '/daily-reports', icon: '📋' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white">
      {/* Logo/Company Name */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold truncate">{companyName}</h1>
        <p className="text-xs text-gray-400 mt-1">Construction SaaS</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          v1.0.0 - Market Ready
        </p>
      </div>
    </div>
  )
}
