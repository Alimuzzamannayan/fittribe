'use client'

import { COUNTRIES }    from '@/lib/types'
import type { FormData } from '@/lib/types'

interface Props {
  data:     FormData
  onBack:   () => void
  onSubmit: (patch: Partial<FormData>) => void
  loading:  boolean
}

export default function StepReview({ data, onBack, onSubmit, loading }: Props) {
  const country = COUNTRIES.find(c => c.code === data.country) || COUNTRIES[0]

  const preview = [
    { label: 'Name',     value: data.name },
    { label: 'Email',    value: data.email },
    { label: 'Country',  value: `${country.flag} ${country.name}` },
    { label: 'Mobile',   value: `${country.dial} ${data.phone}` },
    { label: 'Messaging',
      value: [
        data.whatsapp && '💬 WhatsApp',
        data.viber    && '📲 Viber',
        data.noApp    && '📵 SMS Only',
      ].filter(Boolean).join('  ') || 'Not specified'
    },
    { label: 'Gender',  value: data.gender === 'male' ? '♂ Male' : '♀ Female' },
    { label: 'Weight',  value: `${data.weightKg} kg` },
    { label: 'Date',    value: data.date },
    { label: 'Waist',   value: `${data.waist}${data.measUnit === 'cm' ? ' cm' : '″'}` },
    { label: 'Chest',   value: `${data.chest}${data.measUnit === 'cm' ? ' cm' : '″'}` },
  ]

  return (
    <div className="bg-paper border border-border rounded-3xl p-8 card-shadow animate-fade-up">
      <h2 className="font-oswald font-bold uppercase text-2xl text-ink mb-1">Review & Generate</h2>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        Confirm your details then generate your dashboard. Your PDF report will be emailed automatically.
      </p>

      {/* Preview grid */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {preview.map(p => (
          <div key={p.label} className="bg-cream rounded-xl px-4 py-3 flex justify-between items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted flex-shrink-0">
              {p.label}
            </span>
            <span className="font-oswald font-semibold text-sm text-ink text-right truncate">
              {p.value || '—'}
            </span>
          </div>
        ))}
      </div>

      {/* What gets calculated */}
      <div className="bg-[rgba(42,144,64,0.06)] border border-[rgba(42,144,64,0.2)] rounded-2xl p-4 mb-4">
        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-brand-green mb-3">
          Auto-calculated from your data
        </p>
        <div className="grid grid-cols-2 gap-y-1 gap-x-4">
          {[
            '✓ BMI & category',         '✓ Body fat % (Navy)',
            '✓ Lean & fat mass',         '✓ Waist–Hip ratio',
            '✓ Body shape type',         '✓ Symmetry score',
            '✓ Month 2 targets',         '✓ 6-month roadmap',
          ].map(item => (
            <span key={item} className="text-xs font-medium text-ink2 py-0.5">{item}</span>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-[rgba(24,104,176,0.05)] border border-[rgba(24,104,176,0.18)] rounded-2xl p-4 mb-8">
        <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-brand-blue mb-3">
          What you&apos;ll receive
        </p>
        <div className="flex flex-col gap-2">
          {[
            { icon: '📊', text: 'Instant visual dashboard in your browser' },
            { icon: '📄', text: `Full PDF report emailed to ${data.email}` },
          ].map(d => (
            <div key={d.icon} className="flex items-center gap-3 text-sm text-ink2 font-medium">
              <span>{d.icon}</span>{d.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onBack} disabled={loading} className="btn-secondary disabled:opacity-50">
          ← Edit
        </button>
        <button
          onClick={() => onSubmit({})}
          disabled={loading}
          className="btn-generate disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            '🚀 Generate My Dashboard'
          )}
        </button>
      </div>
    </div>
  )
}
