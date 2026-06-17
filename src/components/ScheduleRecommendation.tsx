import { CheckCircle2, Clock, PackageCheck, Route, ShieldCheck } from 'lucide-react'
import type { Recommendation } from '../engine/types'
import { ControlSection } from './ControlSection'

type Props = {
  recommendations: Recommendation[]
  isApplied: boolean
  onApply: () => void
}

export function ScheduleRecommendation({ recommendations, isApplied, onApply }: Props) {
  return (
    <ControlSection
      title="AI 권장 조치 목록"
      description="안전 조정 필요 항목을 우선순위에 따라 제안합니다."
      icon={<ShieldCheck size={20} />}
      action={
        <button
          className="rounded-md bg-amber px-3 py-2 text-sm font-black text-navy shadow-sm transition hover:bg-yellow-400 disabled:bg-slate-200 disabled:text-slate-500"
          type="button"
          disabled={isApplied}
          onClick={onApply}
        >
          {isApplied ? '조정 적용됨' : '조정 적용'}
        </button>
      }
    >
      <div className="mt-3 space-y-3">
        {recommendations.slice(0, 3).map((recommendation, index) => (
          <article key={recommendation.id} className={`rounded-md border p-4 ${index === 0 ? 'border-amber bg-amber/10' : 'border-line bg-white'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-amber">{getRecommendationIcon(recommendation.type)}</span>
                <h3 className="font-bold text-ink">{recommendation.title}</h3>
              </div>
              <span className="rounded-md bg-white px-2 py-1 text-sm font-black text-safe">
                {recommendation.expectedRiskBefore}점 → {recommendation.expectedRiskAfter}점
              </span>
            </div>
            {index === 0 ? (
              <span className="mt-2 inline-flex rounded-md bg-navy px-2 py-1 text-xs font-bold text-white">
                우선 적용 추천
              </span>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.message}</p>
            <ul className="mt-3 grid gap-2 text-sm text-slate-700">
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
    </ControlSection>
  )
}

function getRecommendationIcon(type: Recommendation['type']) {
  if (type === 'redistribution') return <PackageCheck size={18} />
  if (type === 'rest') return <Clock size={18} />
  if (type === 'safe_route' || type === 'schedule_adjustment') return <Route size={18} />
  return <ShieldCheck size={18} />
}
