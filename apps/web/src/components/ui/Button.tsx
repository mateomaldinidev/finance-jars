import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-tr from-[#c6c6c7] to-[#454747] text-[#3f4041] border border-transparent hover:opacity-90',
  ghost:
    'bg-transparent text-text border border-border/30 hover:border-accent/40 hover:text-accent',
  subtle:
    'bg-cardHighest text-text border border-border/20 hover:bg-cardHigh',
  danger:
    'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-label tracking-widest uppercase',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-5 py-3 text-sm font-medium',
}

export function Button({
  className,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  )
}