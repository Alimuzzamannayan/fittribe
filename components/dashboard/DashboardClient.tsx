'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import type { CalculatedMetrics }      from '@/lib/calculations'
import type { MeasurementInput }       from '@/lib/calculations'
import { countdown }                   from '@/lib/utils'

interface Props {
  profile: {
    id: string; name: string; email: string; country: string
    phone: string; whatsapp: boolean; viber: boolean
    gender: string; heightCm: number; weightKg: number
    recordedAt: string
  }
  measurements:      MeasurementInput
  metrics:           CalculatedMetrics & { bmiColor: string; whrStatus: string; whrColor: string; bodyShapeDesc: string }
  recordedDateStr:   string
  recordedTimeStr:   string
  nextDateStr:       string
  nextDateISO:       string
}

export default function DashboardClient({
  profile, measurements, metrics,
  recordedDateStr, recordedTimeStr, nextDateStr, nextDateISO,
}: Props) {
  const params   = useSearchParams()
  const isNew    = params.get('new') === '1'

  // Countdown
  const [cd, setCd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const target = new Date(nextDateISO)
    const tick   = () => setCd(countdown(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextDateISO])

  const nameParts = profile.name.split(' ')
  const firstName = nameParts[0]
  const lastName  = nameParts.slice(1).join(' ')

  // Height display
  const totalIn = profile.heightCm / 2.54
  const ft      = Math.floor(totalIn / 12)
  const inR     = Math.round(totalIn % 12)
  const heightDisp = `${ft}′${inR}″ / ${profile.heightCm.toFixed(1)} cm`

  const MAX_MEAS = Math.max(measurements.chest, measurements.hips) * 1.12

  const measRows = [
    { n: 'Neck',         k: 'neck',       c: measurements.neck,       t: measurements.neck * 0.98,   col: '#1868b0' },
    { n: 'Chest',        k: 'chest',      c: measurements.chest,      t: measurements.chest * 1.01,  col: '#0a7868' },
    { n: 'Right Arm',    k: 'rightArm',   c: measurements.rightArm,   t: measurements.rightArm * 1.03,  col: '#0a7868' },
    { n: 'Left Arm',     k: 'leftArm',    c: measurements.leftArm,    t: measurements.leftArm * 1.03,   col: '#0a7868' },
    { n: 'Waist',        k: 'waist',      c: measurements.waist,      t: metrics.targetWaistIn,      col: '#d63a1a' },
    { n: 'Hips',         k: 'hips',       c: measurements.hips,       t: measurements.hips * 0.99,   col: '#e87a20' },
    { n: 'Right Thigh',  k: 'rightThigh', c: measurements.rightThigh, t: measurements.rightThigh * 0.99, col: '#9050cc' },
    { n: 'Left Thigh',   k: 'leftThigh',  c: measurements.leftThigh,  t: measurements.leftThigh * 1.03,  col: '#9050cc' },
    { n: 'Right Calf',   k: 'rightCalf',  c: measurements.rightCalf,  t: measurements.rightCalf * 1.01,  col: '#e87a20' },
    { n: 'Left Calf',    k: 'leftCalf',   c: measurements.leftCalf,   t: measurements.leftCalf * 1.01,   col: '#e87a20' },
  ]

  const goals = [
    { n: 'Weight',   c: `${profile.weightKg} kg`, t: `${metrics.targetWeightKg} kg`, d: `−${(profile.weightKg - metrics.targetWeightKg).toFixed(1)} kg` },
    { n: 'Waist',    c: `${measurements.waist.toFixed(1)}″`, t: `${metrics.targetWaistIn.toFixed(1)}″`, d: `−${(measurements.waist - metrics.targetWaistIn).toFixed(1)}″` },
    { n: 'Body Fat', c: `${metrics.bodyFatPct}%`,  t: `${metrics.targetBodyFat.toFixed(1)}%`,  d: `−${(metrics.bodyFatPct - metrics.targetBodyFat).toFixed(1)}%` },
    { n: 'BMI',      c: `${metrics.bmi}`,           t: `${metrics.targetBmi.toFixed(1)}`,        d: `−${(metrics.bmi - metrics.targetBmi).toFixed(1)}` },
    { n: 'WHR',      c: `${metrics.whr}`,            t: `${metrics.targetWhr.toFixed(2)}`,        d: `−${(metrics.whr - metrics.targetWhr).toFixed(2)}` },
  ]

  const bmiPct = Math.min(100, Math.max(0, (metrics.bmi - 15) / 25 * 100))

  return (
    <main className="min-h-screen texture-bg">

      {/* ── Success banner ── */}
      {isNew && (
        <div className="bg-brand-green text-white text-center py-3 px-4 text-sm font-semibold animate-fade-in">
          ✅ Dashboard created! PDF report emailed to {profile.email}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── HEADER ── */}
        <div className="flex flex-wrap gap-6 justify-between items-start mb-10 animate-fade-up">
          <div>
            <p className="text-[10px] font-oswald font-medium tracking-[0.32em] uppercase text-brand-red mb-2">
              Athlete Profile · Month 1 Baseline
            </p>
            <h1 className="font-oswald font-bold uppercase leading-none text-5xl md:text-7xl text-ink">
              {firstName}<br />
              <span className="text-brand-red">{lastName}</span>
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                `Height: ${heightDisp}`,
                `Weight: ${profile.weightKg} kg`,
                profile.gender === 'male' ? '♂ Male' : '♀ Female',
                metrics.bodyShape.split('/')[0].trim(),
              ].map(pill => (
                <span key={pill} className="bg-paper border border-border2 rounded-full px-4 py-1.5 text-xs font-bold text-ink2">
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Session box */}
          <div className="bg-paper border border-border rounded-2xl p-5 card-shadow min-w-[260px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-gold" />
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted mb-1">Month 1 — Recorded</p>
            <p className="text-sm font-semibold text-ink2">{recordedDateStr}</p>
            <p className="font-oswald font-bold text-3xl text-brand-red mt-0.5">{recordedTimeStr}</p>

            <div className="h-px bg-border my-3" />

            {/* Contact */}
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted mb-1.5">Contact</p>
            <p className="text-sm font-bold text-ink2 mb-1.5">{profile.phone}</p>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {profile.whatsapp && (
                <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                  💬 WhatsApp
                </span>
              )}
              {profile.viber && (
                <span className="bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                  📲 Viber
                </span>
              )}
              {!profile.whatsapp && !profile.viber && (
                <span className="bg-cream text-muted border border-border2 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                  📵 SMS Only
                </span>
              )}
            </div>

            <div className="h-px bg-border mb-3" />

            {/* Countdown */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-green pulse-green inline-block" />
              Next Measurement
            </div>
            <p className="text-[11px] font-semibold text-ink2 mb-2">{nextDateStr}</p>
            <div className="grid grid-cols-4 gap-1">
              {[
                { v: cd.days,    l: 'Days' },
                { v: cd.hours,   l: 'Hrs'  },
                { v: cd.minutes, l: 'Min'  },
                { v: cd.seconds, l: 'Sec'  },
              ].map((u, i) => (
                <div key={u.l} className={`text-center rounded-lg py-2 text-white ${
                  i===0?'bg-brand-red':i===1?'bg-brand-orange':i===2?'bg-brand-gold':  'bg-brand-teal'
                }`}>
                  <div className="font-oswald font-bold text-xl leading-none">
                    {String(u.v).padStart(2,'0')}
                  </div>
                  <div className="text-[9px] tracking-wider uppercase opacity-70 mt-0.5">{u.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <p className="text-[10px] font-oswald font-medium tracking-[0.28em] uppercase text-muted mb-4 flex items-center gap-3 after:flex-1 after:h-px after:bg-border">
          Core Health Metrics
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay:'0.08s' }}>
          {[
            { icon:'⚖️', label:'BMI',           value: metrics.bmi,         unit:'kg/m²', sub: metrics.bmiCategory, color: metrics.bmiColor,  isBmi: true },
            { icon:'🔥', label:'Body Fat',       value: metrics.bodyFatPct,  unit:'%',     sub:'Navy Method',         color:'#e87a20' },
            { icon:'💪', label:'Lean Mass',      value: metrics.leanMassKg,  unit:'kg',    sub:'Solid base ✓',        color:'#2a9040' },
            { icon:'🎯', label:'Fat to Lose',    value:`~${metrics.fatToLoseKg}`, unit:'kg', sub:`Ideal: ${metrics.idealWeightLow.toFixed(0)}–${metrics.idealWeightHigh.toFixed(0)} kg`, color:'#1868b0' },
          ].map(card => (
            <div key={card.label} className="bg-paper border border-border rounded-2xl p-5 card-shadow relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: card.color }} />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to top, ${card.color}08, transparent)` }} />
              <span className="text-2xl block mb-2">{card.icon}</span>
              <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-muted mb-1">{card.label}</p>
              <p className="font-oswald font-bold text-4xl leading-none" style={{ color: card.color }}>
                {card.value}<span className="text-base font-medium ml-0.5">{card.unit}</span>
              </p>
              {card.isBmi && (
                <div className="mt-2 h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ink border-2 border-white shadow transition-all duration-1000"
                    style={{ left: `calc(${bmiPct}% - 6px)` }}
                  />
                </div>
              )}
              <p className="text-[10px] text-muted mt-2 font-medium">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── MID 3-COL ── */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_256px] gap-4 mb-8 animate-fade-up" style={{ animationDelay:'0.14s' }}>

          {/* Body shape */}
          <div className="bg-paper border border-border rounded-2xl p-5 card-shadow">
            <p className="text-[10px] font-oswald font-medium tracking-[0.28em] uppercase text-muted mb-3 flex items-center gap-2 after:flex-1 after:h-px after:bg-border">
              Body Shape
            </p>
            <span className="inline-block bg-[rgba(232,122,32,0.1)] text-brand-orange border border-[rgba(232,122,32,0.25)] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-2">
              {metrics.bodyShape.split('/')[0].trim()}
            </span>
            <h3 className="font-oswald font-bold text-lg text-ink mb-2">{metrics.bodyShape}</h3>
            <p className="text-[11px] text-muted leading-relaxed mb-4">{metrics.bodyShapeDesc}</p>

            {/* Simple SVG silhouette */}
            <svg viewBox="0 0 160 380" className="w-full max-w-[160px] mx-auto block mb-3">
              <defs>
                <linearGradient id="sg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f0d8c0"/>
                  <stop offset="100%" stopColor="#dfc0a0"/>
                </linearGradient>
              </defs>
              <ellipse cx="80" cy="28" rx="18" ry="21" fill="url(#sg)" stroke="#d0b090" strokeWidth="1.2"/>
              <rect x="72" y="46" width="16" height="12" rx="3" fill="url(#sg)" stroke="#d0b090" strokeWidth="1"/>
              <path d="M42 58 C36 75 32 100 32 126 C32 145 37 158 44 168 L116 168 C123 158 128 145 128 126 C128 100 124 75 118 58Z"
                fill="url(#sg)" stroke="#d0b090" strokeWidth="1.2"/>
              {metrics.whr > 0.88 && (
                <ellipse cx="80" cy="122" rx="30" ry="24" fill="rgba(214,58,26,0.06)" stroke="rgba(214,58,26,0.2)" strokeWidth="1" strokeDasharray="4,2"/>
              )}
              <path d="M44 168 C37 179 35 196 37 212 L123 212 C125 196 123 179 116 168Z" fill="url(#sg)" stroke="#d0b090" strokeWidth="1.2"/>
              <path d="M42 58 C30 72 26 104 27 133 C28 149 32 162 38 168 C43 171 48 168 50 165 C44 152 42 136 43 116 C44 93 49 75 57 61Z" fill="url(#sg)" stroke="#d0b090" strokeWidth="1"/>
              <path d="M118 58 C130 72 134 104 133 133 C132 149 128 162 122 168 C117 171 112 168 110 165 C116 152 118 136 117 116 C116 93 111 75 103 61Z" fill="url(#sg)" stroke="#d0b090" strokeWidth="1"/>
              <path d="M50 212 C44 236 42 261 44 283 C45 297 50 306 57 309 L78 309 C83 306 86 297 87 283 C89 261 88 236 84 212Z" fill="url(#sg)" stroke="#d0b090" strokeWidth="1"/>
              <path d="M110 212 C116 236 118 261 116 283 C115 297 110 306 103 309 L82 309 C77 306 74 297 73 283 C71 261 72 236 76 212Z" fill="url(#sg)" stroke="#d0b090" strokeWidth="1"/>
              <path d="M57 309 C52 327 53 343 57 354 C60 360 65 363 70 364 L78 364 C83 363 87 359 88 352 C90 340 89 323 87 309Z" fill="url(#sg)" stroke="#d0b090" strokeWidth="1"/>
              <path d="M103 309 C108 327 107 343 103 354 C100 360 95 363 90 364 L82 364 C77 363 73 359 72 352 C70 340 71 323 73 309Z" fill="url(#sg)" stroke="#d0b090" strokeWidth="1"/>
              <ellipse cx="68" cy="366" rx="12" ry="4" fill="#d0b090"/>
              <ellipse cx="92" cy="366" rx="12" ry="4" fill="#d0b090"/>
              <line x1="64" y1="52" x2="96" y2="52" stroke="#1868b0" strokeWidth="1.2" strokeDasharray="3,2"/>
              <line x1="32" y1="93" x2="128" y2="93" stroke="#0a7868" strokeWidth="1.2" strokeDasharray="3,2"/>
              <line x1="30" y1="130" x2="130" y2="130" stroke="#d63a1a" strokeWidth="1.6" strokeDasharray="3,2"/>
              <line x1="36" y1="190" x2="124" y2="190" stroke="#e87a20" strokeWidth="1.2" strokeDasharray="3,2"/>
              <text x="133" y="55" fill="#1868b0" fontFamily="monospace" fontSize="8" fontWeight="700">{measurements.neck.toFixed(1)}″</text>
              <text x="131" y="96" fill="#0a7868" fontFamily="monospace" fontSize="8" fontWeight="700">{measurements.chest.toFixed(1)}″</text>
              <text x="133" y="133" fill="#d63a1a" fontFamily="monospace" fontSize="8.5" fontWeight="700">{measurements.waist.toFixed(1)}″</text>
              <text x="126" y="193" fill="#e87a20" fontFamily="monospace" fontSize="8" fontWeight="700">{measurements.hips.toFixed(1)}″</text>
            </svg>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-center bg-[rgba(214,58,26,0.07)] rounded-xl py-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-brand-red mb-0.5">Now</p>
                <p className="font-oswald font-bold text-base text-brand-red">
                  {metrics.bodyShape.split('/')[0].trim().split(' ')[0]}
                </p>
              </div>
              <div className="text-center bg-[rgba(42,144,64,0.08)] rounded-xl py-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-brand-green mb-0.5">Goal</p>
                <p className="font-oswald font-bold text-base text-brand-green">Trapezoid</p>
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-paper border border-border rounded-2xl p-5 card-shadow">
            <p className="text-[10px] font-oswald font-medium tracking-[0.28em] uppercase text-muted mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-border">
              Measurements — Current vs Month 2
            </p>
            <div className="flex gap-4 mb-4 flex-wrap text-[11px] font-semibold text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm bg-brand-red inline-block"/>Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm bg-green-200 inline-block"/>Month 2 Target
              </span>
              <span className="ml-auto text-muted2 text-[10px]">Scale: 0–{MAX_MEAS.toFixed(0)}″</span>
            </div>

            <div className="space-y-0.5">
              {measRows.map((row, i) => {
                const cp = (row.c / MAX_MEAS * 100).toFixed(1)
                const tp = (row.t / MAX_MEAS * 100).toFixed(1)
                const diff = (row.t - row.c).toFixed(1)
                const isWaistLike = ['waist','hips','rightThigh','leftThigh'].includes(row.k)
                const goodDelta   = isWaistLike ? +diff < 0 : +diff > 0
                const delay       = `${0.05 + i * 0.06}s`

                return (
                  <div key={row.k} className="grid grid-cols-[96px_1fr_48px_64px] items-center gap-2 py-2 border-b border-cream last:border-0">
                    <span className="text-[11px] font-bold text-ink2">{row.n}</span>
                    <div className="h-2.5 bg-cream rounded-full relative overflow-visible">
                      <div
                        className="absolute h-full rounded-full opacity-25 animate-bar"
                        style={{ width: `${tp}%`, background: '#2a9040', animationDelay: delay }}
                      />
                      <div
                        className="absolute h-full rounded-full animate-bar"
                        style={{ width: `${cp}%`, background: row.col, animationDelay: delay }}
                      >
                        <div
                          className="absolute -right-1.5 -top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ background: row.col }}
                        />
                      </div>
                    </div>
                    <span className="font-oswald font-semibold text-sm text-ink text-right">
                      {row.c.toFixed(1)}″
                    </span>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-brand-green">{row.t.toFixed(1)}″</div>
                      <div className={`text-[10px] font-bold ${goodDelta ? 'text-brand-green' : 'text-brand-gold'}`}>
                        {+diff > 0 ? '+' : ''}{diff}″
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 p-4 bg-cream rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted mb-1">Current Weight</p>
                <p className="font-oswald font-bold text-3xl text-brand-red">{profile.weightKg} kg</p>
              </div>
              <span className="text-2xl text-muted2">→</span>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted mb-1">Month 2 Target</p>
                <p className="font-oswald font-bold text-3xl text-brand-green">{metrics.targetWeightKg} kg</p>
                <p className="text-[11px] font-bold text-brand-green">−{(profile.weightKg - metrics.targetWeightKg).toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-paper border border-border rounded-2xl p-5 card-shadow">
            <p className="text-[10px] font-oswald font-medium tracking-[0.28em] uppercase text-muted mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-border">
              Month 2 Goals
            </p>

            {/* Donut */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f0ede8" strokeWidth="9"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#d63a1a" strokeWidth="9"
                    strokeLinecap="round" strokeDasharray="264"
                    strokeDashoffset={264 * (metrics.fatToLoseKg > 0 ? 0.75 : 0.25)}
                    style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-oswald font-bold text-2xl text-brand-red leading-none">25%</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted mt-0.5">to ideal</span>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(214,58,26,0.07)] rounded-xl p-3 text-center mb-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-brand-red mb-1">Total Fat to Lose</p>
              <p className="font-oswald font-bold text-3xl text-brand-red">~{metrics.fatToLoseKg} kg</p>
              <p className="text-[11px] text-muted mt-1">Lean base: {metrics.leanMassKg} kg ✓</p>
            </div>

            <div className="space-y-1 mb-4">
              {goals.map(g => (
                <div key={g.n} className="flex justify-between items-center py-1.5 border-b border-cream last:border-0 text-[12px]">
                  <span className="font-bold text-muted">{g.n}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-oswald font-bold text-brand-red">{g.c}</span>
                    <span className="text-muted2 text-[10px]">→</span>
                    <span className="font-oswald font-bold text-brand-green text-sm">{g.t}</span>
                    <span className="text-[10px] font-bold text-brand-green">{g.d}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[rgba(42,144,64,0.08)] border border-[rgba(42,144,64,0.2)] rounded-xl p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-brand-green mb-2">Priority</p>
              <div className="text-[11px] text-ink2 leading-1.8 space-y-1">
                <div>↓ Waist: <strong className="text-brand-red">{measurements.waist.toFixed(1)}″</strong> → <strong className="text-brand-green">{metrics.targetWaistIn.toFixed(1)}″</strong></div>
                <div>↓ WHR: <strong className="text-brand-red">{metrics.whr}</strong> → <strong className="text-brand-green">{metrics.targetWhr.toFixed(2)}</strong></div>
                <div>↓ BMI: <strong className="text-brand-red">{metrics.bmi}</strong> → <strong className="text-brand-green">{metrics.targetBmi.toFixed(1)}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RATIO CARDS ── */}
        <p className="text-[10px] font-oswald font-medium tracking-[0.28em] uppercase text-muted mb-4 flex items-center gap-3 after:flex-1 after:h-px after:bg-border">
          Proportional Health Ratios
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay:'0.2s' }}>
          {[
            { label:'BMI',             val: metrics.bmi,             color: metrics.bmiColor, status: metrics.bmiCategory,   note:'Target: <25 Normal' },
            { label:'Waist–Hip Ratio', val: metrics.whr,             color: metrics.whrColor, status: metrics.whrStatus,     note:'Male ideal: <0.90' },
            { label:'Waist–Height',    val: metrics.whRatio,         color: metrics.whRatio < 0.5 ? '#2a9040' : '#d63a1a', status: metrics.whRatio < 0.5 ? 'Healthy ✓' : 'At Risk', note:'Keep below 0.50' },
            { label:'Symmetry Score',  val: `${metrics.symmetryScore}%`, color:'#0a7868', status: metrics.symmetryScore > 90 ? 'Excellent' : 'Good', note:`Thigh gap: ${Math.abs(measurements.rightThigh - measurements.leftThigh).toFixed(1)}″` },
          ].map(card => (
            <div key={card.label} className="bg-paper border border-border rounded-2xl p-4 card-shadow text-center hover:-translate-y-1 transition-transform">
              <p className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted mb-3">{card.label}</p>
              <svg className="block mx-auto mb-1" width="100" height="52" viewBox="0 0 100 52">
                <defs>
                  <linearGradient id={`ag${card.label}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2a9040"/>
                    <stop offset="50%" stopColor="#d4a020"/>
                    <stop offset="100%" stopColor="#d63a1a"/>
                  </linearGradient>
                </defs>
                <path d="M10 48 A40 40 0 0 1 90 48" fill="none" stroke="#f0ede8" strokeWidth="9" strokeLinecap="round"/>
                <path d="M10 48 A40 40 0 0 1 90 48" fill="none" stroke={card.color} strokeWidth="9" strokeLinecap="round"
                  strokeDasharray="126" strokeDashoffset="36"/>
              </svg>
              <p className="font-oswald font-bold text-3xl leading-none" style={{ color: card.color }}>{card.val}</p>
              <p className="text-[11px] font-bold mt-1" style={{ color: card.color }}>{card.status}</p>
              <p className="text-[10px] text-muted mt-1">{card.note}</p>
            </div>
          ))}
        </div>

        {/* ── ROADMAP ── */}
        <p className="text-[10px] font-oswald font-medium tracking-[0.28em] uppercase text-muted mb-4 flex items-center gap-3 after:flex-1 after:h-px after:bg-border">
          6-Month Weight Roadmap
        </p>
        <div className="bg-paper border border-border rounded-2xl p-6 mb-8 card-shadow animate-fade-up" style={{ animationDelay:'0.26s' }}>
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted mb-1">Starting</p>
              <p className="font-oswald font-bold text-xl text-brand-red">{profile.weightKg} kg</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted mb-1">Ideal Target</p>
              <p className="font-oswald font-bold text-xl text-brand-green">{metrics.idealWeightLow.toFixed(0)}–{metrics.idealWeightHigh.toFixed(0)} kg</p>
            </div>
          </div>

          {/* Timeline dots */}
          <div
            className="relative grid mb-8"
            style={{ gridTemplateColumns: `repeat(${metrics.roadmap.length}, 1fr)` }}
          >
            <div className="absolute top-[14px] left-[calc(100%/(2*7))] right-[calc(100%/(2*7))] h-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #d63a1a, #e87a20, #d4a020, #2a9040)' }} />
            {metrics.roadmap.map((pt, i) => {
              const colors = ['#d63a1a','#e87a20','#e0a020','#b0b020','#70aa20','#2a9040','#0a7868']
              const col = colors[Math.min(i, colors.length - 1)]
              return (
                <div key={pt.month} className="flex flex-col items-center relative z-10">
                  {pt.isNow && (
                    <span className="absolute -top-6 bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                      YOU
                    </span>
                  )}
                  <div className={`rounded-full border-2 border-white shadow mb-2 ${pt.isNow ? 'w-6 h-6' : 'w-3.5 h-3.5'}`}
                    style={{ background: col, boxShadow: pt.isNow ? `0 0 0 3px ${col}33` : undefined }} />
                  <p className="font-oswald font-bold text-sm" style={{ color: col }}>{pt.weightKg}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted mt-0.5">{pt.label}</p>
                  {i > 0 && <p className="text-[9px] font-bold text-brand-green">−{(metrics.roadmap[0].weightKg - pt.weightKg).toFixed(1)}</p>}
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[11px] font-bold mb-1.5">
              <span className="text-brand-red">{profile.weightKg} kg (Now)</span>
              <span className="text-brand-green">{metrics.idealWeightLow.toFixed(0)}–{metrics.idealWeightHigh.toFixed(0)} kg (Ideal)</span>
            </div>
            <div className="h-3 bg-cream rounded-full overflow-hidden relative">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-orange animate-bar"
                style={{ width: `${Math.min(97, profile.weightKg / 135 * 100)}%` }} />
              <div className="absolute right-0 top-0 bottom-0 bg-[rgba(42,144,64,0.12)] border-l-2 border-dashed border-brand-green flex items-center pl-1.5"
                style={{ width: `${100 - Math.min(97, metrics.idealWeightHigh / 135 * 100)}%` }}>
                <span className="text-[9px] font-bold text-brand-green whitespace-nowrap">{metrics.idealWeightHigh.toFixed(0)} kg →</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ACTION PLAN ── */}
        <div className="bg-ink rounded-2xl p-8 animate-fade-up" style={{ animationDelay:'0.32s' }}>
          <h2 className="font-oswald font-bold uppercase text-2xl text-white mb-6">
            Month 2 <span className="text-brand-orange">Action Plan</span> — {firstName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '🏋️', cat: 'Training — 5×/Week',
                items: [
                  `3× Strength: compound lifts (squat, deadlift, bench, rows)`,
                  `2× Cardio: 45 min steady-state OR 25 min HIIT`,
                  Math.abs(measurements.rightThigh - measurements.leftThigh) > 0.8
                    ? `Unilateral leg work every session — close ${Math.abs(measurements.rightThigh - measurements.leftThigh).toFixed(1)}″ thigh gap`
                    : `Maintain leg symmetry with balanced training`,
                ]
              },
              {
                icon: '🥗', cat: 'Nutrition — Daily',
                items: [
                  `~500 kcal deficit/day → ~0.5 kg fat/week`,
                  `${Math.round(profile.weightKg * 1.8)}–${Math.round(profile.weightKg * 2)}g protein/day (1.8–2g/kg)`,
                  `3+ litres water/day · Cut refined carbs`,
                ]
              },
              {
                icon: '🎯', cat: 'Month 2 Targets',
                items: [
                  `Weight: ${profile.weightKg} → ${metrics.targetWeightKg} kg`,
                  `Waist: ${measurements.waist.toFixed(1)}″ → ${metrics.targetWaistIn.toFixed(1)}″`,
                  `BMI: ${metrics.bmi} → ${metrics.targetBmi.toFixed(1)}`,
                  `Body Fat: ${metrics.bodyFatPct}% → ${metrics.targetBodyFat.toFixed(1)}%`,
                ]
              },
            ].map(block => (
              <div key={block.cat} className="bg-white/[0.06] border border-white/10 rounded-xl p-4">
                <span className="text-2xl block mb-2">{block.icon}</span>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-gold mb-3">{block.cat}</p>
                <ul className="space-y-2">
                  {block.items.map(item => (
                    <li key={item} className="text-[12px] text-white/75 flex gap-2 leading-relaxed">
                      <span className="text-brand-green mt-0.5 flex-shrink-0">▸</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-white/25 leading-relaxed">
            ⚠ BMI and body fat % are estimates via the Navy Circumference Method and standard BMI equation (kg/m²).
            Consult a healthcare professional before starting any new diet or exercise programme.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-sm font-semibold text-muted hover:text-ink transition-colors">
            ← Generate another dashboard
          </a>
        </div>

      </div>
    </main>
  )
}
