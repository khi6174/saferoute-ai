import { BarChart3, Gauge, Lightbulb, RadioTower } from 'lucide-react'
import type { ReactNode } from 'react'

export type DashboardTab = 'control' | 'analysis' | 'recommendation' | 'manager'

type Props = {
  activeTab: DashboardTab
  onChange: (tab: DashboardTab) => void
}

const tabs: { id: DashboardTab; label: string; description: string; icon: ReactNode }[] = [
  { id: 'control', label: '상황 관제', description: '실시간 현황', icon: <RadioTower size={18} /> },
  { id: 'analysis', label: '위험 분석', description: '원인과 경로', icon: <Gauge size={18} /> },
  { id: 'recommendation', label: '권장 조치', description: '안전 조정안', icon: <Lightbulb size={18} /> },
  { id: 'manager', label: '관리자 대시보드', description: '운영 영향', icon: <BarChart3 size={18} /> },
]

export function DashboardTabNavigation({ activeTab, onChange }: Props) {
  return (
    <nav
      className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-line bg-white p-2 shadow-sm sm:grid-cols-4"
      aria-label="대시보드 탭"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(tab.id)}
            className={`group relative flex min-h-16 items-center gap-3 overflow-hidden rounded-lg px-4 py-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-1 ${
              isActive
                ? 'bg-navy text-white shadow-md'
                : 'text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-navy'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                isActive ? 'bg-amber text-navy' : 'bg-slate-100 text-slate-500 group-hover:bg-amber/15 group-hover:text-amber'
              }`}
            >
              {tab.icon}
            </span>
            <span>
              <span className="block text-sm font-black">{tab.label}</span>
              <span className={`mt-0.5 block text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                {tab.description}
              </span>
            </span>
            {isActive ? <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-amber" /> : null}
          </button>
        )
      })}
    </nav>
  )
}
