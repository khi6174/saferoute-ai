import { describe, expect, it } from 'vitest'
import { demoCouriers } from '../data/demoCouriers'
import { demoDeliveries } from '../data/demoDeliveries'
import { demoRegions } from '../data/demoRegions'
import { demoRoutes } from '../data/demoRoutes'
import { demoWeather } from '../data/demoWeather'
import { buildDashboardSummary } from '../engine/dashboardSummary'
import { calculateRiskScore } from '../engine/riskScoring'
import { recommendRoute, scoreRoutes } from '../engine/routeScoring'
import { generateRecommendations } from '../engine/scheduleRecommender'
import { RESPONSIBILITY_MESSAGE, RISK_ENGINE_MESSAGE, SIMULATION_MESSAGE } from '../utils/constants'

function buildCourierContext(courierId: string, weatherId: string) {
  const courier = demoCouriers.find((item) => item.id === courierId)!
  const weather = demoWeather.find((item) => item.id === weatherId)!
  const routes = scoreRoutes(demoRoutes.filter((route) => route.courierId === courier.id), weather)
  const risk = calculateRiskScore(
    courier,
    demoRegions.filter((region) => courier.assignedRegionIds.includes(region.id)),
    weather,
    routes.find((route) => route.type === 'fastest')!,
  )
  const deliveries = demoDeliveries.filter((delivery) => delivery.courierId === courier.id)
  const recommendations = generateRecommendations(courier, deliveries, risk, routes, weather)

  return { courier, deliveries, recommendations, risk, routes }
}

describe('MVP completion safeguards', () => {
  it('고위험 기사는 실행 가능한 추천과 개선 예상값을 받는다', () => {
    const { recommendations } = buildCourierContext('courier_001', 'rain_evening')

    expect(recommendations.length).toBeGreaterThan(0)
    expect(recommendations.some((recommendation) => recommendation.actions.length > 0)).toBe(true)
    expect(recommendations.every((recommendation) => recommendation.expectedRiskAfter <= recommendation.expectedRiskBefore)).toBe(true)
  })

  it('관리자 요약은 before/after, 물량 분산, 지연 안내, 휴식 권장을 포함한다', () => {
    const { recommendations, risk } = buildCourierContext('courier_001', 'rain_evening')
    const summary = buildDashboardSummary(demoCouriers, [risk], recommendations)

    expect(summary.beforeRisk).toBeGreaterThan(summary.afterRisk)
    expect(summary.improvement).toBe(summary.beforeRisk - summary.afterRisk)
    expect(summary.redistributedPackages).toBeGreaterThan(0)
    expect(summary.delayedDeliveries).toBeGreaterThan(0)
    expect(summary.restRecommended).toBe(true)
  })

  it('저위험 기사에게는 공격적인 지연 추천을 만들지 않는다', () => {
    const { recommendations } = buildCourierContext('courier_006', 'clear_day')

    expect(recommendations.some((recommendation) => recommendation.type === 'delay')).toBe(false)
  })

  it('위험 설명은 실제 고영향 요인을 포함한다', () => {
    const { risk } = buildCourierContext('courier_001', 'rain_evening')
    const factors = risk.factors.map((factor) => factor.factor)

    expect(factors).toContain('remaining_delivery_count')
    expect(factors).toContain('working_hours')
    expect(risk.factors.length).toBeGreaterThanOrEqual(3)
  })

  it('안전 경로는 더 느려도 위험 차이가 크면 추천된다', () => {
    const { routes } = buildCourierContext('courier_001', 'rain_evening')
    const fastest = routes.find((route) => route.type === 'fastest')!
    const safe = routes.find((route) => route.type === 'safe')!
    const recommended = recommendRoute(routes)

    expect(safe.estimatedMinutes).toBeGreaterThan(fastest.estimatedMinutes)
    expect(fastest.riskScore - safe.riskScore).toBeGreaterThanOrEqual(12)
    expect(recommended.type).toBe('safe')
  })

  it('책임, 시뮬레이션, Risk Engine 기준 메시지를 명확히 제공한다', () => {
    expect(RESPONSIBILITY_MESSAGE).toContain('최종 운영 판단')
    expect(SIMULATION_MESSAGE).toContain('시뮬레이션')
    expect(RISK_ENGINE_MESSAGE).toContain('LLM은 점수를 계산하지 않고')
  })
})
