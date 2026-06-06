import { Card } from '../../components/ui/Card'
import styles from './VarlikDagilimi.module.css'

const data = [
  { label: 'Hisseler', percent: 48, color: '#3b82f6' },
  { label: 'Döviz', percent: 22, color: '#10b981' },
  { label: 'Kripto', percent: 18, color: '#8b5cf6' },
  { label: 'Tahvil', percent: 12, color: '#f59e0b' },
]

export function VarlikDagilimi() {
  const total = 100
  let offset = 0
  const segments = data.map(({ percent, color }) => {
    const p = (percent / total) * 100
    const segment = { ...{ p, color }, offset }
    offset += p
    return segment
  })

  return (
    <Card title="Varlık Dağılımı">
      <p className={styles.totalAbove}>Toplam ₺ 2.450.000</p>
      <div className={styles.wrapper}>
        <div className={styles.chartWrap}>
          <div className={styles.glowDot} />
          <svg className={styles.donut} viewBox="0 0 36 36">
            {segments.map(({ p, color, offset }, i) => (
              <circle
                key={i}
                className={styles.segment}
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={`${p} ${100 - p}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 18 18)"
              />
            ))}
          </svg>
        </div>
        <div className={styles.legend}>
          <ul className={styles.list}>
            {data.map(({ label, percent, color }) => (
              <li key={label} className={styles.item}>
                <span className={styles.dot} style={{ background: color }} />
                <span>{label}</span>
                <span className={styles.percent}>{percent}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
