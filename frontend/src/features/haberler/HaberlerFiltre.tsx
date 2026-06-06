import { useState } from 'react'
import styles from './HaberlerFiltre.module.css'

const KATEGORILER = ['Tümü', 'Ekonomi', 'Hisse', 'Döviz', 'Tahvil']

type Props = { kategori: string; onKategoriChange: (v: string) => void }

export function HaberlerFiltre({ kategori, onKategoriChange }: Props) {
  const [tarih, setTarih] = useState('')

  return (
    <div className={styles.bar}>
      <select
        className={styles.select}
        value={kategori || 'Tümü'}
        onChange={(e) => onKategoriChange(e.target.value === 'Tümü' ? '' : e.target.value)}
      >
        {KATEGORILER.map((k) => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>
      <input
        type="date"
        className={styles.input}
        value={tarih}
        onChange={(e) => setTarih(e.target.value)}
      />
      <button type="button" className={styles.btn}>Ara</button>
    </div>
  )
}
