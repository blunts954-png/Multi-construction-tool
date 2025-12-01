/**
 * GET /api/integrations/quickbooks/connect
 * Initiate QuickBooks OAuth flow
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { getAuthorizationUrl } from '@/lib/quickbooks'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.user) return auth.response

  try {
    const authUrl = getAuthorizationUrl()
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('QuickBooks connect error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}
