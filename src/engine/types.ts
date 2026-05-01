export type VehicleType = 'truck' | 'van' | 'motorcycle' | 'ev'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type WeatherCondition = 'clear' | 'rain' | 'snow' | 'heatwave' | 'strong_wind'
export type Priority = 'normal' | 'time_window' | 'urgent'
export type BuildingType = 'apartment' | 'villa' | 'office' | 'store' | 'house'

export type Courier = {
  id: string
  name: string
  vehicleType: VehicleType
  shiftStart: string
  workingHours: number
  completedDeliveries: number
  remainingDeliveries: number
  totalDistanceKm: number
  delayMinutes: number
  lastBreakMinutesAgo: number
  nightDelivery: boolean
  assignedRegionIds: string[]
}

export type Delivery = {
  id: string
  courierId: string
  regionId: string
  addressLabel: string
  buildingType: BuildingType
  priority: Priority
  estimatedServiceMinutes: number
  parkingDifficulty: number
  hasElevator: boolean
  hillAccess: boolean
  narrowRoadAccess: boolean
  scheduledTimeWindow?: string
}

export type Region = {
  id: string
  name: string
  hillRatio: number
  villaDensity: number
  narrowRoadRatio: number
  schoolZoneCount: number
  accidentZoneCount: number
  parkingDifficulty: number
  nightVisibilityRisk: number
  mapX: number
  mapY: number
}

export type Weather = {
  id: string
  label: string
  condition: WeatherCondition
  rainLevel: number
  snowFlag: boolean
  heatWaveFlag: boolean
  windLevel: number
  temperatureCelsius: number
  visibilityLevel: number
  description: string
}

export type RouteCandidate = {
  id: string
  courierId: string
  type: 'fastest' | 'safe' | 'balanced'
  label: string
  estimatedMinutes: number
  distanceKm: number
  accidentZoneCount: number
  hillSections: number
  narrowRoadSections: number
  schoolZoneCount: number
  parkingDifficulty: number
  nightVisibilityRisk: number
  regionIds: string[]
}

export type RiskFactor = {
  factor: string
  label: string
  value: string | number
  score: number
  impact: 'info' | 'medium' | 'high' | 'critical'
  message: string
}

export type RiskResult = {
  courierId: string
  riskScore: number
  riskLevel: RiskLevel
  riskLevelLabel: string
  factors: RiskFactor[]
  scores: {
    loadScore: number
    fatigueScore: number
    timePressureScore: number
    weatherScore: number
    regionRiskScore: number
    routeRiskScore: number
    delayScore: number
  }
}

export type RouteResult = RouteCandidate & {
  riskScore: number
  safetyScore: number
  recommendationMessage: string
}

export type Recommendation = {
  id: string
  courierId: string
  type:
    | 'safe_route'
    | 'schedule_adjustment'
    | 'redistribution'
    | 'delay'
    | 'rest'
  title: string
  message: string
  expectedRiskBefore: number
  expectedRiskAfter: number
  affectedDeliveries: string[]
  actions: string[]
}

export type DemoScenario = {
  id: string
  label: string
  description: string
  weatherId: string
  defaultCourierId: string
}
