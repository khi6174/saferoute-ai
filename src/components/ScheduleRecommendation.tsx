import { CheckCircle2 } from 'lucide-react'
import type { Recommendation } from '../engine/types'

type Props = {
  recommendations: Recommendation[]
  isApplied: boolean
  onApply: () => void
}

export function ScheduleRecommendation({ recommendations, isApplied, onApply }: Props) {
  const primary = recommendations[0]

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink">배송 스케줄 재조정 추천</h2>
        <button
          className="rounded-md bg-safe px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:bg-stone-300"
          type="button"
          disabled={isApplied}
          onClick={onApply}
        >
          {isApplied ? 'AI 추천 적용됨' : `AI 추천 적용 (${primary.expectedRiskBefore}점 → ${primary.expectedRiskAfter}점)`}
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {recommendations.slice(0, 3).map((recommendation) => (
          <article key={recommendation.id} className="rounded-md border border-stone-200 bg-stone-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-ink">{recommendation.title}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-sm font-semibold text-safe">
                {recommendation.expectedRiskBefore}점 → {recommendation.expectedRiskAfter}점
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-700">{recommendation.message}</p>
            <ul className="mt-3 grid gap-2 text-sm text-stone-700">
              {recommendation.actions.map((action) => (
                <li key={action} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-safe" />
                  {action}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
