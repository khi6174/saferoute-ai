import type { Courier, Delivery, Recommendation, RiskResult, RouteResult, Weather } from './types'

export function generateRecommendations(
  courier: Courier,
  deliveries: Delivery[],
  risk: RiskResult,
  routes: RouteResult[],
  weather: Weather,
): Recommendation[] {
  if (risk.riskLevel === 'low' || risk.riskLevel === 'medium') {
    return [
      {
        id: `${courier.id}_monitor`,
        courierId: courier.id,
        type: 'schedule_adjustment',
        title: '현재 계획 유지 및 안전 모니터링',
        message: '현재 위험도는 관리 가능한 수준입니다. 긴급하지 않은 변경보다 휴식 간격과 날씨 변화를 계속 확인하는 것을 권장합니다.',
        expectedRiskBefore: risk.riskScore,
        expectedRiskAfter: Math.max(0, risk.riskScore - 3),
        affectedDeliveries: [],
        actions: ['다음 휴식 예정 시간 확인', '우선순위 배송만 시간 창 유지', '날씨 변화 시 안전 경로 재검토'],
      },
    ]
  }

  const safeRoute = routes.find((route) => route.type === 'safe') ?? routes[0]
  const normalDeliveries = deliveries.filter((delivery) => delivery.priority === 'normal').slice(0, 8)
  const highRiskDeliveries = deliveries
    .filter((delivery) => delivery.hillAccess || delivery.narrowRoadAccess || delivery.parkingDifficulty >= 75)
    .slice(0, 10)

  const reduction = risk.riskLevel === 'critical' ? 24 : 16
  const recommendations: Recommendation[] = [
    {
      id: `${courier.id}_safe_route`,
      courierId: courier.id,
      type: 'safe_route',
      title: '안전 경로 추천',
      message: `${safeRoute.label}는 시간이 더 걸릴 수 있지만 급경사, 좁은 골목, 사고 다발 구역을 줄여 현재 조건에서 더 안전합니다.`,
      expectedRiskBefore: risk.riskScore,
      expectedRiskAfter: Math.max(0, risk.riskScore - Math.round(reduction * 0.45)),
      affectedDeliveries: highRiskDeliveries.slice(0, 5).map((delivery) => delivery.id),
      actions: ['최단 경로 대신 안전 경로 선택', '급경사 구간 우회', '좁은 골목 진입 전 주정차 가능 지점 확인'],
    },
    {
      id: `${courier.id}_redistribution`,
      courierId: courier.id,
      type: 'redistribution',
      title: '물량 분산 추천',
      message: `일반 배송 ${normalDeliveries.length}건을 인근 저위험 기사에게 분산하면 시간 압박과 피로 누적을 낮출 수 있습니다.`,
      expectedRiskBefore: risk.riskScore,
      expectedRiskAfter: Math.max(0, risk.riskScore - reduction),
      affectedDeliveries: normalDeliveries.map((delivery) => delivery.id),
      actions: [`일반 배송 ${normalDeliveries.length}건 분산`, '긴급 배송은 기존 기사에게 유지', '분산 후 고객 안내 메시지 발송'],
    },
    {
      id: `${courier.id}_rest`,
      courierId: courier.id,
      type: 'rest',
      title: '휴식 권장',
      message: `마지막 휴식 후 ${courier.lastBreakMinutesAgo}분이 지났습니다. 다음 3건 배송 전 10분 휴식을 권장합니다.`,
      expectedRiskBefore: risk.riskScore,
      expectedRiskAfter: Math.max(0, risk.riskScore - 10),
      affectedDeliveries: [],
      actions: ['10분 휴식 권장', '휴식 후 경사로 구역 진입', '폭염 또는 우천 시 수분/장비 상태 확인'],
    },
  ]

  if (weather.rainLevel > 0.5 || courier.nightDelivery) {
    recommendations.push({
      id: `${courier.id}_reorder`,
      courierId: courier.id,
      type: 'schedule_adjustment',
      title: '배송 순서 재조정',
      message: '우천 또는 야간에 위험도가 높은 언덕/빌라 구역은 더 늦어지기 전에 먼저 처리하고, 일반 배송은 뒤로 조정하는 것을 권장합니다.',
      expectedRiskBefore: risk.riskScore,
      expectedRiskAfter: Math.max(0, risk.riskScore - 14),
      affectedDeliveries: highRiskDeliveries.map((delivery) => delivery.id),
      actions: ['언덕/빌라 밀집 구역 선배송', '저우선순위 일반 배송 후순위 이동', '야간 진입 전 안전 경로 재확인'],
    })
  }

  if (normalDeliveries.length > 0) {
    recommendations.push({
      id: `${courier.id}_delay`,
      courierId: courier.id,
      type: 'delay',
      title: '저우선순위 배송 지연 권장',
      message: '긴급 배송이 아닌 일반 배송 일부를 지연 안내하면 무리한 속도 경쟁 없이 안전 여유를 확보할 수 있습니다.',
      expectedRiskBefore: risk.riskScore,
      expectedRiskAfter: Math.max(0, risk.riskScore - 12),
      affectedDeliveries: normalDeliveries.slice(0, 5).map((delivery) => delivery.id),
      actions: ['일반 배송 5건 지연 안내', '긴급 배송과 시간 지정 배송은 유지', '고위험 구역 진입 전 배송 밀도 완화'],
    })
  }

  return recommendations.sort((a, b) => a.expectedRiskAfter - b.expectedRiskAfter)
}
