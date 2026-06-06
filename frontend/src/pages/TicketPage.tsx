import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../api/client'
import styles from './TicketPage.module.css'

/* ── Types ──────────────────────────────────────────────────── */
type Status   = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface ServiceTicket {
  id: number
  title: string
  description: string
  userId: string
  assignedTo: string | null
  status: Status
  priority: Priority
  category: string | null
  resolutionNote: string | null
  createdAt: string
  updatedAt: string | null
}

/* ── Helpers ────────────────────────────────────────────────── */
const STATUS_TR: Record<Status, string> = {
  OPEN:        'Açık',
  ASSIGNED:    'Atandı',
  IN_PROGRESS: 'İşlemde',
  RESOLVED:    'Çözüldü',
  CLOSED:      'Kapatıldı',
  REJECTED:    'Reddedildi',
}

const STATUS_COLOR: Record<Status, string> = {
  OPEN:        styles.statusOpen,
  ASSIGNED:    styles.statusAssigned,
  IN_PROGRESS: styles.statusInProgress,
  RESOLVED:    styles.statusResolved,
  CLOSED:      styles.statusClosed,
  REJECTED:    styles.statusRejected,
}

const PRIORITY_TR: Record<Priority, string> = {
  LOW: 'Düşük', MEDIUM: 'Orta', HIGH: 'Yüksek', CRITICAL: 'Kritik',
}

const PRIORITY_COLOR: Record<Priority, string> = {
  LOW:      styles.prioLow,
  MEDIUM:   styles.prioMedium,
  HIGH:     styles.prioHigh,
  CRITICAL: styles.prioCritical,
}

const CATEGORIES = ['Erişim', 'Donanım', 'Yazılım', 'Ağ', 'Güvenlik', 'Diğer']

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/* ── Component ──────────────────────────────────────────────── */
export function TicketPage() {
  const [tickets, setTickets]       = useState<ServiceTicket[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [showForm, setShowForm]     = useState(false)
  const [selected, setSelected]     = useState<ServiceTicket | null>(null)
  const [filterStatus, setFilter]   = useState<string>('TUMU')

  /* new ticket form */
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM', category: 'Yazılım',
  })
  const [formSaving, setFormSaving] = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await apiFetch<ServiceTicket[]>('/api/v1/tickets')
      setTickets(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ticket listesi alınamadı')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setFormError('Başlık zorunlu'); return }
    setFormSaving(true); setFormError(null)
    try {
      await apiFetch<ServiceTicket>('/api/v1/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setShowForm(false)
      setForm({ title: '', description: '', priority: 'MEDIUM', category: 'Yazılım' })
      await fetchTickets()
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Talep oluşturulamadı')
    } finally {
      setFormSaving(false)
    }
  }

  const filtered = filterStatus === 'TUMU'
    ? tickets
    : tickets.filter(t => t.status === filterStatus)

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Servis Talepleri</h1>
          <span className={styles.subtitle}>BT destek taleplerinizi buradan takip edebilirsiniz</span>
        </div>
        <button className={styles.newBtn} onClick={() => { setShowForm(true); setSelected(null) }}>
          + Yeni Talep
        </button>
      </div>

      {/* ── Status filter tabs ── */}
      <div className={styles.filterTabs}>
        {['TUMU', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
          <button
            key={s}
            className={`${styles.filterTab} ${filterStatus === s ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'TUMU' ? 'Tümü' : STATUS_TR[s as Status]}
            <span className={styles.filterCount}>
              {s === 'TUMU' ? tickets.length : tickets.filter(t => t.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {loading && <div className={styles.loading}>Yükleniyor...</div>}
      {error   && <div className={styles.error}>{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📋</span>
          <span>Henüz servis talebi bulunmuyor</span>
          <button className={styles.emptyBtn} onClick={() => setShowForm(true)}>İlk Talebini Oluştur</button>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className={styles.ticketGrid}>
          {filtered.map(t => (
            <div
              key={t.id}
              className={`${styles.ticketCard} ${selected?.id === t.id ? styles.ticketCardActive : ''}`}
              onClick={() => setSelected(selected?.id === t.id ? null : t)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.ticketId}>#{t.id}</span>
                <span className={`${styles.statusBadge} ${STATUS_COLOR[t.status]}`}>
                  {STATUS_TR[t.status]}
                </span>
                <span className={`${styles.prioBadge} ${PRIORITY_COLOR[t.priority]}`}>
                  {PRIORITY_TR[t.priority]}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{t.title}</h3>

              <div className={styles.cardMeta}>
                {t.category && <span className={styles.metaTag}>{t.category}</span>}
                <span className={styles.metaDate}>{fmtDate(t.createdAt)}</span>
              </div>

              {/* expanded detail */}
              {selected?.id === t.id && (
                <div className={styles.cardDetail}>
                  {t.description && <p className={styles.detailDesc}>{t.description}</p>}
                  {t.assignedTo   && <p className={styles.detailMeta}>Atanan: <b>{t.assignedTo}</b></p>}
                  {t.resolutionNote && (
                    <div className={styles.resolutionNote}>
                      <b>Çözüm Notu:</b>
                      <p>{t.resolutionNote}</p>
                    </div>
                  )}
                  {t.updatedAt && <p className={styles.detailMeta}>Son güncelleme: {fmtDate(t.updatedAt)}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── New Ticket Modal ── */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Yeni Servis Talebi</h2>
              <button className={styles.closeBtn} onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {formError && <div className={styles.formError}>{formError}</div>}

              <label className={styles.label}>
                Başlık *
                <input
                  className={styles.input}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Sorunu kısaca açıklayın"
                  maxLength={255}
                />
              </label>

              <div className={styles.formRow}>
                <label className={styles.label}>
                  Kategori
                  <select
                    className={styles.select}
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>

                <label className={styles.label}>
                  Öncelik
                  <select
                    className={styles.select}
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  >
                    {Object.entries(PRIORITY_TR).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={styles.label}>
                Açıklama
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Sorunu detaylı açıklayın..."
                  rows={5}
                />
              </label>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>
                  İptal
                </button>
                <button type="submit" className={styles.submitBtn} disabled={formSaving}>
                  {formSaving ? 'Gönderiliyor...' : 'Talebi Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
