// ── Form submission shape ─────────────────────────────
export interface FormData {
  // Step 1 — Identity
  name:       string
  email:      string
  country:    string
  phone:      string
  whatsapp:   boolean
  viber:      boolean
  noApp:      boolean
  gender:     'male' | 'female'
  heightUnit: 'imperial' | 'cm'
  feet?:      number
  inches?:    number
  heightCm?:  number
  weightKg:   number
  measUnit:   'inches' | 'cm'
  date:       string
  time:       string
  // Step 2 — Measurements
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

// ── Countries config ──────────────────────────────────
export const COUNTRIES = [
  { code: 'MV', name: 'Maldives',    dial: '+960', flag: '🇲🇻', placeholder: '7XX XXXX'       },
  { code: 'IN', name: 'India',       dial: '+91',  flag: '🇮🇳', placeholder: 'XXXXX XXXXX'    },
  { code: 'ID', name: 'Indonesia',   dial: '+62',  flag: '🇮🇩', placeholder: '0XXX XXXX XXXX' },
  { code: 'NP', name: 'Nepal',       dial: '+977', flag: '🇳🇵', placeholder: '98XX XXX XXX'   },
  { code: 'BD', name: 'Bangladesh',  dial: '+880', flag: '🇧🇩', placeholder: '01XXX XXXXXX'   },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']

// ── API response ──────────────────────────────────────
export interface SubmitResponse {
  success:   boolean
  profileId: string
  dashUrl:   string
  message:   string
}
