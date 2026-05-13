// ══════════════════════════════════════════════════════
//  Body Analytics — Health Calculations
// ══════════════════════════════════════════════════════

export interface MeasurementInput {
  neck:       number
  chest:      number
  waist:      number
  hips:       number
  rightArm:   number
  leftArm:    number
  rightThigh: number
  leftThigh:  number
  rightCalf:  number
  leftCalf:   number
}

export interface ProfileInput {
  gender:    'male' | 'female'
  heightCm:  number
  weightKg:  number
}

export interface CalculatedMetrics {
  bmi:            number
  bmiCategory:    string
  bmiColor:       string
  bodyFatPct:     number
  leanMassKg:     number
  fatMassKg:      number
  whr:            number
  whrStatus:      string
  whrColor:       string
  whRatio:        number
  bodyShape:      string
  bodyShapeDesc:  string
  symmetryScore:  number
  idealWeightLow: number
  idealWeightHigh:number
  fatToLoseKg:    number
  // Month 2 targets
  targetWeightKg: number
  targetWaistIn:  number
  targetBodyFat:  number
  targetBmi:      number
  targetWhr:      number
  // Roadmap
  roadmap:        RoadmapPoint[]
}

export interface RoadmapPoint {
  month:     number
  label:     string
  weightKg:  number
  isNow:     boolean
}

export function calculateMetrics(
  profile: ProfileInput,
  m: MeasurementInput
): CalculatedMetrics {
  const { gender, heightCm, weightKg } = profile
  const heightM = heightCm / 100

  // ── BMI ──────────────────────────────────────────────
  const bmi = weightKg / (heightM * heightM)
  let bmiCategory: string
  let bmiColor: string
  if      (bmi < 18.5) { bmiCategory = 'Underweight';    bmiColor = '#1868b0' }
  else if (bmi < 25.0) { bmiCategory = 'Normal';         bmiColor = '#2a9040' }
  else if (bmi < 30.0) { bmiCategory = 'Overweight';     bmiColor = '#d4a020' }
  else if (bmi < 35.0) { bmiCategory = 'Obese Class I';  bmiColor = '#d63a1a' }
  else                  { bmiCategory = 'Obese Class II+';bmiColor = '#d63a1a' }

  // ── Body Fat % (Navy Circumference Method) ────────────
  // Convert measurements to cm
  const waistCm  = m.waist  * 2.54
  const neckCm   = m.neck   * 2.54
  const hipsCm   = m.hips   * 2.54

  let bodyFatPct: number
  if (gender === 'male') {
    bodyFatPct = 86.010 * Math.log10(waistCm - neckCm)
                - 70.041 * Math.log10(heightCm)
                + 36.76
  } else {
    bodyFatPct = 163.205 * Math.log10(waistCm + hipsCm - neckCm)
                - 97.684 * Math.log10(heightCm)
                - 78.387
  }
  bodyFatPct = Math.max(5, Math.min(50, bodyFatPct))

  const leanMassKg = weightKg * (1 - bodyFatPct / 100)
  const fatMassKg  = weightKg * (bodyFatPct / 100)

  // ── Ratios ────────────────────────────────────────────
  const whr    = m.waist / m.hips
  const whRatio = (m.waist * 2.54) / heightCm

  const whrThreshold = gender === 'male' ? 0.90 : 0.85
  let whrStatus: string
  let whrColor: string
  if      (whr > whrThreshold)      { whrStatus = 'High Risk';  whrColor = '#d63a1a' }
  else if (whr > whrThreshold - 0.05){ whrStatus = 'Moderate';  whrColor = '#d4a020' }
  else                               { whrStatus = 'Healthy ✓'; whrColor = '#2a9040' }

  // ── Body Shape ────────────────────────────────────────
  const cwr = m.chest / m.waist
  let bodyShape: string
  let bodyShapeDesc: string
  if      (cwr > 1.15 && whr < 0.85)             { bodyShape = 'Trapezoid / V-Taper'; bodyShapeDesc = 'Athletic V-shape. Chest significantly wider than waist. Classic athletic build.' }
  else if (whr > 0.88  && bmi > 27)              { bodyShape = 'Oval / Round';        bodyShapeDesc = 'Midsection dominant. Abdominal fat is the top priority to reduce.' }
  else if (Math.abs(m.chest - m.hips) < 3 && whr < 0.88) { bodyShape = 'Rectangle / Athletic'; bodyShapeDesc = 'Balanced proportions across chest, waist, and hips. Solid symmetry base.' }
  else if (m.hips > m.chest + 2)                 { bodyShape = 'Pear / Triangle';     bodyShapeDesc = 'Lower body dominant. Upper body strength training recommended.' }
  else                                            { bodyShape = 'Inverted Triangle';   bodyShapeDesc = 'Broad chest relative to hips. Classic swimmer build.' }

  // ── Symmetry ──────────────────────────────────────────
  const thighDiff  = Math.abs(m.rightThigh - m.leftThigh)
  const armDiff    = Math.abs(m.rightArm   - m.leftArm)
  const symmetryScore = Math.max(70, 100 - (thighDiff * 4 + armDiff * 2))

  // ── Ideal Weight ──────────────────────────────────────
  const idealWeightLow  = 21 * heightM * heightM
  const idealWeightHigh = 23 * heightM * heightM
  const fatToLoseKg     = Math.max(0, weightKg - idealWeightHigh)

  // ── Month 2 Targets ───────────────────────────────────
  const targetWeightKg = Math.max(weightKg - 3.5, idealWeightLow)
  const targetWaistIn  = Math.max(m.waist - 1.5, 28)
  const targetBodyFat  = Math.max(bodyFatPct - 2, 10)
  const targetBmi      = targetWeightKg / (heightM * heightM)
  const targetWhr      = Math.max(whr - 0.03, 0.80)

  // ── 6-Month Roadmap ───────────────────────────────────
  const roadmap: RoadmapPoint[] = []
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const now = new Date()
  let rw = weightKg
  for (let i = 0; i <= 6; i++) {
    const d = new Date(now)
    d.setMonth(d.getMonth() + i)
    const loss = i === 0 ? 0 : i <= 4 ? 3.5 : 3.0
    rw = i === 0 ? weightKg : Math.max(rw - loss, idealWeightLow)
    roadmap.push({
      month:    i + 1,
      label:    `M${i + 1} · ${monthNames[d.getMonth()]}`,
      weightKg: Math.round(rw * 10) / 10,
      isNow:    i === 0,
    })
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmiColor,
    bodyFatPct: Math.round(bodyFatPct * 10) / 10,
    leanMassKg: Math.round(leanMassKg * 10) / 10,
    fatMassKg:  Math.round(fatMassKg  * 10) / 10,
    whr:        Math.round(whr  * 100) / 100,
    whrStatus,
    whrColor,
    whRatio:    Math.round(whRatio * 100) / 100,
    bodyShape,
    bodyShapeDesc,
    symmetryScore: Math.round(symmetryScore),
    idealWeightLow:  Math.round(idealWeightLow  * 10) / 10,
    idealWeightHigh: Math.round(idealWeightHigh * 10) / 10,
    fatToLoseKg:     Math.round(fatToLoseKg     * 10) / 10,
    targetWeightKg:  Math.round(targetWeightKg  * 10) / 10,
    targetWaistIn:   Math.round(targetWaistIn   * 10) / 10,
    targetBodyFat:   Math.round(targetBodyFat   * 10) / 10,
    targetBmi:       Math.round(targetBmi       * 10) / 10,
    targetWhr:       Math.round(targetWhr       * 100) / 100,
    roadmap,
  }
}
