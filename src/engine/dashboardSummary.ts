import type { Courier, Recommendation, RiskResult } from './types'

export function buildDashboardSummary(
  couriers: Courier[],
  risks: RiskResult[],
  recommendations: Recommendation[],
) {
  const averageRisk = Math.round(
    risks.reduce((sum, risk) => sum + risk.riskScore, 0) / Math.max(risks.length, 1),
  )
  const highRiskCouriers = risks.filter((risk) => risk.riskScore >= 60)
  const bestRecommendation = recommendations[0]
  const before = bestRecommendation?.expectedRiskBefore ?? averageRisk
  const after = bestRecommendation?.expectedRiskAfter ?? averageRisk
  const redistributedPackages =
    recommendations.find((recommendation) => recommendation.type === 'redistribution')?.affectedDeliveries.length ?? 0
  const delayedDeliveries =
    recommendations.find((recommendation) => recommendation.type === 'delay')?.affectedDeliveries.length ?? 0

  return {
    totalCouriers: couriers.length,
    averageRisk,
    highRiskCourierCount: highRiskCouriers.length,
    beforeRisk: before,
    afterRisk: after,
    improvement: Math.max(0, before - after),
    redistributedPackages,
    delayedDeliveries,
    restRecommended: recommendations.some((recommendation) => recommendation.type === 'rest'),
  }
}
