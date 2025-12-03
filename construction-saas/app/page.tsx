'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to dashboard for demo
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-600">Loading demo...</div>
    </div>
  )
}
