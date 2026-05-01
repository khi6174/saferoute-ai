import type { RiskFactor } from '../engine/types'

type Props = {
  factors: RiskFactor[]
}

const impactClass = {
  info: 'border-stone-200 bg-stone-50',
  medium: 'border-amber-200 bg-amber-50',
  high: 'border-orange-200 bg-orange-50',
  critical: 'border-red-200 bg-red-50',
}

export function RiskFactorList({ factors }: Props) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-ink">위험 원인 TOP 요소</h2>
      <div className="mt-3 space-y-3">
        {factors.map((factor) => (
          <article key={factor.factor} className={`rounded-md border p-3 ${impactClass[factor.impact]}`}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-ink">{factor.label}</h3>
              <span className="text-sm font-semibold text-stone-700">{factor.value}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-700">{factor.message}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
