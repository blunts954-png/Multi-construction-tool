/**
 * GET /api/integrations/quickbooks/callback
 * QuickBooks OAuth callback handler
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { exchangeCodeForTokens } from '@/lib/quickbooks'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.user) return auth.response

  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')

    if (!code || !realmId) {
      return NextResponse.json(
        { error: 'Missing authorization code or realm ID' },
        { status: 400 }
      )
    }

    await exchangeCodeForTokens(code, auth.user.accountId)

    return NextResponse.json({
      message: 'QuickBooks connected successfully',
      realmId,
    })
  } catch (error) {
    console.error('QuickBooks callback error:', error)
    return NextResponse.json(
      { error: 'Failed to complete QuickBooks authorization' },
      { status: 500 }
    )
  }
}
