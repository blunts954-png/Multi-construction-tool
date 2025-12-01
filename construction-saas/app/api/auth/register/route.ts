/**
 * POST /api/auth/register
 * Register a new user and create their account
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      firstName,
      lastName,
      companyName,
      phoneNumber,
    } = body

    // Validation
    if (!email || !password || !firstName || !lastName || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create account and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create account (company)
      const account = await tx.account.create({
        data: {
          companyName,
          planType: 'trial',
          status: 'active',
        },
      })

      // Create user (account owner)
      const user = await tx.user.create({
        data: {
          accountId: account.id,
          email,
          passwordHash,
          firstName,
          lastName,
          role: 'owner', // First user is always the owner
          phoneNumber,
          isActive: true,
        },
      })

      return { account, user }
    })

    // Generate JWT token
    const token = generateToken({
      userId: result.user.id,
      accountId: result.account.id,
      email: result.user.email,
      role: result.user.role,
    })

    return NextResponse.json({
      message: 'Account created successfully',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
      account: {
        id: result.account.id,
        companyName: result.account.companyName,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
