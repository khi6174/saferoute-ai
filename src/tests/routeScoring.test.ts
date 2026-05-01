import { describe, expect, it } from 'vitest'
import { demoRoutes } from '../data/demoRoutes'
import { demoWeather } from '../data/demoWeather'
import { recommendRoute, scoreRoutes } from '../engine/routeScoring'

describe('routeScoring', () => {
  it('비는 경로 위험도를 증가시킨다', () => {
    const route = demoRoutes.find((item) => item.courierId === 'courier_001' && item.type === 'fastest')!
    const clear = scoreRoutes([route], demoWeather.find((item) => item.id === 'clear_day')!)[0]
    const rain = scoreRoutes([route], demoWeather.find((item) => item.id === 'rain_evening')!)[0]

    expect(rain.riskScore).toBeGreaterThan(clear.riskScore)
  })

  it('안전 경로가 더 느려도 위험 차이가 크면 추천된다', () => {
    const routes = scoreRoutes(
      demoRoutes.filter((item) => item.courierId === 'courier_001'),
      demoWeather.find((item) => item.id === 'rain_evening')!,
    )
    const recommended = recommendRoute(routes)

    expect(recommended.type).toBe('safe')
    expect(recommended.recommendationMessage).toContain('위험도')
  })
})
