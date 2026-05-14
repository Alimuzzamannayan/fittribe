import { NextRequest, NextResponse } from 'next/server'
import { db }               from '@/lib/db'
import { calculateMetrics } from '@/lib/calculations'
// import { sendReportEmail }  from '@/lib/email'  // email disabled temporarily
import { COUNTRIES }        from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ── Resolve height to cm ───────────────────────────
    let heightCm: number
    if (body.heightUnit === 'imperial') {
      heightCm = (parseInt(body.feet || 0) * 30.48) + (parseInt(body.inches || 0) * 2.54)
    } else {
      heightCm = parseFloat(body.heightCm)
    }

    // ── Convert measurements to inches if needed ───────
    const toIn = (v: number) => body.measUnit === 'cm' ? v / 2.54 : v
    const m = {
      neck:       toIn(body.neck),
      chest:      toIn(body.chest),
      waist:      toIn(body.waist),
      hips:       toIn(body.hips),
      rightArm:   toIn(body.rightArm),
      leftArm:    toIn(body.leftArm),
      rightThigh: toIn(body.rightThigh),
      leftThigh:  toIn(body.leftThigh),
      rightCalf:  toIn(body.rightCalf),
      leftCalf:   toIn(body.leftCalf),
    }

    const weightKg = parseFloat(body.weightKg)

    // ── Calculate all metrics ──────────────────────────
    const metrics = calculateMetrics(
      { gender: body.gender, heightCm, weightKg },
      m
    )

    // ── Resolve dial code + full phone ─────────────────
    const country = COUNTRIES.find(c => c.code === body.country) || COUNTRIES[0]
    const fullPhone = `${country.dial} ${body.phone}`

    // ── Parse recorded date/time ───────────────────────
    const recordedAt = new Date(`${body.date}T${body.time}:00`)

    // ── Save to PostgreSQL ─────────────────────────────
    const profile = await db.profile.create({
      data: {
        name:     body.name,
        email:    body.email,
        country:  country.name,
        phone:    fullPhone,
        whatsapp: body.whatsapp === true || body.whatsapp === 'true',
        viber:    body.viber    === true || body.viber    === 'true',
        gender:   body.gender,
        heightCm,
        weightKg,
        recordedAt,
        measurements: {
          create: {
            monthNumber: 1,
            neck:        m.neck,
            chest:       m.chest,
            waist:       m.waist,
            hips:        m.hips,
            rightArm:    m.rightArm,
            leftArm:     m.leftArm,
            rightThigh:  m.rightThigh,
            leftThigh:   m.leftThigh,
            rightCalf:   m.rightCalf,
            leftCalf:    m.leftCalf,
          },
        },
        metrics: {
          create: {
            bmi:              metrics.bmi,
            bmiCategory:      metrics.bmiCategory,
            bodyFatPct:       metrics.bodyFatPct,
            leanMassKg:       metrics.leanMassKg,
            fatMassKg:        metrics.fatMassKg,
            whr:              metrics.whr,
            whRatio:          metrics.whRatio,
            bodyShape:        metrics.bodyShape,
            symmetryScore:    metrics.symmetryScore,
            targetWeightKg:   metrics.targetWeightKg,
            targetWaistIn:    metrics.targetWaistIn,
            targetBodyFat:    metrics.targetBodyFat,
            targetBmi:        metrics.targetBmi,
            targetWhr:        metrics.targetWhr,
            fatToLoseKg:      metrics.fatToLoseKg,
            idealWeightLow:   metrics.idealWeightLow,
            idealWeightHigh:  metrics.idealWeightHigh,
          },
        },
        reports: {
          create: {
            emailStatus: 'pending',
          },
        },
      },
    })

    // ── Build dashboard URL ────────────────────────────
    const appUrl  = process.env.APP_URL || `https://${req.headers.get('host')}`
    const dashUrl = `${appUrl}/dashboard/${profile.id}`

    // Email sending disabled — re-enable once SMTP env vars are configured
    // sendReportEmail({ ... })

    return NextResponse.json({
      success:   true,
      profileId: profile.id,
      dashUrl,
      message:   'Dashboard created.',
    })

  } catch (err: any) {
    console.error('Submit error:', err)
    const isDatabaseError = err?.message?.includes('prisma') ||
                            err?.message?.includes('connect') ||
                            err?.code === 'P1001' || err?.code === 'P1003'
    return NextResponse.json(
      {
        success: false,
        message: isDatabaseError
          ? 'Database not configured. Please add DATABASE_URL to your environment variables.'
          : 'Something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}
