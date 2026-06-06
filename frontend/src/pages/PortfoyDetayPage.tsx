import { useParams } from 'react-router-dom'
import { PortfoyDetayBaslik } from '../features/portfoy/PortfoyDetayBaslik'
import { PortfoyDetayOzet } from '../features/portfoy/PortfoyDetayOzet'
import { PortfoyDetayPozisyonlar } from '../features/portfoy/PortfoyDetayPozisyonlar'
import { PortfoyDetayDagilim } from '../features/portfoy/PortfoyDetayDagilim'
import styles from './PortfoyDetayPage.module.css'

export function PortfoyDetayPage() {
  const { id } = useParams<{ id: string }>()
  const portfoy = { ad: 'Ana Portföy', toplam: '125.000 TL', karZararTl: '+5.200 TL', karZararYuzde: '+4,3%' }

  return (
    <div className={styles.page}>
      <PortfoyDetayBaslik ad={portfoy.ad} portfoyId={id ?? ''} />
      <PortfoyDetayOzet toplam={portfoy.toplam} karZararTl={portfoy.karZararTl} karZararYuzde={portfoy.karZararYuzde} />
      <PortfoyDetayPozisyonlar portfoyId={id ?? ''} />
      <PortfoyDetayDagilim />
    </div>
  )
}
