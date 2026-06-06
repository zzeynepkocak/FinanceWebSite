import styles from './PortfoyDetayDagilim.module.css'

export function PortfoyDetayDagilim() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Dağılım</h2>
      <div className={styles.content}>
        <div className={styles.chart}>Pasta grafik: Hisse %xx, Döviz %xx, Fon %xx</div>
        <p className={styles.getiri}>Toplam getiri: +4,3%</p>
      </div>
    </section>
  )
}
