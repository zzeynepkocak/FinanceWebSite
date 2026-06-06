import { Card } from '../../components/ui/Card'
import styles from './VarlikTablosu.module.css'

const rows = [
  { symbol: 'ASELS', miktar: '1.250', maliyet: '₺ 42,10', fiyat: '₺ 44,30', karZarar: '+₺ 2.750', positive: true },
  { symbol: 'THYAO', miktar: '820', maliyet: '₺ 290,50', fiyat: '₺ 287,20', karZarar: '-₺ 2.706', positive: false },
  { symbol: 'BTC/USD', miktar: '0,42', maliyet: '$ 61.400', fiyat: '$ 64.120', karZarar: '+$ 1.142', positive: true },
  { symbol: 'EUR/TRY', miktar: '15.000', maliyet: '₺ 36,10', fiyat: '₺ 36,45', karZarar: '+₺ 5.250', positive: true },
]

export function VarlikTablosu() {
  return (
    <Card
      title="Varlık Tablosu"
      action={<button type="button" className="outlineAccent">Canlı</button>}
    >
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SEMBOL</th>
              <th>MİKTAR</th>
              <th>MALİYET</th>
              <th>FİYAT</th>
              <th>KAR/ZARAR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.symbol}>
                <td className={styles.symbol}>{row.symbol}</td>
                <td>{row.miktar}</td>
                <td>{row.maliyet}</td>
                <td>{row.fiyat}</td>
                <td className={row.positive ? styles.positive : styles.negative}>
                  {row.karZarar}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
