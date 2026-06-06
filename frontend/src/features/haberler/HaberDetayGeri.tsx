import { Link } from 'react-router-dom'
import { paths } from '../../routes/paths'
import styles from './HaberDetayGeri.module.css'

export function HaberDetayGeri() {
  return (
    <Link to={paths.haberler} className={styles.link}>
      ← Geri
    </Link>
  )
}
