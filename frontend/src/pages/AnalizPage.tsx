import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { marketApi, fmtPrice, fmtChange, periodToRange, type Quote, type CandleData } from '../api/market'
import styles from './AnalizPage.module.css'

const INSTRUMENTS = ['USD/TRY', 'EUR/TRY', 'GBP/TRY', 'XAU/USD', 'BTC/USD', 'ETH/USD', 'BRENT', 'GARAN', 'AKBNK', 'THYAO']
const PERIODS = ['1G', '1H', '1A', '3A', '6A', '1Y']

/** Enstrüman bazlı gerçekçi baz fiyatlar */
const BASE_PRICES: Record<string, number> = {
  'USD/TRY': 38.42, 'EUR/TRY': 41.85, 'GBP/TRY': 48.90,
  'XAU/USD': 2320.0, 'BTC/USD': 65200, 'ETH/USD': 3480,
  'BRENT': 82.5, 'GARAN': 98.4, 'AKBNK': 52.8, 'THYAO': 287.5,
}

/** Gerçekçi simüle edilmiş fiyat serisi üret */
function generateMockData(instrument: string, period: string): ChartPoint[] {
  const base = BASE_PRICES[instrument] ?? 100
  const periodDays: Record<string, number> = {
    '1G': 1, '1H': 7, '1A': 30, '3A': 90, '6A': 180, '1Y': 365,
  }
  const days = periodDays[period] ?? 90
  const points = period === '1G' ? 48 : Math.min(days, 90)
  const now = Date.now()
  const step = (days * 24 * 3600 * 1000) / points

  const closes: number[] = []
  let price = base * (0.92 + Math.random() * 0.08)
  for (let i = 0; i < points; i++) {
    const volatility = base * 0.008
    price += (Math.random() - 0.48) * volatility
    price = Math.max(price, base * 0.7)
    closes.push(price)
  }

  const ma20vals = hareketliOrtalama(closes, 20)
  const ma50vals = hareketliOrtalama(closes, 50)

  return closes.map((fiyat, i) => {
    const ts = now - (points - i) * step
    const d = new Date(ts)
    const tarih = period === '1G'
      ? d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
    return { tarih, fiyat: parseFloat(fiyat.toFixed(4)), ma20: ma20vals[i], ma50: ma50vals[i] }
  })
}

interface ChartPoint {
  tarih: string
  fiyat: number
  ma20?: number
  ma50?: number
}

/** Hareketli ortalama hesapla */
function hareketliOrtalama(data: number[], pencere: number): (number | undefined)[] {
  return data.map((_, i) => {
    if (i < pencere - 1) return undefined
    const dilim = data.slice(i - pencere + 1, i + 1)
    return dilim.reduce((s, v) => s + v, 0) / pencere
  })
}

function fmtUnix(unix: number, resolution: string): string {
  const d = new Date(unix * 1000)
  if (resolution === '5' || resolution === '60') {
    return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
}

export function AnalizPage() {
  const [instrument, setInstrument] = useState('USD/TRY')
  const [period, setPeriod]         = useState('3A')
  const [ma20, setMa20]             = useState(false)
  const [ma50, setMa50]             = useState(false)
  const [trend, setTrend]           = useState(false)

  const [quote, setQuote]           = useState<Quote | null>(null)
  const [chartData, setChartData]   = useState<ChartPoint[]>([])
  const [loading, setLoading]       = useState(true)
  const [isMock, setIsMock]         = useState(false)
  const [sonGuncelleme, setSonGuncelleme] = useState('')

  // Kota verisini çek (30 sn'de bir yenile)
  const fetchQuote = useCallback(async () => {
    try {
      const q = await marketApi.getQuote(instrument)
      if (q.c !== 0) {
        setQuote(q)
        setSonGuncelleme(new Date().toLocaleTimeString('tr-TR'))
        return
      }
    } catch {/* sessiz hata */}
    // Fallback: mock quote from base price
    const base = BASE_PRICES[instrument] ?? 100
    const chgPct = (Math.random() - 0.48) * 2.5
    const prev = base / (1 + chgPct / 100)
    setQuote({ c: base, h: base * 1.012, l: base * 0.988, o: prev, pc: prev, change: base - prev, changePct: chgPct })
    setSonGuncelleme(new Date().toLocaleTimeString('tr-TR'))
  }, [instrument])

  // Mum verisini çek
  const fetchCandle = useCallback(async () => {
    setLoading(true)
    setIsMock(false)
    try {
      const { from, to, resolution } = periodToRange(period)
      const candle: CandleData = await marketApi.getCandle(instrument, resolution, from, to)

      if (candle.s === 'ok' && candle.c?.length) {
        const closes = candle.c
        const ma20vals = hareketliOrtalama(closes, 20)
        const ma50vals = hareketliOrtalama(closes, 50)
        const points: ChartPoint[] = candle.t.map((t, i) => ({
          tarih: fmtUnix(t, resolution),
          fiyat: closes[i],
          ma20: ma20vals[i],
          ma50: ma50vals[i],
        }))
        setChartData(points)
        setLoading(false)
        return
      }
    } catch {/* API erişilemez, mock kullan */}

    // Fallback: simüle veri
    setIsMock(true)
    setChartData(generateMockData(instrument, period))
    setLoading(false)
  }, [instrument, period])

  // İlk yükleme + instrument/period değişince
  useEffect(() => {
    fetchQuote()
    fetchCandle()
  }, [fetchQuote, fetchCandle])

  // Kota 30 sn'de bir yenile
  useEffect(() => {
    const iv = setInterval(fetchQuote, 30_000)
    return () => clearInterval(iv)
  }, [fetchQuote])

  const isUp = (quote?.changePct ?? 0) >= 0
  const strokeColor = isUp ? '#38a169' : '#e53e3e'

  // Trend çizgisi için başlangıç/bitiş referans değerleri
  const trendBaslangic = chartData[0]?.fiyat
  const trendBitis = chartData[chartData.length - 1]?.fiyat

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Analiz</h1>

      {/* Kontroller */}
      <div className={styles.controls}>
        <span className={styles.controlsLabel}>Enstrüman</span>
        <select
          className={styles.select}
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        >
          {INSTRUMENTS.map((i) => <option key={i}>{i}</option>)}
        </select>

        <div className={styles.divider} />

        <span className={styles.controlsLabel}>Periyot</span>
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}

        <div className={styles.indBtns}>
          {[
            { label: 'MA 20', active: ma20, toggle: () => setMa20(!ma20) },
            { label: 'MA 50', active: ma50, toggle: () => setMa50(!ma50) },
            { label: 'Trend', active: trend, toggle: () => setTrend(!trend) },
          ].map((b) => (
            <button
              key={b.label}
              className={`${styles.indBtn} ${b.active ? styles.indBtnActive : ''}`}
              onClick={b.toggle}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grafik kartı */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartSym}>{instrument}</span>
          {quote && quote.c !== 0 ? (
            <>
              <span className={styles.chartPrice}>{fmtPrice(quote.c, 4)}</span>
              <span className={`${styles.chartChg} ${isUp ? styles.up : styles.down}`}>
                {isUp ? '▲' : '▼'} {fmtChange(quote.changePct)}
              </span>
            </>
          ) : (
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Fiyat yükleniyor…</span>
          )}
          {sonGuncelleme && (
            <span style={{ fontSize: '0.7rem', color: '#aaa', marginLeft: 'auto' }}>
              {sonGuncelleme} · 30 sn
            </span>
          )}
        </div>

        <div className={styles.chartBody}>
          {isMock && (
            <div style={{ fontSize: '0.72rem', color: '#aaa', textAlign: 'right', paddingRight: 8, paddingTop: 4 }}>
              simüle veri (API bağlantısı yok)
            </div>
          )}
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#aaa' }}>
              Grafik yükleniyor…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
                <XAxis
                  dataKey="tarih"
                  tick={{ fontSize: 11, fill: '#888' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#888' }}
                  domain={['auto', 'auto']}
                  width={60}
                />
                <Tooltip
                  formatter={(val) => [fmtPrice(Number(val), 4), '']}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />

                {/* Ana fiyat çizgisi */}
                <Line
                  type="monotone"
                  dataKey="fiyat"
                  name={instrument}
                  stroke={strokeColor}
                  dot={false}
                  strokeWidth={2}
                  activeDot={{ r: 4 }}
                />

                {/* MA20 */}
                {ma20 && (
                  <Line
                    type="monotone"
                    dataKey="ma20"
                    name="MA 20"
                    stroke="#e6a817"
                    dot={false}
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    connectNulls
                  />
                )}

                {/* MA50 */}
                {ma50 && (
                  <Line
                    type="monotone"
                    dataKey="ma50"
                    name="MA 50"
                    stroke="#805ad5"
                    dot={false}
                    strokeWidth={1.5}
                    strokeDasharray="6 3"
                    connectNulls
                  />
                )}

                {/* Trend çizgisi */}
                {trend && trendBaslangic != null && (
                  <ReferenceLine
                    y={(trendBaslangic + (trendBitis ?? trendBaslangic)) / 2}
                    stroke="#3182ce"
                    strokeDasharray="8 4"
                    label={{ value: 'Trend', position: 'insideTopRight', fontSize: 11, fill: '#3182ce' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* İstatistik kartları */}
      <div className={styles.statsRow}>
        {[
          { label: 'Güncel Fiyat',   val: quote ? fmtPrice(quote.c, 4)  : '—' },
          { label: 'Günlük Yüksek',  val: quote ? fmtPrice(quote.h, 4)  : '—' },
          { label: 'Günlük Düşük',   val: quote ? fmtPrice(quote.l, 4)  : '—' },
          { label: 'Önceki Kapanış', val: quote ? fmtPrice(quote.pc, 4) : '—' },
          { label: 'Değişim',        val: quote ? fmtChange(quote.changePct) : '—' },
        ].map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statVal}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
