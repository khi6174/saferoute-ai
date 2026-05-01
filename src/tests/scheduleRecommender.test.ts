import { describe, expect, it } from 'vitest'
import { demoCouriers } from '../data/demoCouriers'
import { demoDeliveries } from '../data/demoDeliveries'
import { demoRegions } from '../data/demoRegions'
import { demoRoutes } from '../data/demoRoutes'
import { demoWeather } from '../data/demoWeather'
import { calculateRiskScore } from '../engine/riskScoring'
import { scoreRoutes } from '../engine/routeScoring'
import { generateRecommendations } from '../engine/scheduleRecommender'

describe('scheduleRecommender', () => {
  it('고위험 기사에게 행동 추천과 위험도 개선 값을 만든다', () => {
    const courier = demoCouriers.find((item) => item.id === 'courier_001')!
    const weather = demoWeather.find((item) => item.id === 'rain_evening')!
    const routes = scoreRoutes(demoRoutes.filter((item) => item.courierId === courier.id), weather)
    const risk = calculateRiskScore(
      courier,
      demoRegions.filter((region) => courier.assignedRegionIds.includes(region.id)),
      weather,
      routes.find((route) => route.type === 'fastest')!,
    )
    const recommendations = generateRecommendations(
      courier,
      demoDeliveries.filter((delivery) => delivery.courierId === courier.id),
      risk,
      routes,
      weather,
    )

    expect(recommendations.length).toBeGreaterThan(0)
    expect(recommendations[0].expectedRiskAfter).toBeLessThan(recommendations[0].expectedRiskBefore)
    expect(recommendations.some((recommendation) => recommendation.type === 'redistribution')).toBe(true)
  })

  it('지연 추천은 긴급 배송을 대상에 포함하지 않는다', () => {
    const courier = demoCouriers.find((item) => item.id === 'courier_001')!
    const weather = demoWeather.find((item) => item.id === 'rain_evening')!
    const deliveries = demoDeliveries.filter((delivery) => delivery.courierId === courier.id)
    const routes = scoreRoutes(demoRoutes.filter((item) => item.courierId === courier.id), weather)
    const risk = calculateRiskScore(
      courier,
      demoRegions.filter((region) => courier.assignedRegionIds.includes(region.id)),
      weather,
      routes.find((route) => route.type === 'fastest')!,
    )
    const delay = generateRecommendations(courier, deliveries, risk, routes, weather).find(
      (recommendation) => recommendation.type === 'delay',
    )!

    const affected = deliveries.filter((delivery) => delay.affectedDeliveries.includes(delivery.id))
    expect(affected.every((delivery) => delivery.priority === 'normal')).toBe(true)
  })
})
