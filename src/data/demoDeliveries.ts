import type { Delivery } from '../engine/types'

const courierPlans = [
  ['courier_001', 'gwanak_villa_a', 36],
  ['courier_001', 'gwanak_hill_b', 28],
  ['courier_002', 'bundang_apt_b', 42],
  ['courier_003', 'gangnam_store_c', 34],
  ['courier_003', 'mapo_office_d', 27],
  ['courier_004', 'bundang_apt_b', 38],
  ['courier_005', 'gwanak_villa_a', 32],
  ['courier_005', 'gangnam_store_c', 30],
  ['courier_006', 'mapo_office_d', 31],
  ['courier_007', 'gwanak_hill_b', 44],
  ['courier_008', 'gangnam_store_c', 35],
] as const

const regionLabels: Record<string, string> = {
  gwanak_villa_a: '관악구 빌라 밀집 구역 A',
  gwanak_hill_b: '관악구 경사로 주거 구역 B',
  gangnam_store_c: '강남구 상가 구역 C',
  bundang_apt_b: '분당구 아파트 단지 B',
  mapo_office_d: '마포구 오피스 구역 D',
}

export const demoDeliveries: Delivery[] = courierPlans.flatMap(
  ([courierId, regionId, count], planIndex) =>
    Array.from({ length: count }, (_, index) => {
      const sequence = index + 1
      const isVilla = regionId.includes('villa') || regionId.includes('hill')
      const isStore = regionId.includes('store') || regionId.includes('office')
      const priority = sequence % 17 === 0 ? 'urgent' : sequence % 5 === 0 ? 'time_window' : 'normal'

      return {
        id: `delivery_${planIndex + 1}_${String(sequence).padStart(3, '0')}`,
        courierId,
        regionId,
        addressLabel: `${regionLabels[regionId]}-${String(sequence).padStart(2, '0')}`,
        buildingType: isVilla ? 'villa' : isStore ? 'store' : 'apartment',
        priority,
        estimatedServiceMinutes: isVilla ? 6 + (sequence % 4) : 4 + (sequence % 3),
        parkingDifficulty: isVilla ? 72 + (sequence % 20) : isStore ? 64 + (sequence % 18) : 32 + (sequence % 14),
        hasElevator: !isVilla || sequence % 3 === 0,
        hillAccess: isVilla || regionId.includes('hill'),
        narrowRoadAccess: isVilla || sequence % 4 === 0,
        scheduledTimeWindow: priority === 'time_window' ? '16:00-18:00' : undefined,
      } satisfies Delivery
    }),
)
