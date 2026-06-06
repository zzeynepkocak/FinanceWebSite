import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './PiyasaTahminPage.module.css'

/* ══════════════════════════════════════════════
   Tip tanımları
   ══════════════════════════════════════════════ */
type Trend   = 'guclu-yukari' | 'yukari' | 'yatay' | 'asagi' | 'guclu-asagi'
type Sinif   = 'hisse' | 'doviz' | 'kripto' | 'emtia' | 'endeks'

interface Varlik {
  sembol:   string
  isim:     string
  sinif:    Sinif
  fiyat:    number
  oncekiFiyat: number
  degisim:  number
  hacim:    number
  tarih:    Date
  yuksek24: number
  dusuk24:  number
  gecmis:   number[]   // son 30 veri noktası
}

interface Tahmin {
  yonPuan:     number   // -100..+100  (pozitif = yukari)
  guven:       number   // 0..100
  trend:       Trend
  hedef1saat:  number
  hedef1gun:   number
  hedef1hafta: number
  sinyaller:   Sinyal[]
}

interface Sinyal {
  tur:  'al' | 'sat' | 'bekle'
  ad:   string
  acik: string
}

/* ══════════════════════════════════════════════
   Başlangıç varlık listesi
   ══════════════════════════════════════════════ */
const BASLANGIC: Omit<Varlik, 'gecmis' | 'tarih'>[] = [
  { sembol: 'BIST100', isim: 'BIST 100 Endeksi',     sinif: 'endeks', fiyat: 13915, oncekiFiyat: 13876, degisim: 0.28,  hacim: 48200000000, yuksek24: 14050, dusuk24: 13810 },
  { sembol: 'GARAN',   isim: 'Garanti BBVA',          sinif: 'hisse',  fiyat: 98.40, oncekiFiyat: 96.25, degisim: 2.23,  hacim: 1840000000,  yuksek24: 99.20, dusuk24: 95.80 },
  { sembol: 'THYAO',   isim: 'Türk Hava Yolları',     sinif: 'hisse',  fiyat: 287.5, oncekiFiyat: 289.9, degisim: -0.83, hacim: 920000000,   yuksek24: 293.0, dusuk24: 284.0 },
  { sembol: 'ASELS',   isim: 'Aselsan',               sinif: 'hisse',  fiyat: 44.30, oncekiFiyat: 43.90, degisim: 0.91,  hacim: 540000000,   yuksek24: 44.80, dusuk24: 43.20 },
  { sembol: 'AKBNK',   isim: 'Akbank',                sinif: 'hisse',  fiyat: 52.80, oncekiFiyat: 51.55, degisim: 2.42,  hacim: 1120000000,  yuksek24: 53.40, dusuk24: 51.10 },
  { sembol: 'USD/TRY', isim: 'Dolar / Türk Lirası',  sinif: 'doviz',  fiyat: 38.42, oncekiFiyat: 38.36, degisim: 0.16,  hacim: 0,           yuksek24: 38.65, dusuk24: 38.28 },
  { sembol: 'EUR/TRY', isim: 'Euro / Türk Lirası',   sinif: 'doviz',  fiyat: 41.85, oncekiFiyat: 41.88, degisim: -0.07, hacim: 0,           yuksek24: 42.10, dusuk24: 41.70 },
  { sembol: 'GBP/TRY', isim: 'Sterlin / Türk Lirası',sinif: 'doviz',  fiyat: 48.72, oncekiFiyat: 48.50, degisim: 0.45,  hacim: 0,           yuksek24: 49.00, dusuk24: 48.35 },
  { sembol: 'BTC/USD', isim: 'Bitcoin',               sinif: 'kripto', fiyat: 65200, oncekiFiyat: 62600, degisim: 4.15,  hacim: 38400000000, yuksek24: 66100, dusuk24: 62000 },
  { sembol: 'ETH/USD', isim: 'Ethereum',              sinif: 'kripto', fiyat: 3480,  oncekiFiyat: 3385,  degisim: 2.81,  hacim: 18700000000, yuksek24: 3540,  dusuk24: 3360 },
  { sembol: 'XAU/USD', isim: 'Altın (ons)',           sinif: 'emtia',  fiyat: 2347,  oncekiFiyat: 2318,  degisim: 1.25,  hacim: 0,           yuksek24: 2360,  dusuk24: 2310 },
  { sembol: 'WTI',     isim: 'Ham Petrol (WTI)',      sinif: 'emtia',  fiyat: 78.50, oncekiFiyat: 78.76, degisim: -0.33, hacim: 0,           yuksek24: 79.80, dusuk24: 77.90 },
]

/* ══════════════════════════════════════════════
   Yardımcı fonksiyonlar
   ══════════════════════════════════════════════ */
function rastgeleGurultu(oran = 0.003): number {
  return (Math.random() - 0.5) * 2 * oran
}

function fiyatGuncelle(v: Varlik): Varlik {
  const gPct = rastgeleGurultu(v.sinif === 'kripto' ? 0.008 : 0.003)
  const yeniFiyat = +(v.fiyat * (1 + gPct)).toFixed(v.fiyat > 1000 ? 0 : v.fiyat > 10 ? 2 : 4)
  const yeniDegisim = +((yeniFiyat - v.oncekiFiyat) / v.oncekiFiyat * 100).toFixed(2)
  const yeniGecmis = [...v.gecmis.slice(-29), yeniFiyat]
  return {
    ...v,
    oncekiFiyat: v.fiyat,
    fiyat:       yeniFiyat,
    degisim:     yeniDegisim,
    tarih:       new Date(),
    gecmis:      yeniGecmis,
    yuksek24:    Math.max(v.yuksek24, yeniFiyat),
    dusuk24:     Math.min(v.dusuk24, yeniFiyat),
  }
}

function tahminUret(v: Varlik): Tahmin {
  const son5 = v.gecmis.slice(-5)
  const trendYon = son5.length > 1
    ? (son5[son5.length - 1] - son5[0]) / son5[0] * 100
    : 0

  // Momentum bazlı basit skor
  const yonPuan = Math.max(-100, Math.min(100, trendYon * 20 + (v.degisim * 3)))
  const guven   = Math.round(55 + Math.abs(yonPuan) * 0.35)

  const trend: Trend =
    yonPuan >  40 ? 'guclu-yukari' :
    yonPuan >  10 ? 'yukari' :
    yonPuan < -40 ? 'guclu-asagi' :
    yonPuan < -10 ? 'asagi' : 'yatay'

  const hedefKat = 1 + (yonPuan / 100) * 0.02
  const hedef1saat  = +(v.fiyat * (1 + (yonPuan / 100) * 0.005)).toFixed(v.fiyat > 1000 ? 0 : 2)
  const hedef1gun   = +(v.fiyat * hedefKat).toFixed(v.fiyat > 1000 ? 0 : 2)
  const hedef1hafta = +(v.fiyat * (1 + (yonPuan / 100) * 0.06)).toFixed(v.fiyat > 1000 ? 0 : 2)

  const sinyaller: Sinyal[] = []
  if (v.degisim > 1.5)  sinyaller.push({ tur: 'al',    ad: 'Momentum',  acik: 'Güçlü yükseliş momentumu' })
  if (v.degisim < -1.5) sinyaller.push({ tur: 'sat',   ad: 'Momentum',  acik: 'Güçlü düşüş momentumu' })
  if (guven > 72)       sinyaller.push({ tur: yonPuan > 0 ? 'al' : 'sat', ad: 'Güven', acik: 'Yüksek sinyal güveni' })
  else                  sinyaller.push({ tur: 'bekle',  ad: 'Güven',  acik: 'Düşük güven — bekle' })
  if (yonPuan > 30)     sinyaller.push({ tur: 'al',    ad: 'Trend', acik: 'Kısa vadeli yükseliş trendi' })
  if (yonPuan < -30)    sinyaller.push({ tur: 'sat',   ad: 'Trend', acik: 'Kısa vadeli düşüş trendi' })

  return { yonPuan, guven, trend, hedef1saat, hedef1gun, hedef1hafta, sinyaller }
}

function formatFiyat(f: number, sembol: string): string {
  if (sembol.includes('TRY')) return f.toFixed(4)
  if (f > 1000) return f.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
  if (f > 10)   return f.toFixed(2)
  return f.toFixed(4)
}

function formatHacim(h: number): string {
  if (h === 0) return '—'
  if (h >= 1e9) return `${(h / 1e9).toFixed(1)}Mr`
  if (h >= 1e6) return `${(h / 1e6).toFixed(1)}Mn`
  return h.toLocaleString('tr-TR')
}

/* ══════════════════════════════════════════════
   Mini Sparkline SVG
   ══════════════════════════════════════════════ */
function Sparkline({ data, up, w = 100, h = 36 }: { data: number[]; up: boolean; w?: number; h?: number }) {
  if (data.length < 2) return null
  const min = Math.min(...data), max = Math.max(...data), r = max - min || 1
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / r) * (h - 4) - 2}`
  ).join(' ')
  const renk = up ? '#00d4aa' : '#ff4757'
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`g${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={renk} stopOpacity="0.35" />
          <stop offset="100%" stopColor={renk} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts + ` ${w},${h} 0,${h}`}
        fill={`url(#g${up})`}
        stroke="none"
      />
      <polyline
        points={pts}
        fill="none"
        stroke={renk}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ══════════════════════════════════════════════
   Trend badge
   ══════════════════════════════════════════════ */
const TREND_METIN: Record<Trend, string> = {
  'guclu-yukari': '🚀 Güçlü Yükseliş',
  'yukari':       '📈 Yükseliş',
  'yatay':        '➡️ Yatay',
  'asagi':        '📉 Düşüş',
  'guclu-asagi':  '⚠️ Güçlü Düşüş',
}
const TREND_RENK: Record<Trend, string> = {
  'guclu-yukari': '#00d4aa',
  'yukari':       '#4db8a0',
  'yatay':        '#f0b429',
  'asagi':        '#e17055',
  'guclu-asagi':  '#ff4757',
}

const SINIF_RENK: Record<Sinif, string> = {
  hisse: '#0066ff', doviz: '#6c5ce7', kripto: '#f0b429',
  emtia: '#00d4aa', endeks: '#fd79a8',
}

/* ══════════════════════════════════════════════
   Ana Bileşen
   ══════════════════════════════════════════════ */
export function PiyasaTahminPage() {
  const [varliklar, setVarliklar] = useState<Varlik[]>(() =>
    BASLANGIC.map(b => ({
      ...b,
      tarih:   new Date(),
      gecmis:  Array.from({ length: 20 }, (_, i) =>
        b.fiyat * (1 + (Math.random() - 0.5) * 0.01 * i * 0.3)
      ),
    }))
  )

  const [secili, setSecili]         = useState<string>(BASLANGIC[0].sembol)
  const [aktif, setAktif]           = useState(true)
  const [hiz, setHiz]               = useState(2000) // ms
  const [filtre, setFiltre]         = useState<Sinif | 'hepsi'>('hepsi')
  const [sonGuncelleme, setSonGuncelleme] = useState(new Date())

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const guncelle = useCallback(() => {
    setVarliklar(prev => prev.map(fiyatGuncelle))
    setSonGuncelleme(new Date())
  }, [])

  useEffect(() => {
    if (aktif) {
      intervalRef.current = setInterval(guncelle, hiz)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [aktif, hiz, guncelle])

  const seciliVarlik = varliklar.find(v => v.sembol === secili) ?? varliklar[0]
  const tahmin       = tahminUret(seciliVarlik)

  const filtreliVarliklar = filtre === 'hepsi'
    ? varliklar
    : varliklar.filter(v => v.sinif === filtre)

  const yonRenk = (d: number) => d >= 0 ? '#00d4aa' : '#ff4757'
  const yonIkon = (d: number) => d >= 0 ? '▲' : '▼'

  return (
    <div className={styles.page}>

      {/* ── Sayfa Başlığı ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.baslik}>
            Gerçek Zamanlı Piyasa <span>Tahmin Motoru</span>
          </h1>
          <p className={styles.altBaslik}>
            Anlık fiyat hareketleri • Trend analizi • AI tahminleri
          </p>
        </div>
        <div className={styles.kontroller}>
          <div className={styles.sonGuncelleme}>
            <span className={`${styles.canliNokta} ${aktif ? styles.canliNokta : styles.duraklamiNokta}`} />
            {aktif ? 'CANLI' : 'DURAKLANDI'} — {sonGuncelleme.toLocaleTimeString('tr-TR')}
          </div>
          <select
            className={styles.select}
            value={hiz}
            onChange={e => setHiz(Number(e.target.value))}
          >
            <option value={500}>⚡ Çok Hızlı (0.5s)</option>
            <option value={1000}>🏃 Hızlı (1s)</option>
            <option value={2000}>🚶 Normal (2s)</option>
            <option value={5000}>🐢 Yavaş (5s)</option>
          </select>
          <button
            className={`${styles.btn} ${aktif ? styles.btnDurdur : styles.btnBaslat}`}
            onClick={() => setAktif(!aktif)}
          >
            {aktif ? '⏸ Duraklat' : '▶ Başlat'}
          </button>
        </div>
      </div>

      {/* ── Üst Özet Kartlar ── */}
      <div className={styles.ozetSatir}>
        {[
          { etiket: 'En Fazla Yükselen', varlik: [...varliklar].sort((a, b) => b.degisim - a.degisim)[0] },
          { etiket: 'En Fazla Düşen',    varlik: [...varliklar].sort((a, b) => a.degisim - b.degisim)[0] },
          { etiket: 'En Yüksek Hacim',   varlik: [...varliklar].filter(v => v.hacim > 0).sort((a, b) => b.hacim - a.hacim)[0] },
          { etiket: 'Seçili Varlık',     varlik: seciliVarlik },
        ].map(({ etiket, varlik }) => (
          <div
            key={etiket}
            className={`${styles.ozetKart} ${varlik?.sembol === secili ? styles.ozetKartSecili : ''}`}
            onClick={() => varlik && setSecili(varlik.sembol)}
          >
            <div className={styles.ozetEtiket}>{etiket}</div>
            <div className={styles.ozetSembol}>{varlik?.sembol ?? '—'}</div>
            <div className={styles.ozetFiyat}>
              {varlik ? formatFiyat(varlik.fiyat, varlik.sembol) : '—'}
            </div>
            <div className={styles.ozetDegisim} style={{ color: yonRenk(varlik?.degisim ?? 0) }}>
              {yonIkon(varlik?.degisim ?? 0)} {Math.abs(varlik?.degisim ?? 0).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      <div className={styles.govde}>

        {/* ── Sol: Varlık Listesi ── */}
        <div className={styles.listePanel}>
          {/* Filtre butonları */}
          <div className={styles.filtreSatiri}>
            {(['hepsi', 'hisse', 'doviz', 'kripto', 'emtia', 'endeks'] as const).map(f => (
              <button
                key={f}
                className={`${styles.filtreBtnu} ${filtre === f ? styles.filtreAktif : ''}`}
                onClick={() => setFiltre(f)}
              >
                {f === 'hepsi' ? 'Tümü' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Liste */}
          <div className={styles.liste}>
            {filtreliVarliklar.map(v => {
              const yukari = v.fiyat >= v.oncekiFiyat
              const t = tahminUret(v)
              return (
                <div
                  key={v.sembol}
                  className={`${styles.listeOgesi} ${secili === v.sembol ? styles.listeOgesiSecili : ''}`}
                  onClick={() => setSecili(v.sembol)}
                >
                  <div className={styles.ogeSol}>
                    <div
                      className={styles.ogeSinif}
                      style={{ background: `${SINIF_RENK[v.sinif]}20`, color: SINIF_RENK[v.sinif] }}
                    >
                      {v.sinif}
                    </div>
                    <div className={styles.ogeSembol}>{v.sembol}</div>
                    <div className={styles.ogeIsim}>{v.isim}</div>
                  </div>
                  <div className={styles.ogeSag}>
                    <div className={styles.ogeFiyat}>
                      {formatFiyat(v.fiyat, v.sembol)}
                    </div>
                    <div className={styles.ogeDegisim} style={{ color: yonRenk(v.degisim) }}>
                      {yonIkon(v.degisim)} {Math.abs(v.degisim).toFixed(2)}%
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Sparkline data={v.gecmis} up={yukari} w={70} h={28} />
                    </div>
                    <div
                      className={styles.ogeTahmin}
                      style={{ color: TREND_RENK[t.trend] }}
                    >
                      {TREND_METIN[t.trend]}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Sağ: Detay & Tahmin Paneli ── */}
        <div className={styles.detayPanel}>

          {/* Varlık Başlığı */}
          <div className={styles.detayBaslik}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span
                  className={styles.detaySinif}
                  style={{ background: `${SINIF_RENK[seciliVarlik.sinif]}20`, color: SINIF_RENK[seciliVarlik.sinif] }}
                >
                  {seciliVarlik.sinif}
                </span>
                <span className={styles.detaySembolBuyuk}>{seciliVarlik.sembol}</span>
              </div>
              <div className={styles.detayIsim}>{seciliVarlik.isim}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.detayFiyatBuyuk}>
                {formatFiyat(seciliVarlik.fiyat, seciliVarlik.sembol)}
              </div>
              <div
                className={styles.detayDegisim}
                style={{ color: yonRenk(seciliVarlik.degisim) }}
              >
                {yonIkon(seciliVarlik.degisim)} {Math.abs(seciliVarlik.degisim).toFixed(2)}%
                <span style={{ marginLeft: '0.4rem', opacity: 0.5, fontSize: '0.75rem' }}>
                  ({seciliVarlik.fiyat >= seciliVarlik.oncekiFiyat ? '+' : ''}{(seciliVarlik.fiyat - seciliVarlik.oncekiFiyat).toFixed(seciliVarlik.fiyat > 100 ? 2 : 4)})
                </span>
              </div>
            </div>
          </div>

          {/* Büyük Sparkline */}
          <div className={styles.buyukGrafik}>
            <Sparkline
              data={seciliVarlik.gecmis}
              up={seciliVarlik.fiyat >= seciliVarlik.oncekiFiyat}
              w={600}
              h={120}
            />
            <div className={styles.grafikAlt}>
              <span>24s Düşük: <b>{formatFiyat(seciliVarlik.dusuk24, seciliVarlik.sembol)}</b></span>
              <span>Hacim: <b>{formatHacim(seciliVarlik.hacim)}</b></span>
              <span>24s Yüksek: <b>{formatFiyat(seciliVarlik.yuksek24, seciliVarlik.sembol)}</b></span>
            </div>
          </div>

          {/* Tahmin Motoru */}
          <div className={styles.tahminKutu}>
            <div className={styles.tahminBaslik}>
              <span>🤖 AI Tahmin Motoru</span>
              <span className={styles.tahminGuven}>Güven: {tahmin.guven}%</span>
            </div>

            {/* Yön göstergesi */}
            <div className={styles.yonGosterge}>
              <div
                className={styles.yonCubuk}
                style={{
                  background: `linear-gradient(90deg,
                    #ff4757 0%,
                    #ff4757 ${Math.max(0, 50 + tahmin.yonPuan / 2 - 50)}%,
                    #f0b429 ${50 - 10}%,
                    #f0b429 ${50 + 10}%,
                    #00d4aa ${Math.min(100, 50 + tahmin.yonPuan / 2 + 50)}%,
                    #00d4aa 100%)`,
                }}
              >
                <div
                  className={styles.yonIbre}
                  style={{ left: `${50 + tahmin.yonPuan / 2}%` }}
                />
              </div>
              <div className={styles.yonEtiketler}>
                <span style={{ color: '#ff4757' }}>Güçlü Sat</span>
                <span style={{ color: '#f0b429' }}>Nötr</span>
                <span style={{ color: '#00d4aa' }}>Güçlü Al</span>
              </div>
              <div className={styles.yonPuan}>
                Skor: <b style={{ color: tahmin.yonPuan >= 0 ? '#00d4aa' : '#ff4757' }}>
                  {tahmin.yonPuan >= 0 ? '+' : ''}{tahmin.yonPuan.toFixed(0)}
                </b>
                {' '}/ 100
              </div>
            </div>

            {/* Trend */}
            <div className={styles.trendSatir}>
              <span className={styles.trendEtiket}>Trend:</span>
              <span
                className={styles.trendBadge}
                style={{
                  background: `${TREND_RENK[tahmin.trend]}18`,
                  color: TREND_RENK[tahmin.trend],
                  border: `1px solid ${TREND_RENK[tahmin.trend]}40`,
                }}
              >
                {TREND_METIN[tahmin.trend]}
              </span>
            </div>

            {/* Fiyat Hedefleri */}
            <div className={styles.hedefler}>
              <div className={styles.hedefBaslik}>Fiyat Hedefleri</div>
              <div className={styles.hedefSatirlar}>
                {[
                  { sure: '1 Saat',  hedef: tahmin.hedef1saat },
                  { sure: '1 Gün',   hedef: tahmin.hedef1gun  },
                  { sure: '1 Hafta', hedef: tahmin.hedef1hafta },
                ].map(({ sure, hedef }) => {
                  const fark = hedef - seciliVarlik.fiyat
                  const pct  = (fark / seciliVarlik.fiyat * 100).toFixed(2)
                  const yukari = fark >= 0
                  return (
                    <div key={sure} className={styles.hedefSatir}>
                      <span className={styles.hedefSure}>{sure}</span>
                      <span className={styles.hedefFiyat}>
                        {formatFiyat(hedef, seciliVarlik.sembol)}
                      </span>
                      <span
                        className={styles.hedefFark}
                        style={{ color: yukari ? '#00d4aa' : '#ff4757' }}
                      >
                        {yukari ? '+' : ''}{pct}%
                      </span>
                      <div className={styles.hedefBar}>
                        <div
                          className={styles.hedefBarDolu}
                          style={{
                            width: `${Math.min(100, Math.abs(Number(pct)) * 10)}%`,
                            background: yukari ? '#00d4aa' : '#ff4757',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sinyaller */}
            <div className={styles.sinyaller}>
              <div className={styles.hedefBaslik}>Teknik Sinyaller</div>
              {tahmin.sinyaller.map((s, i) => {
                const renk = s.tur === 'al' ? '#00d4aa' : s.tur === 'sat' ? '#ff4757' : '#f0b429'
                return (
                  <div key={i} className={styles.sinyal}>
                    <span
                      className={styles.sinyalBadge}
                      style={{ background: `${renk}20`, color: renk }}
                    >
                      {s.tur.toUpperCase()}
                    </span>
                    <span className={styles.sinyalAd}>{s.ad}</span>
                    <span className={styles.sinyalAcik}>{s.acik}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tüm Varlıklar Mini Tablo */}
          <div className={styles.miniTablo}>
            <div className={styles.miniTabloBaslik}>Tüm Piyasalar — Anlık Durum</div>
            <table className={styles.tablo}>
              <thead>
                <tr>
                  <th>Sembol</th>
                  <th>Fiyat</th>
                  <th>24s %</th>
                  <th>Trend</th>
                  <th>Güven</th>
                  <th>Grafik</th>
                </tr>
              </thead>
              <tbody>
                {varliklar.map(v => {
                  const t = tahminUret(v)
                  return (
                    <tr
                      key={v.sembol}
                      className={`${styles.tabloSatir} ${v.sembol === secili ? styles.tabloSatirSecili : ''}`}
                      onClick={() => setSecili(v.sembol)}
                    >
                      <td>
                        <div className={styles.tabloSembol}>{v.sembol}</div>
                        <div className={styles.tabloIsim}>{v.isim}</div>
                      </td>
                      <td className={styles.tabloFiyat}>
                        {formatFiyat(v.fiyat, v.sembol)}
                      </td>
                      <td style={{ color: yonRenk(v.degisim), fontWeight: 700 }}>
                        {yonIkon(v.degisim)} {Math.abs(v.degisim).toFixed(2)}%
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: TREND_RENK[t.trend],
                          }}
                        >
                          {TREND_METIN[t.trend].split(' ').slice(1).join(' ')}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tabloGuvenBar}>
                          <div
                            className={styles.tabloGuvenDolu}
                            style={{
                              width: `${t.guven}%`,
                              background: t.guven > 70 ? '#00d4aa' : t.guven > 55 ? '#f0b429' : '#ff4757',
                            }}
                          />
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.4)', textAlign: 'right' }}>
                          {t.guven}%
                        </div>
                      </td>
                      <td>
                        <Sparkline data={v.gecmis} up={v.fiyat >= v.oncekiFiyat} w={70} h={28} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ── Uyarı Notu ── */}
      <div className={styles.uyari}>
        ⚠️ Bu tahminler algoritma tabanlı simülasyon içerir; yatırım tavsiyesi değildir.
        Gerçek piyasa verileri için lisanslı veri sağlayıcısı entegrasyonu gereklidir.
      </div>
    </div>
  )
}
