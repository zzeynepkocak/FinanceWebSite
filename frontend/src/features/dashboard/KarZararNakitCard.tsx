import { Card } from '../../components/ui/Card'
import styles from './KarZararNakitCard.module.css'

export function KarZararNakitCard() {
  return (
    <Card action={<button type="button" className="outlineAccent">Güncel</button>}>
      <div className={styles.section}>
        <p className={styles.label}>Günlük Kar/Zarar</p>
        <p className={styles.valuePositive}>+₺ 28.450</p>
        <p className={styles.percentPositive}>+1,24%</p>
      </div>
      <div className={styles.section}>
        <p className={styles.label}>Toplam Kar/Zarar</p>
        <p className={styles.valuePositive}>+₺ 182.300</p>
        <p className={styles.percentPositive}>+8,05%</p>
      </div>
      <div className={styles.section}>
        <p className={styles.label}>Nakit Pozisyon</p>
        <p className={styles.value}>₺ 310.200</p>
        <p className={styles.muted}>Son güncelleme 10:45</p>
      </div>
    </Card>
  )
}
