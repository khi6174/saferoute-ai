import type { Courier, Region, RiskFactor, Weather } from './types'
import { calculateFatigueScore } from './fatigueModel'

export function generateRiskFactors(
  courier: Courier,
  regions: Region[],
  weather: Weather,
  routeRiskScore: number,
): RiskFactor[] {
  const avgRegion = {
    hillRatio: average(regions.map((region) => region.hillRatio)),
    villaDensity: average(regions.map((region) => region.villaDensity)),
    narrowRoadRatio: average(regions.map((region) => region.narrowRoadRatio)),
    parkingDifficulty: average(regions.map((region) => region.parkingDifficulty)),
    nightVisibilityRisk: average(regions.map((region) => region.nightVisibilityRisk)),
  }
  const fatigueScore = calculateFatigueScore(courier)
  const factors: RiskFactor[] = [
    {
      factor: 'remaining_delivery_count',
      label: '남은 배송 건수',
      value: `${courier.remainingDeliveries}건`,
      score: Math.min(100, (courier.remainingDeliveries / 45) * 100),
      impact: courier.remainingDeliveries >= 40 ? 'critical' : courier.remainingDeliveries >= 32 ? 'high' : 'medium',
      message: `남은 배송이 ${courier.remainingDeliveries}건으로 많아 시간 압박과 이동 피로가 함께 증가합니다.`,
    },
    {
      factor: 'working_hours',
      label: '누적 근무 시간',
      value: `${courier.workingHours}시간`,
      score: Math.min(100, (courier.workingHours / 10) * 100),
      impact: courier.workingHours >= 9 ? 'critical' : courier.workingHours >= 8 ? 'high' : 'medium',
      message: `누적 근무 시간이 ${courier.workingHours}시간으로 길어 판단 피로와 반응 지연 위험이 커졌습니다.`,
    },
    {
      factor: 'fatigue_score',
      label: '피로 누적',
      value: `${fatigueScore}점`,
      score: fatigueScore,
      impact: fatigueScore >= 80 ? 'critical' : fatigueScore >= 65 ? 'high' : 'medium',
      message: `배송량, 이동거리, 휴식 간격을 종합한 피로 점수가 ${fatigueScore}점입니다.`,
    },
    {
      factor: 'weather',
      label: '날씨 영향',
      value: weather.label,
      score: Math.min(100, weather.rainLevel * 80 + (weather.snowFlag ? 90 : 0) + (weather.heatWaveFlag ? 62 : 0)),
      impact: weather.snowFlag || weather.rainLevel > 0.65 ? 'critical' : weather.heatWaveFlag ? 'high' : 'medium',
      message: `${weather.label} 조건으로 노면, 시야, 체력 부담이 배송 안전에 영향을 줍니다.`,
    },
    {
      factor: 'hill_ratio',
      label: '언덕 지역',
      value: `${Math.round(avgRegion.hillRatio * 100)}%`,
      score: avgRegion.hillRatio * 100,
      impact: avgRegion.hillRatio >= 0.7 ? 'critical' : avgRegion.hillRatio >= 0.5 ? 'high' : 'medium',
      message: `담당 구역의 언덕 비율이 ${Math.round(avgRegion.hillRatio * 100)}%로 높아 제동과 보행 이동 부담이 큽니다.`,
    },
    {
      factor: 'villa_density',
      label: '빌라 밀집도',
      value: `${Math.round(avgRegion.villaDensity * 100)}%`,
      score: avgRegion.villaDensity * 100,
      impact: avgRegion.villaDensity >= 0.7 ? 'critical' : avgRegion.villaDensity >= 0.5 ? 'high' : 'medium',
      message: `빌라 밀집도가 높아 엘리베이터 부재, 계단 이동, 반복 정차가 늘어납니다.`,
    },
    {
      factor: 'narrow_road_ratio',
      label: '좁은 골목',
      value: `${Math.round(avgRegion.narrowRoadRatio * 100)}%`,
      score: avgRegion.narrowRoadRatio * 100,
      impact: avgRegion.narrowRoadRatio >= 0.65 ? 'critical' : avgRegion.narrowRoadRatio >= 0.5 ? 'high' : 'medium',
      message: `좁은 골목 비율이 높아 차량 회피, 주정차, 보행자 접촉 위험이 증가합니다.`,
    },
    {
      factor: 'parking_difficulty',
      label: '주정차 난이도',
      value: `${Math.round(avgRegion.parkingDifficulty)}점`,
      score: avgRegion.parkingDifficulty,
      impact: avgRegion.parkingDifficulty >= 80 ? 'critical' : avgRegion.parkingDifficulty >= 65 ? 'high' : 'medium',
      message: `주정차 난이도가 높아 무리한 정차와 추가 보행 이동이 발생할 수 있습니다.`,
    },
    {
      factor: 'last_break',
      label: '휴식 부족',
      value: `${courier.lastBreakMinutesAgo}분`,
      score: Math.min(100, (courier.lastBreakMinutesAgo / 240) * 100),
      impact: courier.lastBreakMinutesAgo >= 220 ? 'critical' : courier.lastBreakMinutesAgo >= 180 ? 'high' : 'medium',
      message: `마지막 휴식 후 ${courier.lastBreakMinutesAgo}분이 지나 짧은 휴식 권장이 필요합니다.`,
    },
    {
      factor: 'route_risk',
      label: '경로 위험',
      value: `${routeRiskScore}점`,
      score: routeRiskScore,
      impact: routeRiskScore >= 80 ? 'critical' : routeRiskScore >= 60 ? 'high' : 'medium',
      message: `현재 최단 경로 기준 위험도가 ${routeRiskScore}점으로 안전 경로 검토가 필요합니다.`,
    },
    {
      factor: 'delay_minutes',
      label: '배송 지연',
      value: `${courier.delayMinutes}분`,
      score: Math.min(100, (courier.delayMinutes / 40) * 100),
      impact: courier.delayMinutes >= 30 ? 'critical' : courier.delayMinutes >= 20 ? 'high' : 'medium',
      message: `현재 지연이 ${courier.delayMinutes}분으로 시간 압박이 무리한 이동을 유도할 수 있습니다.`,
    },
  ]

  return factors
    .filter((factor) => factor.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1)
}
