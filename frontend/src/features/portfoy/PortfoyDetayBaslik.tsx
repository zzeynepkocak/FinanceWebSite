import { Link } from 'react-router-dom'
import { paths } from '../../routes/paths'
import styles from './PortfoyDetayBaslik.module.css'

type Props = { ad: string; portfoyId: string }

export function PortfoyDetayBaslik({ ad, portfoyId }: Props) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{ad}</h1>
      <div className={styles.actions}>
        <button type="button" className={styles.btn}>Düzenle</button>
        <Link to={paths.pozisyonEkle(portfoyId)} className={styles.btnPrimary}>Pozisyon Ekle</Link>
      </div>
    </div>
  )
}
