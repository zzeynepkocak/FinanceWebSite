import styles from './PiyasaSekmeler.module.css'

export type PiyasaSekme = 'kurlar' | 'hisseler' | 'emtialar' | 'tahvil' | 'viop' | 'fonlar'

const SEKMELER: { id: PiyasaSekme; label: string }[] = [
  { id: 'kurlar', label: 'Kurlar' },
  { id: 'hisseler', label: 'Hisseler' },
  { id: 'emtialar', label: 'Emtialar' },
  { id: 'tahvil', label: 'Tahvil/Bono' },
  { id: 'viop', label: 'VIOP' },
  { id: 'fonlar', label: 'Fonlar' },
]

type Props = { sekme: PiyasaSekme; onSekmeChange: (s: PiyasaSekme) => void }

export function PiyasaSekmeler({ sekme, onSekmeChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Piyasa Verileri</h1>
      <div className={styles.tabs}>
        {SEKMELER.map((s) => (
          <button
            key={s.id}
            type="button"
            className={sekme === s.id ? styles.tabActive : styles.tab}
            onClick={() => onSekmeChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
