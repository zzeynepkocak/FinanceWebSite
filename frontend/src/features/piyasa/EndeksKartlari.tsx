import { useState, useEffect, useCallback } from 'react'
import { marketApi, fmtPrice, fmtChange } from '../../api/market'
import styles from './EndeksKartlari.module.css'

const ENDEKSLER = [
  { display: 'BIST 100', label: 'BIST 100' },
  { display: 'BIST 50',  label: 'BIST 50'  },
  { display: 'BIST 30',  label: 'BIST 30'  },
]

interface Kart {
  name: string
  value: string
  change: string
  positive: boolean
  yukleniyor?: boolean
}

const YUKLE_KARTLARI: Kart[] = ENDEKSLER.map((e) => ({
  name: e.label,
  value: '—',
  change: '—',
  positive: true,
  yukleniyor: true,
}))

export function EndeksKartlari() {
  const [kartlar, setKartlar] = useState<Kart[]>(YUKLE_KARTLARI)
  const [sonGuncelleme, setSonGuncelleme] = useState<string>('')

  const fetchEndeksler = useCallback(async () => {
    try {
      const quotes = await marketApi.getQuotes(ENDEKSLER.map((e) => e.display))

      const guncellendi = ENDEKSLER.map((e) => {
        const q = quotes[e.display]
        if (!q || q.c === 0) {
          return { name: e.label, value: '—', change: '—', positive: true, yukleniyor: false }
        }
        return {
          name: e.label,
          value: fmtPrice(q.c, 2),
          change: fmtChange(q.changePct),
          positive: q.changePct >= 0,
          yukleniyor: false,
        }
      })

      setKartlar(guncellendi)
      setSonGuncelleme(new Date().toLocaleTimeString('tr-TR'))
    } catch {
      // önceki veriyi koru
    }
  }, [])

  useEffect(() => {
    fetchEndeksler()
    const interval = setInterval(fetchEndeksler, 30_000)
    return () => clearInterval(interval)
  }, [fetchEndeksler])

  return (
    <div>
      <div className={styles.grid}>
        {kartlar.map((card) => (
          <div key={card.name} className={styles.card}>
            <div className={styles.row1}>
              <span className={styles.name}>{card.name}</span>
              {card.yukleniyor ? (
                <span className={styles.loading}>…</span>
              ) : (
                <span className={card.positive ? styles.positive : styles.negative}>
                  {card.change}
                </span>
              )}
            </div>
            <div className={styles.value}>
              {card.yukleniyor ? <span className={styles.skeleton}>——————</span> : card.value}
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{
                  width: '70%',
                  background: card.positive
                    ? 'linear-gradient(90deg,#276749,#48bb78,transparent)'
                    : 'linear-gradient(90deg,#c53030,#dd6b20,transparent)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {sonGuncelleme && (
        <p style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.35rem', textAlign: 'right' }}>
          Son güncelleme: {sonGuncelleme} · otomatik yenileme 30 sn
        </p>
      )}
    </div>
  )
}
