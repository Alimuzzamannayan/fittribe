'use client'

interface Props { current: number }

const STEPS = [
  { n: 1, label: 'Identity'     },
  { n: 2, label: 'Measurements' },
  { n: 3, label: 'Review'       },
]

export default function StepBar({ current }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-card px-4 py-4 mb-8 flex items-center">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              font-oswald font-bold text-sm transition-all duration-300
              ${s.n < current  ? 'bg-brand-navy text-white'  : ''}
              ${s.n === current ? 'bg-brand-green text-white shadow-green' : ''}
              ${s.n > current  ? 'bg-border text-muted2 border-2 border-border2' : ''}
            `}>
              {s.n < current ? '✓' : s.n}
            </div>
            <span className={`
              text-[9px] font-bold tracking-widest uppercase whitespace-nowrap
              ${s.n === current ? 'text-brand-green' : s.n < current ? 'text-brand-navy' : 'text-muted2'}
            `}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`
              flex-1 h-0.5 mx-2 mb-4 transition-all duration-500
              ${s.n < current ? 'bg-brand-navy' : 'bg-border'}
            `} />
          )}
        </div>
      ))}
    </div>
  )
}
