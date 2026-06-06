import { useParams, useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'
import { PozisyonEkleBaslik } from '../features/portfoy/PozisyonEkleBaslik'
import { PozisyonEkleForm } from '../features/portfoy/PozisyonEkleForm'
import styles from './PozisyonEklePage.module.css'

export function PozisyonEklePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const handleIptal = () => navigate(id ? paths.portfoyDetay(id) : paths.portfoyum)
  const handleKaydet = () => navigate(id ? paths.portfoyDetay(id) : paths.portfoyum)

  return (
    <div className={styles.page}>
      <PozisyonEkleBaslik />
      <PozisyonEkleForm onIptal={handleIptal} onKaydet={handleKaydet} />
    </div>
  )
}
