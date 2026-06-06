import { useState } from 'react'
import styles from './PiyasaPage.module.css'

const INDEXES = [
  { name: 'BIST 100', val: '13.915', chg: '+0.28%', up: true },
  { name: 'USD/TRY',  val: '38,42',  chg: '+0.15%', up: true },
  { name: 'EUR/TRY',  val: '41,85',  chg: '+0.22%', up: true },
  { name: 'ALTIN/GR', val: '2.847',  chg: '-0.12%', up: false },
]

type Tab = 'hisseler' | 'kurlar' | 'emtialar' | 'kripto'

const HISSELER = [
  { sym: 'GARAN', name: 'Garanti Bankası',  price: '98,40',   chg: '+2.15%', up: true,  vol: '245M' },
  { sym: 'THYAO', name: 'Türk Hava Yolları', price: '287,50', chg: '-0.85%', up: false, vol: '187M' },
  { sym: 'ASELS', name: 'Aselsan',           price: '44,30',  chg: '+0.90%', up: true,  vol: '112M' },
  { sym: 'AKBNK', name: 'Akbank',            price: '52,80',  chg: '+1.45%', up: true,  vol: '198M' },
  { sym: 'KCHOL', name: 'Koç Holding',       price: '125,40', chg: '+0.95%', up: true,  vol: '89M' },
  { sym: 'SAHOL', name: 'Sabancı Holding',   price: '245,30', chg: '+1.25%', up: true,  vol: '112M' },
  { sym: 'ISCTR', name: 'İş Bankası C',      price: '12,84',  chg: '-0.54%', up: false, vol: '340M' },
  { sym: 'TUPRS', name: 'Tüpraş',            price: '178,20', chg: '+2.80%', up: true,  vol: '67M' },
]

const KURLAR = [
  { sym: 'USD/TRY', name: 'Amerikan Doları', price: '38,42', chg: '+0.15%', up: true,  vol: '—' },
  { sym: 'EUR/TRY', name: 'Euro',            price: '41,85', chg: '+0.22%', up: true,  vol: '—' },
  { sym: 'GBP/TRY', name: 'İngiliz Sterlini', price: '48,90', chg: '+0.18%', up: true, vol: '—' },
  { sym: 'CHF/TRY', name: 'İsviçre Frangı',   price: '43,12', chg: '-0.08%', up: false, vol: '—' },
  { sym: 'JPY/TRY', name: 'Japon Yeni',       price: '0,257', chg: '+0.05%', up: true, vol: '—' },
]

const EMTIALAR = [
  { sym: 'XAU/GR', name: 'Altın (Gram)',    price: '2.847', chg: '-0.12%', up: false, vol: '2.1M' },
  { sym: 'XAG/GR', name: 'Gümüş (Gram)',   price: '31,20', chg: '-0.45%', up: false, vol: '1.8M' },
  { sym: 'BRENT',  name: 'Brent Petrol',   price: '$82,50', chg: '-0.75%', up: false, vol: '450M' },
  { sym: 'COPPER', name: 'Bakır',           price: '$8.950', chg: '+1.15%', up: true,  vol: '125M' },
]

const KRIPTO = [
  { sym: 'BTC',  name: 'Bitcoin',  price: '$64.120', chg: '+1.90%', up: true,  vol: '$28B' },
  { sym: 'ETH',  name: 'Ethereum', price: '$3.420',  chg: '+3.10%', up: true,  vol: '$12B' },
  { sym: 'BNB',  name: 'BNB',      price: '$612',    chg: '+0.85%', up: true,  vol: '$2.1B' },
  { sym: 'SOL',  name: 'Solana',   price: '$178',    chg: '-1.20%', up: false, vol: '$4.5B' },
  { sym: 'AVAX', name: 'Avalanche', price: '$38,80', chg: '+2.40%', up: true,  vol: '$1.2B' },
]

const DATA: Record<Tab, typeof HISSELER> = {
  hisseler: HISSELER,
  kurlar: KURLAR,
  emtialar: EMTIALAR,
  kripto: KRIPTO,
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'hisseler', label: 'Hisseler' },
  { key: 'kurlar',   label: 'Döviz / Kur' },
  { key: 'emtialar', label: 'Emtia' },
  { key: 'kripto',   label: 'Kripto' },
]

export function PiyasaPage() {
  const [tab, setTab] = useState<Tab>('hisseler')
  const rows = DATA[tab]

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Piyasalar</h1>

      {/* Index cards */}
      <div className={styles.indexRow}>
        {INDEXES.map((idx) => (
          <div key={idx.name} className={styles.indexCard}>
            <span className={styles.indexName}>{idx.name}</span>
            <span className={styles.indexVal}>{idx.val}</span>
            <span className={`${styles.indexChg} ${idx.up ? styles.up : styles.down}`}>
              {idx.up ? '▲' : '▼'} {idx.chg}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.tab} ${tab === key ? styles.tabActive : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sembol</th>
              <th>Fiyat</th>
              <th>Değişim</th>
              <th>Hacim</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sym}>
                <td>
                  <div className={styles.symCell}>
                    <span className={styles.sym}>{r.sym}</span>
                    <span className={styles.symName}>{r.name}</span>
                  </div>
                </td>
                <td className={styles.price}>{r.price}</td>
                <td className={`${styles.chgCell} ${r.up ? styles.up : styles.down}`}>
                  {r.up ? '▲' : '▼'} {r.chg}
                </td>
                <td className={styles.vol}>{r.vol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
