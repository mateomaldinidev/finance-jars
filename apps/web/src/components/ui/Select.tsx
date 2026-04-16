import type { SelectHTMLAttributes } from 'react'
import { cx } from './cx'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string | null
}

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const selectId = id || props.name

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={selectId}
          className="font-label text-[10px] uppercase tracking-[0.2em] text-muted"
        >
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        className={cx(
          'w-full appearance-none rounded-lg border border-border/20 bg-cardHighest px-3 py-2.5 text-sm text-text',
          'focus:border-accent/60 focus:outline-none',
          error ? 'border-danger/50' : '',
          className,
        )}
        {...props}
      >
        {children}
      </select>

      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  )
}