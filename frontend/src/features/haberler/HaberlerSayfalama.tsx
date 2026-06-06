import styles from './HaberlerSayfalama.module.css'

type Props = { sayfa: number; toplamSayfa: number; onSayfaChange: (n: number) => void }

export function HaberlerSayfalama({ sayfa, toplamSayfa, onSayfaChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.btn}
        disabled={sayfa <= 1}
        onClick={() => onSayfaChange(sayfa - 1)}
      >
        &lt;
      </button>
      <span className={styles.info}>{sayfa} / {toplamSayfa}</span>
      <button
        type="button"
        className={styles.btn}
        disabled={sayfa >= toplamSayfa}
        onClick={() => onSayfaChange(sayfa + 1)}
      >
        &gt;
      </button>
    </div>
  )
}
