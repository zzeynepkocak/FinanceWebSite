/**
 * market.ts — Gerçek zamanlı piyasa verileri
 *
 * Backend /api/v1/market/* endpoint'lerini kullanır (Finnhub proxy).
 * Backend erişilemezse doğrudan Finnhub'a bağlanır (fallback).
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8081'
const FINNHUB_BASE = 'https://finnhub.io/api/v1'
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY

// ── Sembol haritası: görüntü adı → Finnhub sembolü ───────────────
export const SYMBOL_MAP: Record<string, string> = {
  'USD/TRY':  'FX:USDTRY',
  'EUR/TRY':  'FX:EURTRY',
  'GBP/TRY':  'FX:GBPTRY',
  'CHF/TRY':  'FX:CHFTRY',
  'JPY/TRY':  'FX:JPYTRY',
  'BIST 100': 'XU100.IS',
  'BIST 50':  'XU050.IS',
  'BIST 30':  'XU030.IS',
  'GARAN':    'GARAN.IS',
  'AKBNK':    'AKBNK.IS',
  'THYAO':    'THYAO.IS',
  'KCHOL':    'KCHOL.IS',
  'SAHOL':    'SAHOL.IS',
  'ASELS':    'ASELS.IS',
  'EREGL':    'EREGL.IS',
  'SISE':     'SISE.IS',
  'BTC/USD':  'BINANCE:BTCUSDT',
  'ETH/USD':  'BINANCE:ETHUSDT',
  'XAU/USD':  'OANDA:XAUUSD',
  'BRENT':    'OANDA:BCOUSD',
}

export function toFinnhubSymbol(display: string): string {
  return SYMBOL_MAP[display] ?? display
}

// ── Tipler ────────────────────────────────────────────────────────
export interface Quote {
  c: number    // güncel fiyat
  h: number    // günlük yüksek
  l: number    // günlük düşük
  o: number    // açılış
  pc: number   // önceki kapanış
  change: number
  changePct: number
}

export interface FinnhubNews {
  category: string
  datetime: number
  headline: string
  id: number
  image: string
  related: string
  source: string
  summary: string
  url: string
}

export interface CandleData {
  c: number[]
  h: number[]
  l: number[]
  o: number[]
  t: number[]
  s: string
}

// ── Düşük seviyeli fetch yardımcıları ────────────────────────────
async function fromBackend<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`Backend ${res.status}`)
  return res.json()
}

async function fromFinnhub<T>(path: string): Promise<T> {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`${FINNHUB_BASE}${path}${sep}token=${FINNHUB_KEY}`)
  if (!res.ok) throw new Error(`Finnhub ${res.status}`)
  return res.json()
}

// ── Kota getir ────────────────────────────────────────────────────
async function fetchQuoteRaw(finnhubSym: string): Promise<{ c: number; h: number; l: number; o: number; pc: number }> {
  const encoded = encodeURIComponent(finnhubSym)
  try {
    return await fromBackend(`/api/v1/market/quote?symbol=${encoded}`)
  } catch {
    return await fromFinnhub(`/quote?symbol=${encoded}`)
  }
}

// ── Public API ────────────────────────────────────────────────────
export const marketApi = {
  /** Tek enstrüman kotası — değişim hesaplanmış olarak gelir */
  async getQuote(displaySymbol: string): Promise<Quote> {
    const sym = toFinnhubSymbol(displaySymbol)
    const raw = await fetchQuoteRaw(sym)
    const change = raw.c - raw.pc
    const changePct = raw.pc ? (change / raw.pc) * 100 : 0
    return { ...raw, change, changePct }
  },

  /** Birden fazla enstrüman — başarısız olanlar atlanır */
  async getQuotes(displaySymbols: string[]): Promise<Record<string, Quote>> {
    const results: Record<string, Quote> = {}
    await Promise.allSettled(
      displaySymbols.map(async (sym) => {
        try {
          results[sym] = await this.getQuote(sym)
        } catch {
          // bu sembol atlanır
        }
      })
    )
    return results
  },

  /** Finnhub piyasa haberleri */
  async getNews(category = 'general'): Promise<FinnhubNews[]> {
    try {
      const data = await fromBackend<FinnhubNews[]>(`/api/v1/market/news?category=${category}`)
      return Array.isArray(data) ? data : []
    } catch {
      try {
        const data = await fromFinnhub<FinnhubNews[]>(`/news?category=${category}`)
        return Array.isArray(data) ? data : []
      } catch {
        return []
      }
    }
  },

  /** Mum (OHLCV) verisi — grafik için */
  async getCandle(displaySymbol: string, resolution: string, from: number, to: number): Promise<CandleData> {
    const sym = encodeURIComponent(toFinnhubSymbol(displaySymbol))
    try {
      return await fromBackend<CandleData>(
        `/api/v1/market/candle?symbol=${sym}&resolution=${resolution}&from=${from}&to=${to}`
      )
    } catch {
      return await fromFinnhub<CandleData>(
        `/stock/candle?symbol=${sym}&resolution=${resolution}&from=${from}&to=${to}`
      )
    }
  },
}

// ── Biçimlendirme yardımcıları ────────────────────────────────────
export function fmtChange(pct: number): string {
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
}

export function fmtPrice(price: number, decimals = 2): string {
  if (!price && price !== 0) return '—'
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price)
}

/** Periyot seçeneğinden from/to Unix timestamp'i hesaplar */
export function periodToRange(period: string): { from: number; to: number; resolution: string } {
  const to = Math.floor(Date.now() / 1000)
  const day = 86400
  let from: number
  let resolution: string

  switch (period) {
    case '1G':  from = to - day;        resolution = '5';  break
    case '1H':  from = to - 7 * day;    resolution = '60'; break
    case '1A':  from = to - 30 * day;   resolution = 'D';  break
    case '3A':  from = to - 90 * day;   resolution = 'D';  break
    case '6A':  from = to - 180 * day;  resolution = 'D';  break
    default:    from = to - 365 * day;  resolution = 'W';  break  // 1Y
  }
  return { from, to, resolution }
}
