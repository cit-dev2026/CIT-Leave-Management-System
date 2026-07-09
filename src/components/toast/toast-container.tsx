/**
 * src/components/toast/toast-container.tsx
 *
 * Display component for toast notifications.
 * Renders all active toasts with auto-dismiss functionality.
 */

import { X } from 'lucide-react'
import { useToast, ToastType } from '@/contexts/toast-context'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  const getToastStyles = (type: ToastType) => {
    const baseStyles =
      'rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 mb-2 animate-slide-in'
    const typeStyles: Record<ToastType, string> = {
      [ToastType.Success]: 'bg-green-50 border border-green-200',
      [ToastType.Error]: 'bg-red-50 border border-red-200',
      [ToastType.Warning]: 'bg-yellow-50 border border-yellow-200',
      [ToastType.Info]: 'bg-blue-50 border border-blue-200',
    }
    return `${baseStyles} ${typeStyles[type]}`
  }

  const getTextColor = (type: ToastType) => {
    const colors: Record<ToastType, string> = {
      [ToastType.Success]: 'text-green-800',
      [ToastType.Error]: 'text-red-800',
      [ToastType.Warning]: 'text-yellow-800',
      [ToastType.Info]: 'text-blue-800',
    }
    return colors[type]
  }

  const getIcon = (type: ToastType) => {
    const iconClass = 'w-5 h-5 flex-shrink-0 mt-0.5'
    const iconColors: Record<ToastType, string> = {
      [ToastType.Success]: 'text-green-600',
      [ToastType.Error]: 'text-red-600',
      [ToastType.Warning]: 'text-yellow-600',
      [ToastType.Info]: 'text-blue-600',
    }
    
    const iconElements: Record<ToastType, string> = {
      [ToastType.Success]: '✓',
      [ToastType.Error]: '!',
      [ToastType.Warning]: '⚠',
      [ToastType.Info]: 'ⓘ',
    }

    return (
      <div className={`${iconClass} ${iconColors[type]} font-bold flex items-center justify-center`}>
        {iconElements[type]}
      </div>
    )
  }

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {toasts.map((toast) => (
        <div key={toast.id} className={getToastStyles(toast.type)}>
          {getIcon(toast.type)}
          <div className="flex-1">
            <p className={`font-semibold ${getTextColor(toast.type)}`}>{toast.message}</p>
            {toast.description && (
              <p className={`text-sm mt-1 ${getTextColor(toast.type)} opacity-75`}>
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={`flex-shrink-0 mt-0.5 opacity-50 hover:opacity-100 transition-opacity ${getTextColor(toast.type)}`}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
