'use client'

interface Props { current: number }

const STEPS = [
  { n: 1, label: 'You'          },
  { n: 2, label: 'Measurements' },
  { n: 3, label: 'Review'       },
]

export default function StepBar({ current }: Props) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              font-oswald font-bold text-sm transition-all duration-300
              ${s.n < current  ? 'bg-brand-green text-white shadow-[0_2px_10px_rgba(42,144,64,0.3)]' : ''}
              ${s.n === current ? 'bg-brand-red text-white shadow-red'                                  : ''}
              ${s.n > current  ? 'bg-paper border-2 border-border2 text-muted2'                         : ''}
            `}>
              {s.n < current ? '✓' : s.n}
            </div>
            <span className={`
              text-[10px] font-bold tracking-widest uppercase whitespace-nowrap
              ${s.n === current ? 'text-ink2'  : 'text-muted2'}
            `}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`
              w-16 h-0.5 mb-5 mx-1 transition-all duration-500
              ${s.n < current ? 'bg-brand-green' : 'bg-border'}
            `} />
          )}
        </div>
      ))}
    </div>
  )
}
