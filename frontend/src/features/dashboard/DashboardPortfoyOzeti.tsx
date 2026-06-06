import { useState, useEffect } from 'react'
import { assetsApi } from '../../api/assets'
import styles from './DashboardPortfoyOzeti.module.css'

export function DashboardPortfoyOzeti() {
  const [toplamMaliyet, setToplamMaliyet] = useState<number | null>(null)
  const [varlikSayisi, setVarlikSayisi]   = useState<number>(0)
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    assetsApi.getMyAssets().then((assets) => {
      const toplam = assets.reduce(
        (acc, a) => acc + (a.purchasePrice ?? 0) * (a.quantity ?? 0),
        0,
      )
      setToplamMaliyet(toplam)
      setVarlikSayisi(assets.length)
    }).catch(() => {
      // backend henüz erişilemez
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Portföy Özeti</h2>
      {loading ? (
        <div className={styles.summary}>
          <span className={styles.label}>Yükleniyor…</span>
        </div>
      ) : toplamMaliyet !== null && varlikSayisi > 0 ? (
        <div className={styles.summary}>
          <span className={styles.label}>Maliyet Bedeli:</span>
          <span className={styles.value}>{fmt(toplamMaliyet)} TL</span>
          <span className={styles.change} style={{ color: '#666', fontSize: '0.8rem' }}>
            {varlikSayisi} varlık
          </span>
        </div>
      ) : (
        <div className={styles.summary}>
          <span className={styles.label}>Henüz varlık eklenmedi.</span>
        </div>
      )}
    </section>
  )
}
