import { ShieldCheck, Timer } from 'lucide-react'
import type { RouteResult } from '../engine/types'
import { formatMinutes } from '../utils/formatters'

type Props = {
  routes: RouteResult[]
  recommendedRoute: RouteResult
}

export function RouteComparison({ routes, recommendedRoute }: Props) {
  const visibleRoutes = routes.filter((route) => route.type === 'fastest' || route.type === 'safe')

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldCheck size={20} className="text-safe" />
        <h2 className="text-lg font-bold text-ink">최단 경로 vs 안전 경로</h2>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {visibleRoutes.map((route) => (
          <article
            key={route.id}
            className={`rounded-md border p-4 ${
              recommendedRoute.id === route.id ? 'border-emerald-300 bg-emerald-50' : 'border-stone-200 bg-stone-50'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-ink">{route.label}</h3>
              {recommendedRoute.id === route.id ? (
                <span className="rounded-md bg-safe px-2 py-1 text-xs font-bold text-white">AI 추천</span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-700">
              <span className="inline-flex items-center gap-1">
                <Timer size={15} />
                {formatMinutes(route.estimatedMinutes)}
              </span>
              <span>위험도 {route.riskScore}점</span>
              <span>거리 {route.distanceKm}km</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-700">{route.recommendationMessage}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
