/**
 * Daily Report API Routes
 * POST /api/daily-reports - Create daily report
 * GET /api/daily-reports - List daily reports
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
      reportDate,
      weatherAM,
      weatherPM,
      temperature,
      workPerformed,
      laborSummary,
      equipmentUsed,
      deliveries,
      delays,
      safetyIssues,
      voiceRecorded,
    } = body

    if (!projectId || !reportDate) {
      return NextResponse.json(
        { error: 'Project and report date are required' },
        { status: 400 }
      )
    }

    const dailyReport = await prisma.dailyReport.create({
      data: {
        accountId: auth.user.accountId,
        projectId,
        reportDate: new Date(reportDate),
        weatherAM,
        weatherPM,
        temperature,
        workPerformed,
        laborSummary,
        equipmentUsed,
        deliveries,
        delays,
        safetyIssues,
        voiceRecorded: voiceRecorded || false,
        createdById: auth.user.userId,
      },
      include: {
        project: { select: { name: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    })

    return NextResponse.json({ dailyReport })
  } catch (error) {
    console.error('Create daily report error:', error)
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const dailyReports = await prisma.dailyReport.findMany({
      where: {
        accountId: auth.user.accountId,
        ...(projectId && { projectId }),
        ...(startDate && {
          reportDate: { gte: new Date(startDate) },
        }),
        ...(endDate && {
          reportDate: { lte: new Date(endDate) },
        }),
      },
      include: {
        project: { select: { name: true } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { reportDate: 'desc' },
    })

    return NextResponse.json({ dailyReports })
  } catch (error) {
    console.error('Get daily reports error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
