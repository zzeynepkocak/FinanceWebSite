import { useState, useEffect, useCallback } from 'react'
import { marketApi, fmtPrice, fmtChange } from '../../api/market'
import styles from './DashboardPiyasaOzeti.module.css'

const SEMBOLLER = ['USD/TRY', 'EUR/TRY', 'BIST 100', 'XAU/USD', 'BRENT']

interface SatirVeri {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
}

export function DashboardPiyasaOzeti() {
  const [rows, setRows] = useState<SatirVeri[]>([])
  const [loading, setLoading] = useState(true)
  const [sonGuncelleme, setSonGuncelleme] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const quotes = await marketApi.getQuotes(SEMBOLLER)
      const guncellendi: SatirVeri[] = SEMBOLLER.map((sym) => {
        const q = quotes[sym]
        if (!q || q.c === 0) {
          return { label: sym, value: '—', change: '—', trend: 'stable' as const }
        }
        return {
          label: sym,
          value: fmtPrice(q.c, sym.includes('BIST') ? 0 : 2),
          change: fmtChange(q.changePct),
          trend: q.changePct > 0 ? 'up' : q.changePct < 0 ? 'down' : 'stable',
        }
      })
      setRows(guncellendi)
      setSonGuncelleme(new Date().toLocaleTimeString('tr-TR'))
    } catch {
      // önceki veriyi koru
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30_000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Piyasa Özeti</h2>

      {loading ? (
        <div className={styles.loading}>Yükleniyor…</div>
      ) : (
        <ul className={styles.list}>
          {rows.map((item) => (
            <li key={item.label} className={styles.item}>
              <span>{item.label}</span>
              <div className={styles.valueContainer}>
                <span className={styles.value}>{item.value}</span>
                {item.change !== '—' && (
                  <span className={`${styles.change} ${styles[item.trend]}`}>
                    {item.change}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {sonGuncelleme && (
        <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.5rem', textAlign: 'right' }}>
          {sonGuncelleme} · 30 sn
        </p>
      )}
    </section>
  )
}
