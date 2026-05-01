import type { Courier, Region, RiskResult, RouteCandidate, Weather } from './types'
import { calculateFatigueScore } from './fatigueModel'
import { calculateRouteRisk } from './routeScoring'
import { generateRiskFactors } from './explanationGenerator'
import { clamp, getRiskLevel, roundScore } from '../utils/formatters'
import { RISK_LABELS } from '../utils/constants'

export function calculateRiskScore(
  courier: Courier,
  regions: Region[],
  weather: Weather,
  fastestRoute: RouteCandidate,
): RiskResult {
  const deliveryCountToday = courier.completedDeliveries + courier.remainingDeliveries
  const loadScore = clamp((deliveryCountToday / 125) * 55 + (courier.remainingDeliveries / 45) * 45)
  const fatigueScore = calculateFatigueScore(courier)
  const remainingWorkMinutes = Math.max(180, 600 - courier.workingHours * 60)
  const timePressureScore = clamp((courier.remainingDeliveries * 7.5) / remainingWorkMinutes * 100)
  const weatherScore = clamp(
    weather.rainLevel * 75 +
      (weather.snowFlag ? 92 : 0) +
      (weather.heatWaveFlag ? 62 : 0) +
      weather.windLevel * 25 +
      (1 - weather.visibilityLevel) * 35,
  )
  const regionRiskScore = calculateRegionRisk(regions, courier.nightDelivery)
  const routeRiskScore = calculateRouteRisk(fastestRoute, weather)
  const delayScore = clamp((courier.delayMinutes / 40) * 100)

  const riskScore = roundScore(
    0.22 * loadScore +
      0.18 * fatigueScore +
      0.16 * timePressureScore +
      0.16 * weatherScore +
      0.14 * regionRiskScore +
      0.08 * routeRiskScore +
      0.06 * delayScore,
  )
  const riskLevel = getRiskLevel(riskScore)

  return {
    courierId: courier.id,
    riskScore,
    riskLevel,
    riskLevelLabel: RISK_LABELS[riskLevel],
    factors: generateRiskFactors(courier, regions, weather, routeRiskScore),
    scores: {
      loadScore: roundScore(loadScore),
      fatigueScore,
      timePressureScore: roundScore(timePressureScore),
      weatherScore: roundScore(weatherScore),
      regionRiskScore: roundScore(regionRiskScore),
      routeRiskScore,
      delayScore: roundScore(delayScore),
    },
  }
}

export function calculateRegionRisk(regions: Region[], nightDelivery: boolean) {
  const score =
    regions.reduce((sum, region) => {
      const regionScore =
        region.hillRatio * 22 +
        region.villaDensity * 18 +
        region.narrowRoadRatio * 20 +
        (region.accidentZoneCount / 6) * 16 +
        (region.schoolZoneCount / 3) * 8 +
        (region.parkingDifficulty / 100) * 10 +
        (nightDelivery ? region.nightVisibilityRisk / 100 : 0.4) * 6
      return sum + regionScore
    }, 0) / Math.max(regions.length, 1)

  return clamp(score)
}
