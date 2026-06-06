import styles from './PortfoyDetayPozisyonlar.module.css'

type Props = { portfoyId: string }

const MOCK = [
  { enstruman: 'THYAO', miktar: 100, alis: 285, guncel: 312, deger: '31.200', kz: '+2.700', kzYuzde: '+9,5%' },
  { enstruman: 'USD/TRY', miktar: 1000, alis: '32,50', guncel: '34,25', deger: '34.250', kz: '+1.750', kzYuzde: '+5,4%' },
]

export function PortfoyDetayPozisyonlar({ portfoyId }: Props) {
  void portfoyId
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Pozisyonlar</h2>
      <table className={styles.tablo}>
        <thead>
          <tr>
            <th>Enstrüman</th>
            <th>Miktar</th>
            <th>Alış</th>
            <th>Güncel</th>
            <th>Değer</th>
            <th>K/Z</th>
            <th>K/Z%</th>
          </tr>
        </thead>
        <tbody>
          {MOCK.map((row) => (
            <tr key={row.enstruman}>
              <td>{row.enstruman}</td>
              <td>{row.miktar}</td>
              <td>{row.alis}</td>
              <td>{row.guncel}</td>
              <td>{row.deger}</td>
              <td className={styles.positive}>{row.kz}</td>
              <td className={styles.positive}>{row.kzYuzde}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
