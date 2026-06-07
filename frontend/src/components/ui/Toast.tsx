import type { ToastType } from '../../hooks/useToast'

interface ToastProps {
  message: string
  type: ToastType
}

const STYLES: Record<ToastType, { bg: string; color: string; border: string; icon: string }> = {
  success: { bg: 'rgba(0,212,170,0.12)', color: 'var(--profit)',  border: 'var(--profit)',  icon: '✓' },
  error:   { bg: 'rgba(229,62,62,0.12)',  color: 'var(--loss)',    border: 'var(--loss)',    icon: '✕' },
  warn:    { bg: 'rgba(240,180,41,0.12)', color: 'var(--warning)', border: 'var(--warning)', icon: '⚠' },
  info:    { bg: 'rgba(0,102,255,0.12)',  color: '#0066ff',        border: '#0066ff',        icon: 'ℹ' },
}

/**
 * Inline toast mesajı — useToast() hook'uyla birlikte kullanılır.
 * Sayfa içinde istenen yere yerleştirin.
 */
export function Toast({ message, type }: ToastProps) {
  const s = STYLES[type]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: '8px', padding: '0.6rem 1rem',
      fontSize: '0.82rem', color: s.color, fontWeight: 500,
      marginBottom: '0.75rem', animation: 'fadeIn 0.2s ease',
    }}>
      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.icon}</span>
      {message}
    </div>
  )
}
