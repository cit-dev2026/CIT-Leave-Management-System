import logoImage from '@/assets/logo.jpg'

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  alt?: string
  className?: string
}

export function Logo({ size = 'md', showText = true, alt = 'CIT Logo', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={logoImage} alt={alt} className={`rounded-lg object-cover ${sizeClasses[size]}`} />
      {showText && (
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Enterprise</p>
          <h1 className="text-lg font-bold">CIT HRMS</h1>
        </div>
      )}
    </div>
  )
}
