import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await db.profile.findUnique({
      where: { id: params.id },
      include: {
        measurements: { orderBy: { monthNumber: 'asc' } },
        metrics:      { take: 1, orderBy: { createdAt: 'desc' } },
        reports:      { take: 1, orderBy: { createdAt: 'desc' } },
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (err) {
    console.error('Dashboard fetch error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
