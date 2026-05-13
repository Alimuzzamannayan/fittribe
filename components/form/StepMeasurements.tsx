'use client'

import { useState }     from 'react'
import type { FormData } from '@/lib/types'

interface Props {
  data:   Partial<FormData>
  onNext: (patch: Partial<FormData>) => void
  onBack: () => void
}

const FIELDS: { key: keyof FormData; label: string; hint?: string }[][] = [
  // Upper
  [
    { key: 'neck',  label: 'Neck'  },
    { key: 'chest', label: 'Chest' },
    { key: 'waist', label: 'Waist', hint: 'At navel level' },
  ],
  // Mid
  [
    { key: 'hips',     label: 'Hips',      hint: 'Widest point' },
    { key: 'rightArm', label: 'Right Arm', hint: 'Bicep peak'   },
    { key: 'leftArm',  label: 'Left Arm'  },
  ],
  // Lower
  [
    { key: 'rightThigh', label: 'Right Thigh' },
    { key: 'leftThigh',  label: 'Left Thigh'  },
    { key: 'rightCalf',  label: 'Right Calf'  },
    { key: 'leftCalf',   label: 'Left Calf'   },
  ],
]

const SECTION_LABELS  = ['Upper Body', 'Mid Body', 'Lower Body']
const SECTION_COLORS  = ['#1868b0', '#e87a20', '#0a7868']

export default function StepMeasurements({ data, onNext, onBack }: Props) {
  const [v, setV]       = useState({ ...data })
  const [errs, setErrs] = useState<Record<string, string>>({})
  const unit = v.measUnit === 'cm' ? 'cm' : 'in'

  const set = (k: keyof FormData, val: any) =>
    setV(prev => ({ ...prev, [k]: val }))

  const validate = () => {
    const allKeys = FIELDS.flat().map(f => f.key)
    const e: Record<string, string> = {}
    allKeys.forEach(k => {
      if (!v[k] || +(v[k] as any) <= 0) e[k as string] = '!'
    })
    setErrs(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="bg-paper border border-border rounded-3xl p-8 card-shadow animate-fade-up">
      <h2 className="font-oswald font-bold uppercase text-2xl text-ink mb-1">Body Measurements</h2>
      <p className="text-sm text-muted mb-8 leading-relaxed">
        Use a flexible tape measure. Measure at the widest point for each area.
        All values in <strong>{v.measUnit === 'cm' ? 'centimetres' : 'inches'}</strong>.
      </p>

      {FIELDS.map((section, si) => (
        <div key={si} className="mb-6">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: SECTION_COLORS[si] }}
            />
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted">
              {SECTION_LABELS[si]}
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className={`grid gap-3 ${section.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {section.map(f => (
              <div key={f.key as string}>
                <label className="block text-[10px] font-bold tracking-[0.14em] uppercase text-muted mb-1.5">
                  {f.label} <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={(v[f.key] as number) || ''}
                    onChange={e => set(f.key, +e.target.value)}
                    placeholder="0.0"
                    step="0.1"
                    min="1"
                    className={`
                      w-full bg-cream border rounded-xl px-3 py-2.5 pr-10
                      font-mulish text-sm text-ink outline-none
                      transition-all duration-150
                      focus:border-brand-red focus:ring-2 focus:ring-[rgba(214,58,26,0.10)] focus:bg-white
                      ${errs[f.key as string] ? 'border-brand-red bg-[rgba(214,58,26,0.05)]' : 'border-border2'}
                    `}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted2">
                    {unit}
                  </span>
                </div>
                {f.hint && (
                  <p className="text-[10px] text-muted2 mt-0.5">{f.hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.keys(errs).length > 0 && (
        <p className="text-sm text-brand-red font-semibold mb-4">
          ⚠️ Please fill in all measurements before continuing.
        </p>
      )}

      <div className="flex justify-between items-center mt-6">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <span className="text-xs font-semibold text-muted2">Step 2 of 3</span>
        <button onClick={() => { if (validate()) onNext(v) }} className="btn-primary">
          Review →
        </button>
      </div>
    </div>
  )
}
