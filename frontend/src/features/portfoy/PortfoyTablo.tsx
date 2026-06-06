import { Link } from 'react-router-dom'
import { paths } from '../../routes/paths'
import styles from './PortfoyTablo.module.css'

const MOCK = [
  { id: '1', ad: 'Ana Portföy', deger: '125.000 TL', karZararTl: '+5.200', karZararYuzde: '+4,3%' },
  { id: '2', ad: 'Emeklilik', deger: '45.000 TL', karZararTl: '-1.100', karZararYuzde: '-2,4%' },
]

export function PortfoyTablo() {
  return (
    <div className={styles.wrapper}>
      <table className={styles.tablo}>
        <thead>
          <tr>
            <th>Portföy Adı</th>
            <th>Güncel Değer</th>
            <th>Kar/Zarar (TL)</th>
            <th>Kar/Zarar (%)</th>
          </tr>
        </thead>
        <tbody>
          {MOCK.map((row) => (
            <tr key={row.id}>
              <td>
                <Link to={paths.portfoyDetay(row.id)} className={styles.link}>{row.ad}</Link>
              </td>
              <td>{row.deger}</td>
              <td className={row.karZararTl.startsWith('+') ? styles.positive : styles.negative}>{row.karZararTl}</td>
              <td className={row.karZararYuzde.startsWith('+') ? styles.positive : styles.negative}>{row.karZararYuzde}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
