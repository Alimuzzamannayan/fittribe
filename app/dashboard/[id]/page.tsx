import { notFound }        from 'next/navigation'
import { db }               from '@/lib/db'
import { calculateMetrics } from '@/lib/calculations'
import { nextMeasurementDate, formatDate, formatTime } from '@/lib/utils'
import DashboardClient      from '@/components/dashboard/DashboardClient'

interface Props { params: { id: string } }

export default async function DashboardPage({ params }: Props) {
  const profile = await db.profile.findUnique({
    where:   { id: params.id },
    include: {
      measurements: { orderBy: { monthNumber: 'asc' } },
      metrics:      { take: 1, orderBy: { createdAt: 'desc' } },
    },
  })

  if (!profile || !profile.measurements[0] || !profile.metrics[0]) {
    notFound()
  }

  const m1  = profile.measurements[0]
  const met = profile.metrics[0]

  // Recalculate roadmap (not stored, derived)
  const calc = calculateMetrics(
    { gender: profile.gender as 'male'|'female', heightCm: profile.heightCm, weightKg: profile.weightKg },
    {
      neck:       m1.neck,       chest:      m1.chest,
      waist:      m1.waist,      hips:       m1.hips,
      rightArm:   m1.rightArm,   leftArm:    m1.leftArm,
      rightThigh: m1.rightThigh, leftThigh:  m1.leftThigh,
      rightCalf:  m1.rightCalf,  leftCalf:   m1.leftCalf,
    }
  )

  const nextDate = nextMeasurementDate(profile.recordedAt)

  return (
    <DashboardClient
      profile={{
        id:        profile.id,
        name:      profile.name,
        email:     profile.email,
        country:   profile.country,
        phone:     profile.phone,
        whatsapp:  profile.whatsapp,
        viber:     profile.viber,
        gender:    profile.gender,
        heightCm:  profile.heightCm,
        weightKg:  profile.weightKg,
        recordedAt: profile.recordedAt.toISOString(),
      }}
      measurements={{
        neck:       m1.neck,       chest:      m1.chest,
        waist:      m1.waist,      hips:       m1.hips,
        rightArm:   m1.rightArm,   leftArm:    m1.leftArm,
        rightThigh: m1.rightThigh, leftThigh:  m1.leftThigh,
        rightCalf:  m1.rightCalf,  leftCalf:   m1.leftCalf,
      }}
      metrics={{
        bmi:              met.bmi,
        bmiCategory:      met.bmiCategory,
        bmiColor:         calc.bmiColor,
        bodyFatPct:       met.bodyFatPct,
        leanMassKg:       met.leanMassKg,
        fatMassKg:        met.fatMassKg,
        whr:              met.whr,
        whrStatus:        calc.whrStatus,
        whrColor:         calc.whrColor,
        whRatio:          met.whRatio,
        bodyShape:        met.bodyShape,
        bodyShapeDesc:    calc.bodyShapeDesc,
        symmetryScore:    met.symmetryScore,
        idealWeightLow:   met.idealWeightLow,
        idealWeightHigh:  met.idealWeightHigh,
        fatToLoseKg:      met.fatToLoseKg,
        targetWeightKg:   met.targetWeightKg,
        targetWaistIn:    met.targetWaistIn,
        targetBodyFat:    met.targetBodyFat,
        targetBmi:        met.targetBmi,
        targetWhr:        met.targetWhr,
        roadmap:          calc.roadmap,
      }}
      recordedDateStr={formatDate(profile.recordedAt)}
      recordedTimeStr={formatTime(profile.recordedAt)}
      nextDateStr={formatDate(nextDate)}
      nextDateISO={nextDate.toISOString()}
    />
  )
}
