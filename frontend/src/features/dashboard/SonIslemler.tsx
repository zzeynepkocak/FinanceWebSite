import { Card } from '../../components/ui/Card'
import styles from './SonIslemler.module.css'

const items = [
  { asset: 'ASELS', type: 'Alım', detail: '₺ 43,80 - 250', value: '+₺ 420', positive: true },
  { asset: 'BTC/USD', type: 'Alım', detail: '$ 63.200 - 0,12', value: '+$ 184', positive: true },
  { asset: 'THYAO', type: 'Satım', detail: '₺ 288,10 - 200', value: '-₺ 520', positive: false },
  { asset: 'EUR/TRY', type: 'Alım', detail: '₺ 36,40 - 3.000', value: '+₺ 150', positive: true },
  { asset: 'GARAN', type: 'Satım', detail: '₺ 118,20 - 600', value: '-₺ 1.080', positive: false },
]

export function SonIslemler() {
  return (
    <Card
      title="Son Alım/Satım İşlemleri"
      action={<button type="button" className="outlineAccent">Bugün</button>}
    >
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <div className={styles.left}>
              <span className={styles.asset}>{item.asset}</span>
              <span className={styles.type}> - {item.type}</span>
            </div>
            <span className={styles.detail}>{item.detail}</span>
            <span className={item.positive ? styles.positive : styles.negative}>
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
