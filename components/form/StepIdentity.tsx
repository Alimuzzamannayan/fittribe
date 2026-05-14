'use client'

import { useState }     from 'react'
import { COUNTRIES }    from '@/lib/types'
import type { FormData } from '@/lib/types'

interface Props {
  data:   Partial<FormData>
  onNext: (patch: Partial<FormData>) => void
}

export default function StepIdentity({ data, onNext }: Props) {
  const [v, setV]       = useState({ ...data })
  const [errs, setErrs] = useState<Record<string, string>>({})

  const country = COUNTRIES.find(c => c.code === (v.country || 'MV')) || COUNTRIES[0]

  const set = (k: keyof FormData, val: any) =>
    setV(prev => ({ ...prev, [k]: val }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!v.name?.trim())  e.name  = 'Required'
    if (!v.email?.trim()) e.email = 'Required'
    if (!v.phone?.trim()) e.phone = 'Required'
    if (!v.gender)        e.gender = 'Required'
    if (!v.weightKg || +v.weightKg <= 0) e.weightKg = 'Required'
    if (!v.date)  e.date = 'Required'
    if (!v.time)  e.time = 'Required'
    if (v.heightUnit === 'imperial') {
      if (!v.feet)   e.feet   = 'Required'
    } else {
      if (!v.heightCm) e.heightCm = 'Required'
    }
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext(v)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-paper rounded-2xl sm:rounded-3xl card-shadow animate-fade-up overflow-hidden">
      <div className="bg-gradient-to-r from-brand-navy to-[#213f6b] px-6 py-4">
        <h2 className="font-oswald font-bold uppercase text-xl text-white">Personal Info</h2>
        <p className="text-xs text-white/60 mt-0.5">We'll calculate your BMI, body fat % and email your full PDF report</p>
      </div>
      <div className="p-5 sm:p-8">

      {/* ── Report Delivery ── */}
      <div className="bg-gradient-to-br from-brand-green/5 to-brand-orange/5 border border-brand-green/20 rounded-2xl p-5 mb-6">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-green mb-4 flex items-center gap-2">
          📬 Report Delivery
        </p>

        {/* Email */}
        <Field label="Email Address" error={errs.email} required className="mb-4">
          <input
            type="email"
            value={v.email || ''}
            onChange={e => set('email', e.target.value)}
            placeholder="your@email.com"
            className={input(errs.email)}
          />
          <p className="text-[11px] text-muted2 mt-1">Your full PDF report will be sent here</p>
        </Field>

        {/* Country */}
        <Field label="Country" required className="mb-4">
          <select
            value={v.country || 'MV'}
            onChange={e => set('country', e.target.value)}
            className={input()}
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag}  {c.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Phone */}
        <Field label="Mobile Number" error={errs.phone} required className="mb-4">
          <div className="flex">
            <div className="flex items-center gap-2 bg-border px-3 rounded-l-xl border border-r-0 border-border2 min-w-[80px] justify-center">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-bold text-muted">{country.dial}</span>
            </div>
            <input
              type="tel"
              value={v.phone || ''}
              onChange={e => set('phone', e.target.value)}
              placeholder={country.placeholder}
              className={`${input(errs.phone)} rounded-l-none flex-1`}
            />
          </div>
        </Field>

        {/* WhatsApp / Viber */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted mb-2">This number has</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <MsgToggle
              label="WhatsApp" icon="💬"
              sub="Tick if active"
              checked={!!v.whatsapp}
              color="green"
              onChange={val => {
                set('whatsapp', val)
                if (val) set('noApp', false)
              }}
            />
            <MsgToggle
              label="Viber" icon="📲"
              sub="Tick if active"
              checked={!!v.viber}
              color="purple"
              onChange={val => {
                set('viber', val)
                if (val) set('noApp', false)
              }}
            />
            <MsgToggle
              label="Neither" icon="📵"
              sub="SMS only"
              checked={!!v.noApp}
              color="gray"
              onChange={val => {
                set('noApp', val)
                if (val) { set('whatsapp', false); set('viber', false) }
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Basic Info ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Full Name" error={errs.name} required className="sm:col-span-2">
          <input
            type="text"
            value={v.name || ''}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. John Smith"
            className={input(errs.name)}
          />
        </Field>

        <Field label="Gender" error={errs.gender} required>
          <select
            value={v.gender || ''}
            onChange={e => set('gender', e.target.value as 'male'|'female')}
            className={input(errs.gender)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>

        <Field label="Measurement Unit">
          <select
            value={v.measUnit || 'inches'}
            onChange={e => set('measUnit', e.target.value)}
            className={input()}
          >
            <option value="inches">Inches (in)</option>
            <option value="cm">Centimetres (cm)</option>
          </select>
        </Field>
      </div>

      {/* Height */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-muted">Height</p>
          <div className="flex gap-1">
            {(['imperial','cm'] as const).map(u => (
              <button
                key={u}
                type="button"
                onClick={() => set('heightUnit', u)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  v.heightUnit === u
                    ? 'bg-brand-navy text-white'
                    : 'bg-bg text-muted border border-border2'
                }`}
              >
                {u === 'imperial' ? 'ft / in' : 'cm'}
              </button>
            ))}
          </div>
        </div>
        {v.heightUnit === 'imperial' ? (
          <div className="grid grid-cols-2 gap-3">
            <Field error={errs.feet}>
              <div className="relative">
                <input type="number" value={v.feet||''} onChange={e=>set('feet',+e.target.value)}
                  placeholder="5" min="3" max="8" className={input(errs.feet)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted2">ft</span>
              </div>
            </Field>
            <Field error={errs.inches}>
              <div className="relative">
                <input type="number" value={v.inches??''} onChange={e=>set('inches',+e.target.value)}
                  placeholder="9" min="0" max="11" className={input(errs.inches)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted2">in</span>
              </div>
            </Field>
          </div>
        ) : (
          <Field error={errs.heightCm}>
            <div className="relative">
              <input type="number" value={v.heightCm||''} onChange={e=>set('heightCm',+e.target.value)}
                placeholder="175" min="100" max="250" className={input(errs.heightCm)} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted2">cm</span>
            </div>
          </Field>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Weight (kg)" error={errs.weightKg} required>
          <div className="relative">
            <input type="number" value={v.weightKg||''} onChange={e=>set('weightKg',+e.target.value)}
              placeholder="96.3" step="0.1" min="30" max="300" className={input(errs.weightKg)} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted2">kg</span>
          </div>
        </Field>
        <div />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Field label="Measurement Date" error={errs.date} required>
          <input type="date" value={v.date||today} onChange={e=>set('date',e.target.value)}
            className={input(errs.date)} />
        </Field>
        <Field label="Measurement Time" error={errs.time} required>
          <input type="time" value={v.time||'20:13'} onChange={e=>set('time',e.target.value)}
            className={input(errs.time)} />
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <span className="text-xs font-semibold text-muted2">Step 1 of 3</span>
        <button onClick={handleNext} className="btn-primary">
          Next — Measurements →
        </button>
      </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────

function Field({ label, error, required, children, className = '' }: {
  label?: string; error?: string; required?: boolean
  children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[10px] font-bold tracking-[0.16em] uppercase text-muted mb-1.5">
          {label} {required && <span className="text-brand-green">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-[11px] text-brand-orange font-semibold mt-1">{error}</p>}
    </div>
  )
}

function MsgToggle({ label, icon, sub, checked, color, onChange }: {
  label: string; icon: string; sub: string
  checked: boolean; color: 'green'|'purple'|'gray'
  onChange: (v: boolean) => void
}) {
  const colors = {
    green:  { border: 'border-green-400',  bg: 'bg-green-50',  text: 'text-green-700'  },
    purple: { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-700' },
    gray:   { border: 'border-border2',    bg: 'bg-bg',        text: 'text-muted'      },
  }
  const c = colors[color]

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        flex items-center gap-2 min-w-0 rounded-xl p-3
        border-2 transition-all duration-150 text-left
        ${checked ? `${c.border} ${c.bg}` : 'border-border2 bg-cream'}
      `}
    >
      <div className={`
        w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
        transition-all ${checked ? `${c.border} ${c.bg}` : 'border-border2 bg-white'}
      `}>
        {checked && <span className="text-[9px]">✓</span>}
      </div>
      <span className="text-lg leading-none">{icon}</span>
      <div>
        <div className={`text-xs font-bold ${checked ? c.text : 'text-ink2'}`}>{label}</div>
        <div className="text-[10px] text-muted2">{sub}</div>
      </div>
    </button>
  )
}

const input = (err?: string) => `
  w-full bg-bg border rounded-xl px-4 py-2.5
  font-mulish text-sm text-ink outline-none
  transition-all duration-150
  focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 focus:bg-white
  ${err ? 'border-brand-orange bg-brand-orange/5' : 'border-border2'}
`

// Tailwind needs these to be in source for purging
// @ts-ignore
const _styles = 'btn-primary'
