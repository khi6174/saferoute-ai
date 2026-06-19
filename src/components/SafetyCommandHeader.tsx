import { AlertTriangle, CloudRain, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react'
import type { DemoScenario, Weather } from '../engine/types'
import { CORE_MESSAGE, RESPONSIBILITY_MESSAGE } from '../utils/constants'

type Props = {
  scenario: DemoScenario
  weather: Weather
  summary: {
    averageRisk: number
    highRiskCourierCount: number
    improvement: number
  }
}

export function SafetyCommandHeader({ scenario, weather, summary }: Props) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-navy via-slate-900 to-slate-800 text-white">
      <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-amber/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-7 md:py-9">
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.65fr)]">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber text-navy shadow-lg shadow-amber/20">
                <ShieldCheck size={26} strokeWidth={2.5} />
              </span>
              <div>
                <div className="text-xs font-black uppercase tracking-[0.28em] text-amber">Safe Route AI</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Sparkles size={14} className="text-amber" />
                  Last-Mile Safety Operations Copilot
                </div>
              </div>
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              더 빠른 배송보다,
              <span className="block text-amber">더 안전한 의사결정</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-200 md:text-base">{CORE_MESSAGE}</p>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">{RESPONSIBILITY_MESSAGE}</p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-sm md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-amber">현재 위험 현황</p>
                <p className="mt-1 text-sm text-slate-300">운영 안전 핵심 지표</p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                위험도 엔진 분석 중
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <HeroMetric icon={<ShieldCheck size={16} />} label="평균 위험도" value={`${summary.averageRisk}점`} tone="amber" />
              <HeroMetric icon={<AlertTriangle size={16} />} label="지원 필요" value={`${summary.highRiskCourierCount}명`} tone="danger" />
              <HeroMetric icon={<TrendingDown size={16} />} label="감소 예상" value={`-${summary.improvement}점`} tone="success" />
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-black/15 p-3">
              <CloudRain size={18} className="mt-0.5 shrink-0 text-blue-300" />
              <div>
                <p className="text-sm font-bold text-white">{scenario.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">{weather.label} · {weather.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function HeroMetric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'amber' | 'danger' | 'success'
}) {
  const toneClasses = {
    amber: 'text-amber',
    danger: 'text-red-300',
    success: 'text-emerald-300',
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3">
      <div className={`flex items-center gap-1.5 ${toneClasses[tone]}`}>
        {icon}
        <span className="text-[11px] font-bold text-slate-300">{label}</span>
      </div>
      <div className="mt-2 text-xl font-black text-white md:text-2xl">{value}</div>
    </div>
  )
}
