import type { InputHTMLAttributes } from 'react'
import { cx } from './cx'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string | null
}

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="font-label text-[10px] uppercase tracking-[0.2em] text-muted"
        >
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        className={cx(
          'w-full rounded-lg border border-border/20 bg-cardHighest px-3 py-2.5 text-sm text-text placeholder:text-muted/60',
          'focus:border-accent/60 focus:outline-none',
          error ? 'border-danger/50' : '',
          className,
        )}
        {...props}
      />

      {error ? <p className="text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
}