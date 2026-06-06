import styles from './AnalizTarihSecici.module.css'

const SECENEKLER = [
  { id: '1ay', label: 'Son 1 ay' },
  { id: '3ay', label: 'Son 3 ay' },
  { id: '1yil', label: '1 yıl' },
]

type Props = { value: string; onChange: (v: string) => void }

export function AnalizTarihSecici({ value, onChange }: Props) {
  return (
    <div className={styles.row}>
      <label className={styles.label}>Tarih:</label>
      <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {SECENEKLER.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
      <span className={styles.hint}>veya Başlangıç - Bitiş</span>
    </div>
  )
}
