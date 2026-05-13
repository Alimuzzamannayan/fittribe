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
    <main className="min-h-screen texture-bg">
      {/* Hero header */}
      <div className="bg-ink text-white">
        <div className="max-w-5xl mx-auto px-6 py-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[10px] font-oswald font-medium tracking-[0.3em] uppercase text-brand-red mb-2">
              Body Analytics System
            </p>
            <h1 className="font-oswald font-bold uppercase leading-none text-5xl md:text-7xl">
              Your Personal<br />
              <span className="gradient-text">Fitness Dashboard</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm text-white/50">
            <span className="flex items-center gap-2">📊 Instant Dashboard</span>
            <span>·</span>
            <span className="flex items-center gap-2">📄 PDF Report</span>
            <span>·</span>
            <span className="flex items-center gap-2">📧 Email Delivery</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step progress */}
        <StepBar current={step} />

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-fade-in">
            ⚠️ {error}
          </div>
        )}

        {/* Step panels */}
        {step === 1 && (
          <StepIdentity data={data} onNext={next} />
        )}
        {step === 2 && (
          <StepMeasurements data={data} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <StepReview
            data={data as FormData}
            onBack={back}
            onSubmit={submit}
            loading={loading}
          />
        )}
      </div>
    </main>
  )
}
