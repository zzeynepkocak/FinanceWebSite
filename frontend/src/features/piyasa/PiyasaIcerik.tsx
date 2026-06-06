import { useState } from 'react'
import styles from './PiyasaIcerik.module.css'

const periods = ['1G', '1A', '3A', '1Y', '5Y', 'Tümü']
const countries = [
  { name: 'Türkiye', code: 'BIST' },
  { name: 'ABD', code: 'NYSE' },
  { name: 'Almanya', code: 'XETRA' },
  { name: 'İngiltere', code: 'LSE' },
]

export function PiyasaIcerik() {
  const [period, setPeriod] = useState('1G')

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.chartHeader}>
          <span className={styles.trBadge}>TR</span>
          <h2 className={styles.chartSectionTitle}>Endeks</h2>
        </div>
        <div className={styles.chartArea}>
          <span className={styles.chartLabel}>Endeks - Gün İçi</span>
        </div>
        <div className={styles.periods}>
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              className={period === p ? styles.periodActive : styles.period}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Tüm dünya</h3>
        <p className={styles.sidebarMeta}>Ülkeler <strong>195</strong></p>
        <ul className={styles.countryList}>
          {countries.map((c) => (
            <li key={c.code} className={styles.countryItem}>
              <span>{c.name}</span>
              <span className={styles.code}>{c.code}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
