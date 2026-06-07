import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warn'

interface Toast {
  message: string
  type: ToastType
}

/**
 * Basit inline toast hook — her sayfada bağımsız kullanılır.
 * show() çağrılınca mesaj gösterilir, 3 saniye sonra otomatik kapanır.
 */
export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)

  const show = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const hide = useCallback(() => setToast(null), [])

  return { toast, show, hide }
}
