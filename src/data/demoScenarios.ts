import type { DemoScenario } from '../engine/types'

export const demoScenarios: DemoScenario[] = [
  {
    id: 'safety_rain_peak',
    label: '관악구 우천 고위험 시나리오',
    description: '비 오는 퇴근 시간, 빌라 밀집 구역과 경사로 배송이 겹친 상황',
    weatherId: 'rain_evening',
    defaultCourierId: 'courier_001',
  },
  {
    id: 'snow_night_support',
    label: '눈 내린 야간 배송 시나리오',
    description: '시야 저하와 경사로 접근 위험이 높은 야간 배송 상황',
    weatherId: 'snow_night',
    defaultCourierId: 'courier_007',
  },
  {
    id: 'heatwave_rest',
    label: '폭염 휴식 권장 시나리오',
    description: '폭염으로 피로 점수가 높아져 휴식과 물량 조정이 필요한 상황',
    weatherId: 'heatwave_day',
    defaultCourierId: 'courier_005',
  },
  {
    id: 'normal_balance',
    label: '평상시 물량 균형 시나리오',
    description: '일반 배송일에서 지원 필요 기사를 조기에 확인하는 상황',
    weatherId: 'clear_day',
    defaultCourierId: 'courier_003',
  },
]
