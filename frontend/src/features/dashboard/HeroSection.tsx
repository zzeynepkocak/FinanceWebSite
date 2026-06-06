import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/paths'
import styles from './HeroSection.module.css'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className={styles.hero}>
      <h1 className={styles.titleLine1}>Güçlendirilmiş</h1>
      <h1 className={styles.titleLine2}>Süpergrafikler</h1>
      <p className={styles.desc}>
        Profesyonel finans arayüzü estetiğinde, hızlı ve modern piyasa görünümü. Tüm cihazlarda net ve keskin bir deneyim.
      </p>
      <div className={styles.buttons}>
        <button type="button" className={styles.btnPrimary} onClick={() => navigate(paths.portfoyum)}>
          Ücretsiz deneyin
        </button>
        <button type="button" className={styles.btnSecondary} onClick={() => navigate(paths.piyasa)}>
          Planları incele
        </button>
      </div>
      <div className={styles.bottomLeft}>
        <h2 className={styles.grafiklerTitle}>Grafikler</h2>
        <p className={styles.grafiklerDesc}>Piyasa görünümünü tek ekranda yönetin.</p>
      </div>
    </section>
  )
}
