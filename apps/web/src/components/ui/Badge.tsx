import type { HTMLAttributes } from 'react'
import { cx } from './cx'

type BadgeVariant = 'default' | 'success' | 'danger' | 'info'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClass: Record<BadgeVariant, string> = {
  default: 'bg-cardHighest text-muted border-border/30',
  success: 'bg-success/10 text-success border-success/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
  info: 'bg-accent/10 text-accent border-accent/25',
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-2 py-0.5 font-label text-[10px] uppercase tracking-widest',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  )
}