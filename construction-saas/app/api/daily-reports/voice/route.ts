/**
 * POST /api/daily-reports/voice
 * Upload voice recording and convert to daily report
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { saveFile } from '@/lib/storage'
import { transcribeAudio, extractDailyReport } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.user) return auth.response

  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const projectId = formData.get('projectId') as string

    if (!audioFile || !projectId) {
      return NextResponse.json(
        { error: 'Audio file and project ID are required' },
        { status: 400 }
      )
    }

    // Validate audio file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a']
    if (!allowedTypes.includes(audioFile.type)) {
      return NextResponse.json(
        { error: 'Invalid audio format' },
        { status: 400 }
      )
    }

    // Save audio file
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadResult = await saveFile(buffer, audioFile.name, audioFile.type)

    // Transcribe audio using Whisper
    const transcript = await transcribeAudio(audioFile)

    // Extract structured data from transcript
    const reportData = await extractDailyReport(transcript)

    // Create daily report
    const dailyReport = await prisma.dailyReport.create({
      data: {
        accountId: auth.user.accountId,
        projectId,
        reportDate: new Date(reportData.date),
        weatherAM: reportData.weatherAM,
        weatherPM: reportData.weatherPM,
        temperature: reportData.temperature,
        workPerformed: reportData.workPerformed,
        laborSummary: reportData.laborSummary as any,
        equipmentUsed: reportData.equipmentUsed,
        deliveries: reportData.deliveries,
        delays: reportData.delays,
        safetyIssues: reportData.safetyIssues,
        voiceRecorded: true,
        transcriptId: uploadResult.storagePath,
        createdById: auth.user.userId,
        files: {
          create: {
            accountId: auth.user.accountId,
            projectId,
            fileName: uploadResult.fileName,
            fileType: uploadResult.fileType,
            mimeType: uploadResult.mimeType,
            fileSize: uploadResult.fileSize,
            storagePath: uploadResult.storagePath,
            storageUrl: uploadResult.storageUrl,
            linkedEntityType: 'daily_report',
          },
        },
      },
      include: {
        project: true,
        createdBy: true,
      },
    })

    return NextResponse.json({
      message: 'Daily report created from voice recording',
      dailyReport,
      transcript,
    })
  } catch (error: any) {
    console.error('Voice daily report error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
