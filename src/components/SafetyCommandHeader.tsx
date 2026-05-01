import { CloudRain, ShieldCheck } from 'lucide-react'
import type { DemoScenario, Weather } from '../engine/types'
import { CORE_MESSAGE } from '../utils/constants'

type Props = {
  scenario: DemoScenario
  weather: Weather
}

export function SafetyCommandHeader({ scenario, weather }: Props) {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber">
              <ShieldCheck size={24} />
              <span className="text-sm font-black uppercase tracking-wide">SafeRoute AI Control</span>
            </div>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">택배 안전 의사결정 관제 대시보드</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{CORE_MESSAGE}</p>
          </div>
          <div className="min-w-72 rounded-lg border border-slate-600 bg-white/8 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-amber">
              <CloudRain size={18} />
              현재 시나리오
            </div>
            <p className="mt-2 font-bold text-white">{scenario.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">{weather.label} · {weather.description}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
