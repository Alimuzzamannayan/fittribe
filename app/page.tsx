'use client'

import { useState } from 'react'
import { useRouter }     from 'next/navigation'
import StepIdentity      from '@/components/form/StepIdentity'
import StepMeasurements  from '@/components/form/StepMeasurements'
import StepReview        from '@/components/form/StepReview'
import StepBar           from '@/components/form/StepBar'
import type { FormData } from '@/lib/types'

const EMPTY: Partial<FormData> = {
  country:    'MV',
  heightUnit: 'imperial',
  measUnit:   'inches',
  gender:     'male',
  whatsapp:   false,
  viber:      false,
  noApp:      false,
  date:        new Date().toISOString().split('T')[0],
  time:        '20:13',
}

export default function HomePage() {
  const router                      = useRouter()
  const [step, setStep]             = useState(1)
  const [data, setData]             = useState<Partial<FormData>>(EMPTY)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const update = (patch: Partial<FormData>) =>
    setData(prev => ({ ...prev, ...patch }))

  const next = (patch: Partial<FormData>) => {
    update(patch)
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async (patch: Partial<FormData>) => {
    const final = { ...data, ...patch } as FormData
    setData(final)
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(final),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      router.push(`/dashboard/${json.profileId}?new=1`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg">

      {/* ── Top nav ── */}
      <nav className="bg-white border-b-4 border-brand-green sticky top-0 z-10 shadow-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-green to-[#2a8025] flex items-center justify-center shadow-green text-xl flex-shrink-0">
              🏃
            </div>
            <div>
              <div className="font-oswald font-bold text-lg text-brand-navy leading-none">FitTribe</div>
              <div className="text-[9px] text-muted2 tracking-widest uppercase">Body Analytics</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted2">
            <span className="bg-bg px-3 py-1.5 rounded-full border border-border">📊 Dashboard</span>
            <span className="bg-bg px-3 py-1.5 rounded-full border border-border">📄 PDF</span>
            <span className="bg-bg px-3 py-1.5 rounded-full border border-border">📧 Email</span>
          </div>
        </div>
      </nav>

      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-br from-brand-navy to-[#213f6b] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 85% 50%, rgba(61,168,50,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative">
          <p className="text-[10px] font-oswald font-medium tracking-[0.3em] uppercase text-brand-green mb-3">
            Body Analytics System
          </p>
          <h1 className="font-oswald font-bold uppercase leading-none text-4xl sm:text-6xl md:text-7xl text-white mb-5">
            Your Personal<br />
            <span className="gradient-text">Fitness Dashboard</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-green/20 border border-brand-green/40 text-brand-green">📊 Instant Dashboard</span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-green/20 border border-brand-green/40 text-brand-green">📄 PDF Report</span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange">📧 Email Delivery</span>
          </div>
        </div>
      </div>

      {/* ── Form area ── */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

        <StepBar current={step} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        {step === 1 && <StepIdentity data={data} onNext={next} />}
        {step === 2 && <StepMeasurements data={data} onNext={next} onBack={back} />}
        {step === 3 && (
          <StepReview data={data as FormData} onBack={back} onSubmit={submit} loading={loading} />
        )}
      </div>
    </main>
  )
}
