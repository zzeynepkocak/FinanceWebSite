import { useState, useEffect } from 'react'
import { marketApi, type FinnhubNews } from '../../api/market'
import styles from './DashboardSonHaberler.module.css'

export function DashboardSonHaberler() {
  const [haberler, setHaberler] = useState<FinnhubNews[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    marketApi.getNews('general').then((data) => {
      // En güncel 5 haber
      setHaberler(data.slice(0, 5))
    }).catch(() => {
      setHaberler([])
    }).finally(() => {
      setLoading(false)
    })

    // 5 dakikada bir yenile
    const interval = setInterval(() => {
      marketApi.getNews('general').then((data) => setHaberler(data.slice(0, 5))).catch(() => {})
    }, 300_000)
    return () => clearInterval(interval)
  }, [])

  const fmtTarih = (unix: number) =>
    new Date(unix * 1000).toLocaleDateString('tr-TR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Son Haberler</h2>

      {loading ? (
        <div className={styles.loading}>Yükleniyor…</div>
      ) : haberler.length === 0 ? (
        <div className={styles.empty}>Haber bulunamadı.</div>
      ) : (
        <ul className={styles.list}>
          {haberler.map((h) => (
            <li key={h.id} className={styles.item}>
              <a
                href={h.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {h.headline}
              </a>
              <span className={styles.meta}>
                {h.source} · {fmtTarih(h.datetime)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
