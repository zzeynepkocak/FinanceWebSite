import { useState, useEffect, useCallback } from 'react'
import { marketApi, type FinnhubNews } from '../api/market'
import styles from './HaberlerPage.module.css'

// Finnhub kategori → Türkçe etiket
const KATEGORI_MAP: Record<string, string> = {
  general:  'Genel',
  forex:    'Döviz',
  crypto:   'Kripto',
  merger:   'Birleşme & Satın Alma',
  top_news: 'Öne Çıkanlar',
}

const FINNHUB_CATEGORIES = ['general', 'forex', 'crypto', 'merger']
const KATEGORI_ETIKETLER = ['Tümü', ...FINNHUB_CATEGORIES.map((c) => KATEGORI_MAP[c] ?? c)]

function kategoriBul(h: FinnhubNews): string {
  return KATEGORI_MAP[h.category] ?? h.category ?? 'Genel'
}

function fmtTarih(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const PER_PAGE = 10

export function HaberlerPage() {
  const [allHaberler, setAllHaberler] = useState<FinnhubNews[]>([])
  const [loading, setLoading]         = useState(true)
  const [hata, setHata]               = useState<string | null>(null)
  const [secilenKat, setSecilenKat]   = useState('Tümü')
  const [sayfa, setSayfa]             = useState(1)
  const [sonGuncelleme, setSonGuncelleme] = useState('')

  const fetchHaberler = useCallback(async () => {
    setHata(null)
    try {
      const tum = await Promise.all(
        FINNHUB_CATEGORIES.map((cat) => marketApi.getNews(cat))
      )
      // Birleştir, tekrarları id'ye göre kaldır, tarihe göre sırala
      const merged = Object.values(
        tum.flat().reduce<Record<number, FinnhubNews>>((acc, h) => {
          if (!acc[h.id]) acc[h.id] = h
          return acc
        }, {})
      ).sort((a, b) => b.datetime - a.datetime)

      setAllHaberler(merged)
      setSonGuncelleme(new Date().toLocaleTimeString('tr-TR'))
    } catch {
      setHata('Haberler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHaberler()
    const interval = setInterval(fetchHaberler, 300_000) // 5 dakika
    return () => clearInterval(interval)
  }, [fetchHaberler])

  // Kategori filtresi
  const filtered =
    secilenKat === 'Tümü'
      ? allHaberler
      : allHaberler.filter((h) => kategoriBul(h) === secilenKat)

  const toplamSayfa = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const gosterilen  = filtered.slice((sayfa - 1) * PER_PAGE, sayfa * PER_PAGE)

  const katSecHandler = (k: string) => {
    setSecilenKat(k)
    setSayfa(1)
  }

  return (
    <div className={styles.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 className={styles.pageTitle}>Haberler</h1>
        {sonGuncelleme && (
          <span style={{ fontSize: '0.72rem', color: '#999' }}>
            Son güncelleme: {sonGuncelleme} · 5 dk
          </span>
        )}
      </div>

      {/* Kategori filtreleri */}
      <div className={styles.filters}>
        {KATEGORI_ETIKETLER.map((k) => (
          <button
            key={k}
            className={`${styles.filterBtn} ${secilenKat === k ? styles.filterBtnActive : ''}`}
            onClick={() => katSecHandler(k)}
          >
            {k}
          </button>
        ))}
      </div>

      {/* İçerik */}
      {loading ? (
        <div style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>
          Haberler yükleniyor…
        </div>
      ) : hata ? (
        <div style={{ padding: '2rem', color: '#c53030', textAlign: 'center' }}>{hata}</div>
      ) : gosterilen.length === 0 ? (
        <div style={{ padding: '2rem', color: '#888', textAlign: 'center' }}>
          Bu kategoride haber bulunamadı.
        </div>
      ) : (
        <div className={styles.newsList}>
          {gosterilen.map((h) => (
            <a
              key={h.id}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.newsCard}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
            >
              {h.image ? (
                <img
                  src={h.image}
                  alt=""
                  className={styles.newsImg}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <div className={styles.newsImg} style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  📰
                </div>
              )}
              <div className={styles.newsContent}>
                <div className={styles.newsMeta}>
                  <span className="badge badge-neutral">{kategoriBul(h)}</span>
                  <span className={styles.newsTime}>{h.source}</span>
                  <span className={styles.newsTime}>{fmtTarih(h.datetime)}</span>
                </div>
                <div className={styles.newsTitle}>{h.headline}</div>
                {h.summary && (
                  <div className={styles.newsSummary}>{h.summary.slice(0, 180)}{h.summary.length > 180 ? '…' : ''}</div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {toplamSayfa > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={sayfa === 1}
            onClick={() => setSayfa(sayfa - 1)}
          >
            ‹
          </button>
          {Array.from({ length: Math.min(toplamSayfa, 8) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${sayfa === p ? styles.pageBtnActive : ''}`}
              onClick={() => setSayfa(p)}
            >
              {p}
            </button>
          ))}
          {toplamSayfa > 8 && <span style={{ alignSelf: 'center', color: '#999' }}>…</span>}
          <button
            className={styles.pageBtn}
            disabled={sayfa === toplamSayfa}
            onClick={() => setSayfa(sayfa + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
