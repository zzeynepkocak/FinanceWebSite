import { useState } from 'react'
import styles from './PozisyonEkleForm.module.css'

type Props = { onIptal: () => void; onKaydet: () => void }

export function PozisyonEkleForm({ onIptal, onKaydet }: Props) {
  const [enstruman, setEnstruman] = useState('')
  const [miktar, setMiktar] = useState('')
  const [alisFiyat, setAlisFiyat] = useState('')
  const [tarih, setTarih] = useState('')

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        onKaydet()
      }}
    >
      <div className={styles.field}>
        <label htmlFor="enstruman">Enstrüman</label>
        <input
          id="enstruman"
          type="text"
          placeholder="Ara veya seç: THYAO, USD/TRY, ..."
          value={enstruman}
          onChange={(e) => setEnstruman(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="miktar">Miktar</label>
        <input
          id="miktar"
          type="number"
          value={miktar}
          onChange={(e) => setMiktar(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="alis">Alış fiyatı</label>
        <input
          id="alis"
          type="text"
          placeholder="TL"
          value={alisFiyat}
          onChange={(e) => setAlisFiyat(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="tarih">Tarih (opsiyonel)</label>
        <input
          id="tarih"
          type="date"
          value={tarih}
          onChange={(e) => setTarih(e.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onIptal} className={styles.btnIptal}>
          İptal
        </button>
        <button type="submit" className={styles.btnKaydet}>
          Kaydet
        </button>
      </div>
    </form>
  )
}
