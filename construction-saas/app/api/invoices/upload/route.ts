/**
 * POST /api/invoices/upload
 * Upload invoice PDF/image and extract data using AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { saveFile, fileToBase64 } from '@/lib/storage'
import { performOCR, extractInvoiceData } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  // Authenticate user
  const auth = await requireAuth(request)
  if (!auth.user) return auth.response

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and images are allowed.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file to storage
    const uploadResult = await saveFile(buffer, file.name, file.type)

    // Create AI event for tracking
    const aiEvent = await prisma.aIEvent.create({
      data: {
        accountId: auth.user.accountId,
        eventType: 'invoice_upload',
        status: 'processing',
        rawInput: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          projectId: projectId || null,
        },
      },
    })

    // Perform OCR if image
    let ocrText = ''
    if (file.type.startsWith('image/')) {
      const base64 = await fileToBase64(uploadResult.storagePath)
      ocrText = await performOCR(base64)
    } else {
      // For PDF, we would need a PDF parser
      // For now, return error - implement PDF parsing later
      return NextResponse.json(
        {
          error:
            'PDF parsing not yet implemented. Please upload invoice as image.',
        },
        { status: 400 }
      )
    }

    // Extract invoice data using AI
    const extractedData = await extractInvoiceData(ocrText)

    // Find vendor by name or create suggestion
    let vendorId: string | null = null
    if (extractedData.vendor) {
      const vendor = await prisma.contact.findFirst({
        where: {
          accountId: auth.user.accountId,
          type: 'vendor',
          companyName: {
            contains: extractedData.vendor,
            mode: 'insensitive',
          },
        },
      })
      vendorId = vendor?.id || null
    }

    // Create invoice draft
    const invoice = await prisma.invoice.create({
      data: {
        accountId: auth.user.accountId,
        projectId: projectId || '', // Will need to be selected by user
        vendorId,
        invoiceNumber: extractedData.invoiceNumber,
        invoiceDate: extractedData.invoiceDate
          ? new Date(extractedData.invoiceDate)
          : null,
        dueDate: extractedData.dueDate
          ? new Date(extractedData.dueDate)
          : null,
        subtotal: extractedData.subtotal,
        tax: extractedData.tax,
        total: extractedData.total,
        status: 'pending',
        category: extractedData.suggestedCategory || null,
        aiExtracted: true,
        aiConfidence: extractedData.confidence,
        rawExtraction: extractedData as any,
        lineItems: {
          create: extractedData.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            category: item.category,
          })),
        },
        files: {
          create: {
            accountId: auth.user.accountId,
            projectId: projectId || null,
            fileName: uploadResult.fileName,
            fileType: uploadResult.fileType,
            mimeType: uploadResult.mimeType,
            fileSize: uploadResult.fileSize,
            storagePath: uploadResult.storagePath,
            storageUrl: uploadResult.storageUrl,
            linkedEntityType: 'invoice',
          },
        },
      },
      include: {
        lineItems: true,
        vendor: true,
        project: true,
      },
    })

    // Update AI event
    await prisma.aIEvent.update({
      where: { id: aiEvent.id },
      data: {
        status: 'completed',
        aiProvider: 'openai',
        aiModel: 'gpt-4o-mini',
        aiResponse: extractedData as any,
        aiConfidence: extractedData.confidence,
        createdEntityType: 'invoice',
        createdEntityId: invoice.id,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Invoice uploaded and processed successfully',
      invoice,
      extractedData,
      needsReview: extractedData.confidence < 0.85,
    })
  } catch (error: any) {
    console.error('Invoice upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
