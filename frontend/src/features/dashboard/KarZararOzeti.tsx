import { Card } from '../../components/ui/Card'
import styles from './KarZararOzeti.module.css'

export function KarZararOzeti() {
  return (
    <Card
      title="Kar/Zarar Özeti"
      action={<button type="button" className="outlineAccent">Son 7 gün</button>}
    >
      <div className={styles.placeholder}>
        Grafik veya özet verisi burada gösterilecek.
      </div>
    </Card>
  )
}
