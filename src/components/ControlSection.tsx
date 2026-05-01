import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  tone?: 'default' | 'amber' | 'danger' | 'navy'
  children: ReactNode
  className?: string
}

const toneClasses = {
  default: 'border-line bg-card',
  amber: 'border-amber/35 bg-amber/5',
  danger: 'border-danger/30 bg-red-50',
  navy: 'border-slate-700 bg-navy text-white',
}

export function ControlSection({
  title,
  description,
  icon,
  action,
  tone = 'default',
  children,
  className = '',
}: Props) {
  const isNavy = tone === 'navy'

  return (
    <section className={`rounded-lg border p-4 shadow-sm ${toneClasses[tone]} ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {icon ? <span className={`mt-0.5 ${isNavy ? 'text-amber' : 'text-amber'}`}>{icon}</span> : null}
          <div>
            <h2 className={`text-lg font-bold ${isNavy ? 'text-white' : 'text-ink'}`}>{title}</h2>
            {description ? (
              <p className={`mt-1 text-sm leading-6 ${isNavy ? 'text-slate-200' : 'text-slate-600'}`}>{description}</p>
            ) : null}
          </div>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
