/**
 * Project API Routes
 * POST /api/projects - Create new project
 * GET /api/projects - List projects
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
      name,
      address,
      city,
      state,
      zipCode,
      startDate,
      endDate,
      estimatedBudget,
      status,
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        accountId: auth.user.accountId,
        name,
        address,
        city,
        state,
        zipCode,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        estimatedBudget,
        status: status || 'active',
      },
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Create project error:', error)
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
    const status = searchParams.get('status')

    const projects = await prisma.project.findMany({
      where: {
        accountId: auth.user.accountId,
        ...(status && { status }),
      },
      include: {
        _count: {
          select: {
            rfis: true,
            changeOrders: true,
            invoices: true,
            dailyReports: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
