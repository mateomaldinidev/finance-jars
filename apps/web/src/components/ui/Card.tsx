import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './cx'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
  rightSlot?: ReactNode
}

export function Card({ title, subtitle, rightSlot, className, children, ...props }: CardProps) {
  return (
    <article
      className={cx('rounded-xl border border-border/20 bg-card p-4 md:p-5', className)}
      {...props}
    >
      {title || subtitle || rightSlot ? (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="m-0 text-base font-semibold text-text">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          {rightSlot}
        </header>
      ) : null}
      {children}
    </article>
  )
}