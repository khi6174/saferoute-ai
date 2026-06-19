import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  size?: 'default' | 'compact'
  icon?: ReactNode
}

const variantClasses = {
  primary:
    'border-navy bg-navy text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500',
  secondary:
    'border-line bg-white text-navy shadow-sm hover:-translate-y-0.5 hover:border-amber hover:bg-amber/5 disabled:bg-slate-100 disabled:text-slate-400',
}

const sizeClasses = {
  default: 'min-h-12 px-5 py-3 text-sm',
  compact: 'min-h-10 px-4 py-2 text-sm',
}

export function ActionButton({
  variant = 'primary',
  size = 'default',
  icon,
  className = '',
  children,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border font-black transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
