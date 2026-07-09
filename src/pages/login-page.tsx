import type { FormEvent, ChangeEventHandler } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'

/**
 * LoginPage Component
 *
 * HR authentication interface for CIT Leave Management System
 * Handles email/password login via Supabase Auth
 *
 * Features:
 * - Email and password input fields
 * - Client-side form validation
 * - Supabase authentication
 * - Loading state with disabled button
 * - Error message display
 * - Generic error messages (no user enumeration)
 *
 * Security:
 * - No Service Role Key used
 * - No manual JWT handling
 * - Supabase manages session lifecycle
 */
export function LoginPage() {
  const navigate = useNavigate()
  const { clearError } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>({})

  /**
   * Validate form inputs
   * Returns true if valid, false otherwise
   */
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format'
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  /**
   * Handle form submission
   * Calls Supabase auth.signInWithPassword()
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    clearError()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Call Supabase authentication
      // Do NOT use Service Role Key - this is public auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        // Generic error message - don't leak user enumeration
        setError('Invalid email or password')
        return
      }

      // Success: Auth context listener will detect SIGNED_IN event
      // State will update automatically via useAuth hook
      // Route guard (next card) will handle redirect to dashboard
      // For now, manually navigate
      void navigate('/dashboard', { replace: true })
    } catch {
      // Catch unexpected errors
      setError('Unable to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Clear validation error when user starts typing
   */
  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value)
    if (validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: undefined }))
    }
  }

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value)
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <Logo size="lg" showText={true} />
        </div>

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            void handleSubmit(e)
          }}
          className="surface-card rounded-lg p-8 shadow-lg border border-[var(--border-primary)]"
        >
          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="email"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="current-password"
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-300">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[var(--text-tertiary)]">
          <p>© 2024 CIT Global Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
