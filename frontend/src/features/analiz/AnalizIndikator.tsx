import styles from './AnalizIndikator.module.css'

type Props = {
  ma20: boolean
  ma50: boolean
  trend: boolean
  onMa20Change: (v: boolean) => void
  onMa50Change: (v: boolean) => void
  onTrendChange: (v: boolean) => void
}

export function AnalizIndikator({ ma20, ma50, trend, onMa20Change, onMa50Change, onTrendChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>İndikatör:</span>
      <label className={styles.checkbox}>
        <input type="checkbox" checked={ma20} onChange={(e) => onMa20Change(e.target.checked)} />
        MA(20)
      </label>
      <label className={styles.checkbox}>
        <input type="checkbox" checked={ma50} onChange={(e) => onMa50Change(e.target.checked)} />
        MA(50)
      </label>
      <label className={styles.checkbox}>
        <input type="checkbox" checked={trend} onChange={(e) => onTrendChange(e.target.checked)} />
        Trend
      </label>
    </div>
  )
}
