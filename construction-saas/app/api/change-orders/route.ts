/**
 * Change Order API Routes
 * POST /api/change-orders - Create new Change Order
 * GET /api/change-orders - List Change Orders
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.user) return auth.response

  try {
    const body = await request.json()
    const {
      projectId,
      title,
      description,
      reason,
      priceImpact,
      scheduleImpact,
      contactId,
      aiGenerated,
      sourceEmailId,
    } = body

    if (!projectId || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get next CO number for this account
    const lastCo = await prisma.changeOrder.findFirst({
      where: { accountId: auth.user.accountId },
      orderBy: { createdAt: 'desc' },
      select: { coNumber: true },
    })

    const nextNumber = lastCo
      ? parseInt(lastCo.coNumber.split('-')[1]) + 1
      : 1
    const coNumber = `CO-${String(nextNumber).padStart(3, '0')}`

    const changeOrder = await prisma.changeOrder.create({
      data: {
        accountId: auth.user.accountId,
        projectId,
        coNumber,
        title,
        description,
        reason,
        priceImpact: priceImpact || 0,
        scheduleImpact: scheduleImpact || 0,
        contactId,
        status: 'draft',
        createdById: auth.user.userId,
        aiGenerated: aiGenerated || false,
        sourceEmailId,
      },
      include: {
        project: true,
        contact: true,
        createdBy: true,
      },
    })

    return NextResponse.json({ changeOrder })
  } catch (error) {
    console.error('Create Change Order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.user) return auth.response

  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const changeOrders = await prisma.changeOrder.findMany({
      where: {
        accountId: auth.user.accountId,
        ...(projectId && { projectId }),
        ...(status && { status }),
      },
      include: {
        project: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ changeOrders })
  } catch (error) {
    console.error('Get Change Orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
