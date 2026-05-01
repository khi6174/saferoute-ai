import { ShieldCheck, Timer } from 'lucide-react'
import type { RouteResult } from '../engine/types'
import { formatMinutes } from '../utils/formatters'
import { ControlSection } from './ControlSection'

type Props = {
  routes: RouteResult[]
  recommendedRoute: RouteResult
}

export function RouteComparison({ routes, recommendedRoute }: Props) {
  const visibleRoutes = routes.filter((route) => route.type === 'fastest' || route.type === 'safe')
  const fastest = visibleRoutes.find((route) => route.type === 'fastest')
  const safe = visibleRoutes.find((route) => route.type === 'safe')
  const timeDelta = fastest && safe ? safe.estimatedMinutes - fastest.estimatedMinutes : 0
  const riskDelta = fastest && safe ? fastest.riskScore - safe.riskScore : 0

  return (
    <ControlSection
      title="AI 경로 판단"
      description="최단 경로가 항상 최선이 아닙니다. 시간과 위험도 감소를 함께 비교합니다."
      icon={<ShieldCheck size={20} />}
    >
      <div className="mb-4 grid gap-3 rounded-md border border-line bg-slate-50 p-3 sm:grid-cols-3">
        <DecisionMetric label="추가 소요" value={`${Math.max(0, timeDelta)}분`} />
        <DecisionMetric label="위험도 감소" value={`-${Math.max(0, riskDelta)}점`} />
        <DecisionMetric label="AI 판단" value={recommendedRoute.label} emphasis />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {visibleRoutes.map((route) => (
          <article
            key={route.id}
            className={`rounded-md border p-4 ${
              recommendedRoute.id === route.id ? 'border-amber bg-amber/10' : 'border-line bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-ink">{route.label}</h3>
              {recommendedRoute.id === route.id ? (
                <span className="rounded-md bg-amber px-2 py-1 text-xs font-black text-navy">안전 경로 추천</span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="inline-flex items-center gap-1">
                <Timer size={15} />
                {formatMinutes(route.estimatedMinutes)}
              </span>
              <span className={route.riskScore >= 70 ? 'font-bold text-danger' : 'font-bold text-safe'}>위험도 {route.riskScore}점</span>
              <span>거리 {route.distanceKm}km</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{route.recommendationMessage}</p>
          </article>
        ))}
      </div>
    </ControlSection>
  )
}

function DecisionMetric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-black ${emphasis ? 'text-amber' : 'text-ink'}`}>{value}</div>
    </div>
  )
}
