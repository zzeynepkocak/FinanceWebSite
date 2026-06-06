import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

type Coin = 'BTC' | 'ETH' | 'BNB' | 'SOL'

const BORSALAR = ['Binance', 'Coinbase', 'Kraken', 'OKX'] as const

const FIYATLAR: Record<Coin, Record<string, number>> = {
  BTC: { Binance: 2184250, Coinbase: 2186100, Kraken: 2183800, OKX: 2187400 },
  ETH: { Binance: 119840, Coinbase: 120200, Kraken: 119650, OKX: 120420 },
  BNB: { Binance: 21840, Coinbase: 21920, Kraken: 21780, OKX: 21900 },
  SOL: { Binance: 6240, Coinbase: 6310, Kraken: 6190, OKX: 6280 },
}

const FIRSATLAR = [
  { coin: 'ETH', al: 'Kraken', sat: 'OKX', farkYuzde: 0.65, transferSure: '~8 dk', agUcreti: 120, netKar: 650 },
  { coin: 'BTC', al: 'Kraken', sat: 'OKX', farkYuzde: 0.17, transferSure: '~12 dk', agUcreti: 890, netKar: 2420 },
  { coin: 'SOL', al: 'Kraken', sat: 'Coinbase', farkYuzde: 1.94, transferSure: '~2 dk', agUcreti: 45, netKar: 890 },
]

const COINLER: Coin[] = ['BTC', 'ETH', 'BNB', 'SOL']

export function ArbitrajPage() {
  const { toast, show } = useToast()
  const [aktifCoin, setAktifCoin] = useState<Coin>('BTC')
  const [aktifTab, setAktifTab] = useState('matris')
  const [transferGonderildi, setTransferGonderildi] = useState<string | null>(null)

  const fiyatlar = FIYATLAR[aktifCoin]
  const minFiyat = Math.min(...Object.values(fiyatlar))
  const maxFiyat = Math.max(...Object.values(fiyatlar))
  const farkYuzde = ((maxFiyat - minFiyat) / minFiyat * 100).toFixed(3)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Arbitraj & Fiyat Farkı Monitörü</h1>
          <p className={styles.pageSub}>Borsa arası canlı fiyat karşılaştırması ve kar fırsatları</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Arbitraj alarmı kuruldu, fırsatlar takip ediliyor', 'success')}>Fırsat Alarmı Kur</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>En Yüksek BTC Farki</span>
          <span className={styles.metricValue}>%{farkYuzde}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Kraken → OKX</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aktif Fırsat</span>
          <span className={styles.metricValue}>{FIRSATLAR.length}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>şu anda izleniyor</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>En İyi Net Kâr</span>
          <span className={styles.metricValue}>₺2.420</span>
          <span className={`${styles.metricChange} ${styles.up}`}>BTC — Kraken→OKX</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Son Güncelleme</span>
          <span className={styles.metricValue} style={{ fontSize: '0.9rem' }}>15:42:07</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>Canlı veriler</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'matris', l: 'Fiyat Matrisi' },
          { k: 'firsatlar', l: 'Fırsat Penceresi' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'matris' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {COINLER.map(c => (
              <button key={c} className={`${styles.filterTag} ${aktifCoin === c ? styles.filterTagActive : ''}`} onClick={() => setAktifCoin(c)}>{c}</button>
            ))}
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Borsa</th>
                  <th>{aktifCoin} Fiyatı (₺)</th>
                  <th>Min Farkı</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {BORSALAR.map(b => {
                  const fiyat = fiyatlar[b]
                  const fark = fiyat - minFiyat
                  const isMin = fiyat === minFiyat
                  const isMax = fiyat === maxFiyat
                  return (
                    <tr key={b} style={{ background: isMax ? 'rgba(0,212,170,0.04)' : isMin ? 'rgba(255,71,87,0.04)' : undefined }}>
                      <td style={{ fontWeight: 600 }}>{b}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem', color: isMax ? 'var(--profit)' : isMin ? 'var(--loss)' : 'var(--text)' }}>
                        ₺{fiyat.toLocaleString('tr-TR')}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: fark > 0 ? 'var(--profit)' : 'var(--text-dim)' }}>
                        {fark > 0 ? `+₺${fark.toLocaleString('tr-TR')}` : '— (En Düşük)'}
                      </td>
                      <td>
                        <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, background: isMax ? 'rgba(0,212,170,0.1)' : isMin ? 'rgba(255,71,87,0.1)' : 'var(--bg-card)', color: isMax ? 'var(--profit)' : isMin ? 'var(--loss)' : 'var(--text-dim)', border: '1px solid transparent' }}>
                          {isMax ? 'En Yüksek' : isMin ? 'En Düşük' : 'Orta'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className={`${styles.alertCard} ${styles.alertInfo}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#0066ff" strokeWidth="1.2"/><line x1="7" y1="6" x2="7" y2="10" stroke="#0066ff" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="4.5" r="0.6" fill="#0066ff"/></svg>
            <span style={{ fontSize: '0.78rem' }}>Arbitraj kârlılığı için: transfer süresi, ağ ücretleri ve işlem ücretleri hesaplamaya dahil edilmelidir. Gösterilen farklar brüt değerlerdir.</span>
          </div>
        </div>
      )}

      {aktifTab === 'firsatlar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FIRSATLAR.map((f, i) => (
            <div key={i} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-dim)', border: '1px solid rgba(0,212,170,0.3)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.75rem', color: 'var(--accent)' }}>
                    {f.coin}
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{f.coin}: {f.al} → {f.sat}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Transfer süresi: {f.transferSure}</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--profit)' }}>%{f.farkYuzde}</span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  { l: 'Ağ Ücreti', v: `₺${f.agUcreti}` },
                  { l: 'Net Kâr (Tahmini)', v: `₺${f.netKar.toLocaleString('tr-TR')}` },
                  { l: 'Fiyat Farkı', v: `%${f.farkYuzde}` },
                ].map(item => (
                  <div key={item.l}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.l}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '0.2rem', color: item.l.includes('Kâr') ? 'var(--profit)' : 'var(--text)' }}>{item.v}</div>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto' }}>
                  {transferGonderildi === `${f.coin}-${i}` ? (
                    <div className={`${styles.alertCard} ${styles.alertSuccess}`} style={{ padding: '0.35rem 0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--profit)' }}>Transfer başlatıldı</span>
                    </div>
                  ) : (
                    <button className="btn btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => setTransferGonderildi(`${f.coin}-${i}`)}>
                      Tek Tıkla Transfer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
