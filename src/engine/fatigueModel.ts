import type { Courier } from './types'
import { clamp, roundScore } from '../utils/formatters'

export function calculateFatigueScore(courier: Courier) {
  const workingHoursComponent = clamp((courier.workingHours / 10) * 34)
  const distanceComponent = clamp((courier.totalDistanceKm / 130) * 22)
  const completedComponent = clamp((courier.completedDeliveries / 90) * 18)
  const breakComponent = clamp((courier.lastBreakMinutesAgo / 240) * 18)
  const delayComponent = clamp((courier.delayMinutes / 45) * 8)

  return roundScore(
    workingHoursComponent +
      distanceComponent +
      completedComponent +
      breakComponent +
      delayComponent,
  )
}
