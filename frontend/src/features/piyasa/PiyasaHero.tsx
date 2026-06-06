import styles from './PiyasaHero.module.css'

export function PiyasaHero() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Piyasalar, her yerde</h1>
      <p className={styles.subtitle}>
        Küresel piyasaları ve yerel endeksleri tek panelde izleyin.
      </p>
    </div>
  )
}
