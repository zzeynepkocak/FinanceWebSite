import { useState, useEffect, useCallback } from 'react'
import { marketApi, fmtPrice, fmtChange } from '../../api/market'
import type { PiyasaSekme } from './PiyasaSekmeler'
import styles from './PiyasaTablo.module.css'

type Props = { sekme: PiyasaSekme }

// ── Sembol listeleri ──────────────────────────────────────────────
const KURLAR_SEMBOLLER = ['USD/TRY', 'EUR/TRY', 'GBP/TRY', 'CHF/TRY', 'JPY/TRY']
const HISSE_SEMBOLLER  = ['GARAN', 'AKBNK', 'THYAO', 'KCHOL', 'SAHOL', 'ASELS', 'EREGL', 'SISE']
const EMTIA_SEMBOLLER  = ['XAU/USD', 'BRENT', 'BTC/USD', 'ETH/USD']

const HISSE_ISIMLER: Record<string, string> = {
  GARAN: 'Garanti Bankası',
  AKBNK: 'Akbank',
  THYAO: 'Türk Hava Yolları',
  KCHOL: 'Koç Holding',
  SAHOL: 'Sabancı Holding',
  ASELS: 'Aselsan',
  EREGL: 'Ereğli Demir Çelik',
  SISE:  'Şişecam',
}

const EMTIA_ISIMLER: Record<string, string> = {
  'XAU/USD': 'Altın (USD)',
  'BRENT':   'Brent Petrol',
  'BTC/USD': 'Bitcoin',
  'ETH/USD': 'Ethereum',
}

export function PiyasaTablo({ sekme }: Props) {
  const [rows, setRows] = useState<Array<Record<string, string>>>([])
  const [loading, setLoading] = useState(true)
  const [sonGuncelleme, setSonGuncelleme] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (sekme === 'kurlar') {
        const quotes = await marketApi.getQuotes(KURLAR_SEMBOLLER)
        const veri = KURLAR_SEMBOLLER.map((sym) => {
          const q = quotes[sym]
          if (!q || q.c === 0) return { enstruman: sym, alis: '—', satis: '—', degisim: '—', kaynak: 'Finnhub' }
          const spread = sym.includes('JPY') ? 0.0001 : 0.005
          return {
            enstruman: sym,
            alis: fmtPrice(q.c, 4),
            satis: fmtPrice(q.c * (1 + spread), 4),
            degisim: fmtChange(q.changePct),
            kaynak: 'Finnhub',
          }
        })
        setRows(veri)
      } else if (sekme === 'hisseler') {
        const quotes = await marketApi.getQuotes(HISSE_SEMBOLLER)
        const veri = HISSE_SEMBOLLER.map((sym) => {
          const q = quotes[sym]
          if (!q || q.c === 0) return { sembol: sym, isim: HISSE_ISIMLER[sym] ?? sym, fiyat: '—', degisim: '—', hacim: '—' }
          return {
            sembol: sym,
            isim: HISSE_ISIMLER[sym] ?? sym,
            fiyat: fmtPrice(q.c, 2),
            degisim: fmtChange(q.changePct),
            hacim: '—',
          }
        })
        setRows(veri)
      } else if (sekme === 'emtialar') {
        const quotes = await marketApi.getQuotes(EMTIA_SEMBOLLER)
        const veri = EMTIA_SEMBOLLER.map((sym) => {
          const q = quotes[sym]
          if (!q || q.c === 0) return { sembol: sym, isim: EMTIA_ISIMLER[sym] ?? sym, fiyat: '—', degisim: '—', hacim: '—' }
          return {
            sembol: sym,
            isim: EMTIA_ISIMLER[sym] ?? sym,
            fiyat: fmtPrice(q.c, 2),
            degisim: fmtChange(q.changePct),
            hacim: '—',
          }
        })
        setRows(veri)
      }
      setSonGuncelleme(new Date().toLocaleTimeString('tr-TR'))
    } catch {
      // önceki veriyi koru
    } finally {
      setLoading(false)
    }
  }, [sekme])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30_000)
    return () => clearInterval(interval)
  }, [fetchData])

  const columns =
    sekme === 'kurlar'
      ? ['Enstrüman', 'Alış', 'Satış', 'Değişim', 'Kaynak']
      : ['Sembol', 'İsim', 'Fiyat', 'Değişim', 'Hacim']

  if (loading && rows.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Veriler yükleniyor…</div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.tablo}>
        <thead>
          <tr>
            {columns.map((c) => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const degisim = (row.degisim as string) ?? '—'
            const isUp   = degisim.startsWith('+')
            const isDown = degisim.startsWith('-')
            return (
              <tr key={idx}>
                {Object.values(row).map((val, ci) => (
                  <td
                    key={ci}
                    className={
                      columns[ci] === 'Değişim'
                        ? isUp ? styles.up : isDown ? styles.down : ''
                        : ''
                    }
                  >
                    {val}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {sonGuncelleme && (
        <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.4rem', textAlign: 'right' }}>
          Son güncelleme: {sonGuncelleme} · otomatik yenileme 30 sn
        </p>
      )}
    </div>
  )
}
