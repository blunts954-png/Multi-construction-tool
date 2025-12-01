/**
 * RFI API Routes
 * POST /api/rfis - Create new RFI
 * GET /api/rfis - List RFIs
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
      subject,
      question,
      toContactId,
      priority,
      dueDate,
      aiGenerated,
      sourceEmailId,
    } = body

    if (!projectId || !subject || !question) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get next RFI number for this account
    const lastRfi = await prisma.rFI.findFirst({
      where: { accountId: auth.user.accountId },
      orderBy: { createdAt: 'desc' },
      select: { rfiNumber: true },
    })

    const nextNumber = lastRfi
      ? parseInt(lastRfi.rfiNumber.split('-')[1]) + 1
      : 1
    const rfiNumber = `RFI-${String(nextNumber).padStart(3, '0')}`

    const rfi = await prisma.rFI.create({
      data: {
        accountId: auth.user.accountId,
        projectId,
        rfiNumber,
        subject,
        question,
        toContactId,
        priority: priority || 'normal',
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'draft',
        createdById: auth.user.userId,
        aiGenerated: aiGenerated || false,
        sourceEmailId,
      },
      include: {
        project: true,
        toContact: true,
        createdBy: true,
      },
    })

    return NextResponse.json({ rfi })
  } catch (error) {
    console.error('Create RFI error:', error)
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

    const rfis = await prisma.rFI.findMany({
      where: {
        accountId: auth.user.accountId,
        ...(projectId && { projectId }),
        ...(status && { status }),
      },
      include: {
        project: { select: { name: true } },
        toContact: { select: { firstName: true, lastName: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ rfis })
  } catch (error) {
    console.error('Get RFIs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
