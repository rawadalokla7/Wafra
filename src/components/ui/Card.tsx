import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
