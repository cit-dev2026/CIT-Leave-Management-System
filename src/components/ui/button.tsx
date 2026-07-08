import {
  type ButtonHTMLAttributes,
  forwardRef,
  type ForwardedRef,
  type ReactNode,
} from 'react'

import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'outline' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  leftIcon?: ReactNode
}

const variantClassNameMap: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--bg-accent)] text-white hover:opacity-95',
  outline:
    'border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

export const Button = forwardRef(function Button(
  { className, children, leftIcon, variant = 'primary', ...props }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClassNameMap[variant],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  )
})
