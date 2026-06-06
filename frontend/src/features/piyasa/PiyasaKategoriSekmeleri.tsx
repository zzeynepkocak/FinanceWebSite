import styles from './PiyasaKategoriSekmeleri.module.css'

const kategoriler = [
  'Endeks',
  'Türk hisseleri',
  'Dünya hisseleri',
  'Kripto',
  'Vadeli',
  'Forex',
  'Devlet tahvilleri',
  'Kurumsal tahviller',
  'BYF',
  'Ekonomi',
]

type Props = { active: string; onActiveChange: (k: string) => void }

export function PiyasaKategoriSekmeleri({ active, onActiveChange }: Props) {
  return (
    <div className={styles.wrapper}>
      {kategoriler.map((k) => (
        <button
          key={k}
          type="button"
          className={active === k ? styles.tabActive : styles.tab}
          onClick={() => onActiveChange(k)}
        >
          {k}
        </button>
      ))}
    </div>
  )
}
