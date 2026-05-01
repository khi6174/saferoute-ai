import type { RouteCandidate, RouteResult, Weather } from './types'
import { clamp, roundScore } from '../utils/formatters'

export function calculateRouteRisk(route: RouteCandidate, weather: Weather) {
  const accidentHotspotScore = clamp((route.accidentZoneCount / 7) * 100)
  const hillScore = clamp((route.hillSections / 7) * 100)
  const narrowRoadScore = clamp((route.narrowRoadSections / 8) * 100)
  const weatherImpactScore = clamp(
    weather.rainLevel * 70 +
      (weather.snowFlag ? 88 : 0) +
      (weather.heatWaveFlag ? 34 : 0) +
      weather.windLevel * 28 +
      (1 - weather.visibilityLevel) * 35,
  )
  const parkingDifficultyScore = route.parkingDifficulty
  const nightRiskScore = route.nightVisibilityRisk

  return roundScore(
    0.25 * accidentHotspotScore +
      0.2 * hillScore +
      0.2 * narrowRoadScore +
      0.15 * weatherImpactScore +
      0.1 * parkingDifficultyScore +
      0.1 * nightRiskScore,
  )
}

export function scoreRoutes(routes: RouteCandidate[], weather: Weather): RouteResult[] {
  return routes
    .map((route) => {
      const riskScore = calculateRouteRisk(route, weather)
      const safetyScore = 100 - riskScore
      const recommendationMessage =
        route.type === 'safe'
          ? `최단 경로보다 시간이 더 걸릴 수 있지만 사고 다발 구역, 급경사, 좁은 골목 노출을 줄여 위험도를 ${riskScore}점으로 낮춥니다.`
          : route.type === 'fastest'
            ? `가장 빠르지만 위험 구역과 좁은 골목 노출이 많아 현재 조건에서는 위험도 ${riskScore}점입니다.`
            : `시간과 안전을 절충한 경로이며 위험도는 ${riskScore}점입니다.`

      return {
        ...route,
        riskScore,
        safetyScore,
        recommendationMessage,
      }
    })
    .sort((a, b) => {
      if (a.type === 'fastest') return -1
      if (b.type === 'fastest') return 1
      if (a.type === 'safe') return -1
      if (b.type === 'safe') return 1
      return a.estimatedMinutes - b.estimatedMinutes
    })
}

export function recommendRoute(routes: RouteResult[]) {
  const fastest = routes.find((route) => route.type === 'fastest') ?? routes[0]
  const safest = routes.reduce((best, route) => (route.riskScore < best.riskScore ? route : best), routes[0])

  if (fastest.riskScore - safest.riskScore >= 12) {
    return safest
  }

  return routes.find((route) => route.type === 'balanced') ?? safest
}
