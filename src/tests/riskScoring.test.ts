import { describe, expect, it } from 'vitest'
import { demoCouriers } from '../data/demoCouriers'
import { demoRegions } from '../data/demoRegions'
import { demoRoutes } from '../data/demoRoutes'
import { demoWeather } from '../data/demoWeather'
import { calculateFatigueScore } from '../engine/fatigueModel'
import { calculateRiskScore } from '../engine/riskScoring'

describe('riskScoring', () => {
  it('높은 물량, 우천, 장시간 근무는 높음 이상 위험도를 만든다', () => {
    const courier = demoCouriers.find((item) => item.id === 'courier_001')!
    const regions = demoRegions.filter((region) => courier.assignedRegionIds.includes(region.id))
    const weather = demoWeather.find((item) => item.id === 'rain_evening')!
    const route = demoRoutes.find((item) => item.courierId === courier.id && item.type === 'fastest')!

    const result = calculateRiskScore(courier, regions, weather, route)

    expect(result.riskScore).toBeGreaterThanOrEqual(60)
    expect(result.factors.length).toBeGreaterThanOrEqual(3)
    expect(result.factors.map((factor) => factor.label)).toContain('남은 배송 건수')
  })

  it('낮은 물량과 평상시 날씨는 낮음 또는 보통 수준을 유지한다', () => {
    const courier = demoCouriers.find((item) => item.id === 'courier_006')!
    const regions = demoRegions.filter((region) => courier.assignedRegionIds.includes(region.id))
    const weather = demoWeather.find((item) => item.id === 'clear_day')!
    const route = demoRoutes.find((item) => item.courierId === courier.id && item.type === 'fastest')!

    const result = calculateRiskScore(courier, regions, weather, route)

    expect(result.riskScore).toBeLessThan(60)
  })

  it('장시간 근무와 긴 휴식 간격은 피로 점수를 증가시킨다', () => {
    const highFatigue = demoCouriers.find((item) => item.id === 'courier_001')!
    const lowFatigue = demoCouriers.find((item) => item.id === 'courier_006')!

    expect(calculateFatigueScore(highFatigue)).toBeGreaterThan(calculateFatigueScore(lowFatigue))
  })
})
