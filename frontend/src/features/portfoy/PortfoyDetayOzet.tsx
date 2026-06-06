import styles from './PortfoyDetayOzet.module.css'

type Props = { toplam: string; karZararTl: string; karZararYuzde: string }

export function PortfoyDetayOzet({ toplam, karZararTl, karZararYuzde }: Props) {
  return (
    <p className={styles.ozet}>
      Toplam: {toplam} | Kar/Zarar: {karZararTl} ({karZararYuzde})
    </p>
  )
}
