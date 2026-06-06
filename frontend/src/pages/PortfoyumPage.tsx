import { useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'
import styles from './PortfoyumPage.module.css'

const SUMMARY = [
  { label: 'Toplam Değer',  val: '₺2.847.340', cls: '' },
  { label: 'Günlük K/Z',    val: '+₺94.280',   cls: 'up' },
  { label: 'Toplam K/Z',    val: '+₺384.720',  cls: 'up' },
  { label: 'Getiri Oranı',  val: '+15.64%',    cls: 'up' },
]

const POSITIONS = [
  { sym: 'GARAN',  name: 'Garanti BBVA', lots: 500,  price: '98,40',  cost: '76,20',  pl: '+₺11.100', plUp: true,  chg: '+2.15%', up: true  },
  { sym: 'THYAO',  name: 'THY',           lots: 200,  price: '287,50', cost: '305,00', pl: '-₺3.500',  plUp: false, chg: '-0.85%', up: false },
  { sym: 'ASELS',  name: 'Aselsan',       lots: 1000, price: '44,30',  cost: '38,00',  pl: '+₺6.300',  plUp: true,  chg: '+0.90%', up: true  },
  { sym: 'AKBNK',  name: 'Akbank',        lots: 800,  price: '52,80',  cost: '48,50',  pl: '+₺3.440',  plUp: true,  chg: '+1.45%', up: true  },
  { sym: 'KCHOL',  name: 'Koç Holding',   lots: 100,  price: '125,40', cost: '118,00', pl: '+₺740',    plUp: true,  chg: '+0.95%', up: true  },
  { sym: 'BTC',    name: 'Bitcoin',        lots: 0.5,  price: '$64.120', cost: '$55.000', pl: '+₺22.800', plUp: true, chg: '+1.90%', up: true },
]

const TRANSACTIONS = [
  { date: '20.05.2026', type: 'AL',  sym: 'GARAN', qty: 100,  price: '98,40',  total: '+₺9.840' },
  { date: '19.05.2026', type: 'SAT', sym: 'THYAO', qty: 50,   price: '290,00', total: '-₺14.500' },
  { date: '18.05.2026', type: 'AL',  sym: 'AKBNK', qty: 200,  price: '51,20',  total: '+₺10.240' },
  { date: '16.05.2026', type: 'AL',  sym: 'BTC',   qty: 0.1,  price: '$63.200', total: '+₺25.280' },
]

export function PortfoyumPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Portföyüm</h1>
          <p className={styles.pageSub}>Pozisyonlarınızı ve işlem geçmişinizi yönetin</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => navigate(`${paths.portfoyum}/1/pozisyon-ekle`)}
        >
          + Pozisyon Ekle
        </button>
      </div>

      {/* Summary */}
      <div className={styles.summaryRow}>
        {SUMMARY.map((s) => (
          <div key={s.label} className={styles.summaryCard}>
            <div className={styles.summaryLabel}>{s.label}</div>
            <div className={`${styles.summaryVal} ${s.cls ? styles[s.cls] : ''}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Positions table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Açık Pozisyonlar</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sembol</th>
              <th>Adet</th>
              <th>Güncel Fiyat</th>
              <th>Maliyet</th>
              <th>Değişim</th>
              <th>K/Z</th>
            </tr>
          </thead>
          <tbody>
            {POSITIONS.map((p) => (
              <tr key={p.sym}>
                <td>
                  <div className={styles.sym}>{p.sym}</div>
                  <div className={styles.symSub}>{p.name}</div>
                </td>
                <td>{p.lots}</td>
                <td className={styles.price}>{p.price}</td>
                <td className={styles.price}>{p.cost}</td>
                <td className={p.up ? styles.chgUp : styles.chgDown}>
                  {p.up ? '▲' : '▼'} {p.chg}
                </td>
                <td className={p.plUp ? styles.plUp : styles.plDown}>{p.pl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transactions table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Son İşlemler</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>İşlem</th>
              <th>Sembol</th>
              <th>Adet</th>
              <th>Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((t, i) => (
              <tr key={i}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{t.date}</td>
                <td>
                  <span className={`badge ${t.type === 'AL' ? 'badge-profit' : 'badge-loss'}`}>
                    {t.type}
                  </span>
                </td>
                <td className={styles.sym}>{t.sym}</td>
                <td>{t.qty}</td>
                <td className={styles.price}>{t.price}</td>
                <td className={t.type === 'AL' ? styles.plUp : styles.plDown}>{t.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
