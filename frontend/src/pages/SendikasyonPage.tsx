import { useState } from 'react'
import styles from './SharedPage.module.css'

const KATILIMCILAR = [
  { banka: 'Ziraat Bankası', pay: 35, tutar: 87500000, renk: '#e30613' },
  { banka: 'İş Bankası', pay: 25, tutar: 62500000, renk: '#0066cc' },
  { banka: 'Garanti BBVA', pay: 20, tutar: 50000000, renk: '#009640' },
  { banka: 'Yapı Kredi', pay: 12, tutar: 30000000, renk: '#5F259F' },
  { banka: 'Akbank', pay: 8, tutar: 20000000, renk: '#e2001a' },
]

const ODEME_TAKVIMI = [
  { no: 1, tarih: '2026-09-30', anapara: 25000000, faiz: 6543750, toplam: 31543750, durum: 'Bekleniyor' },
  { no: 2, tarih: '2026-12-31', anapara: 25000000, faiz: 5406250, toplam: 30406250, durum: 'Bekleniyor' },
  { no: 3, tarih: '2027-03-31', anapara: 25000000, faiz: 4268750, toplam: 29268750, durum: 'Bekleniyor' },
  { no: 4, tarih: '2027-06-30', anapara: 25000000, faiz: 3131250, toplam: 28131250, durum: 'Bekleniyor' },
  { no: 5, tarih: '2027-09-30', anapara: 50000000, faiz: 1993750, toplam: 51993750, durum: 'Bekleniyor' },
  { no: 0, tarih: '2026-06-30', anapara: 100000000, faiz: 7681250, toplam: 107681250, durum: 'Ödendi' },
]

const TEMINATLAR = [
  { ad: 'Fabrika Binası — Gebze', tip: 'Gayrimenkul', deger: 180000000, ipotek: '1. Derece' },
  { ad: 'Üretim Makineleri', tip: 'Taşınır', deger: 95000000, ipotek: 'Rehbinli' },
  { ad: 'Şirket Hisseleri (%40)', tip: 'Menkul Kıymet', deger: 220000000, ipotek: 'Tescilsiz' },
]

export function SendikasyonPage() {
  const [aktifTab, setAktifTab] = useState('ozet')

  const toplamKredi = 250000000
  const sofr = 5.32
  const spread = 2.50
  const toplamFaiz = sofr + spread

  const cx = 120, cy = 120, r = 90
  let startAngle = 0
  const paths = KATILIMCILAR.map(k => {
    const angle = (k.pay / 100) * 2 * Math.PI
    const x1 = cx + r * Math.sin(startAngle)
    const y1 = cy - r * Math.cos(startAngle)
    startAngle += angle
    const x2 = cx + r * Math.sin(startAngle)
    const y2 = cy - r * Math.cos(startAngle)
    const large = k.pay > 50 ? 1 : 0
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, renk: k.renk, banka: k.banka, pay: k.pay }
  })

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Sendikasyon & Büyük Ölçekli Krediler</h1>
          <p className={styles.pageSub}>Çok bankali kredi katılımı, değişken faiz takibi ve ödeme takvimi</p>
        </div>
        <button className="btn btn-secondary">Sözleşme PDF</button>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Kredi</span>
          <span className={styles.metricValue}>₺250M</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>5 banka katılımı</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Faiz Oranı</span>
          <span className={styles.metricValue}>%{toplamFaiz.toFixed(2)}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>SOFR + {spread}%</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kalan Anapara</span>
          <span className={styles.metricValue}>₺250M</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>İlk ödeme: Haz</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Teminat Değeri</span>
          <span className={styles.metricValue}>₺495M</span>
          <span className={`${styles.metricChange} ${styles.up}`}>%198 karşılama</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'ozet', l: 'Kredi Özeti' },
          { k: 'odeme', l: 'Ödeme Takvimi' },
          { k: 'teminat', l: 'Teminat Varlıkları' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'ozet' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Kredi Katılım Dağılımı</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <svg viewBox="0 0 240 240" style={{ width: 160, height: 160, flexShrink: 0 }}>
                {paths.map((p, i) => <path key={i} d={p.path} fill={p.renk} stroke="var(--bg-surface)" strokeWidth="2" />)}
                <circle cx={cx} cy={cy} r={50} fill="var(--bg-surface)" />
                <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="700">₺250M</text>
                <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--text-dim)" fontSize="8">Sendikasyon</text>
              </svg>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {KATILIMCILAR.map(k => (
                  <div key={k.banka} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: k.renk, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '0.78rem' }}>{k.banka}</span>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>%{k.pay}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>₺{(k.tutar / 1000000).toFixed(0)}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Değişken Faiz Referansı (SOFR)</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>SOFR (Güncel)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>%{sofr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Spread (Marj)</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>+%{spread}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: 600 }}>Toplam Faiz Oranı</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--loss)' }}>%{toplamFaiz.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Son güncelleme: 29 Mayıs 2026 · SOFR 3 Aylık</div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem' }}>
                {[['1 Hafta', '5.28%'], ['1 Ay', '5.35%'], ['3 Ay', '5.32%'], ['6 Ay', '5.20%']].map(([sure, oran]) => (
                  <div key={sure} style={{ textAlign: 'center', flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.35rem' }}>
                    <div style={{ color: 'var(--text-dim)' }}>{sure}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{oran}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'odeme' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>#</th><th>Tarih</th><th>Anapara (₺)</th><th>Faiz (₺)</th><th>Toplam (₺)</th><th>Durum</th></tr>
            </thead>
            <tbody>
              {[...ODEME_TAKVIMI].sort((a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime()).map((o, i) => (
                <tr key={i} style={{ background: o.durum === 'Ödendi' ? 'var(--bg-card)' : undefined, opacity: o.durum === 'Ödendi' ? 0.65 : 1 }}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{o.no === 0 ? '—' : o.no}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{o.tarih}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₺{(o.anapara / 1000000).toFixed(0)}M</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>₺{o.faiz.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{(o.toplam / 1000000).toFixed(2)}M</td>
                  <td>
                    <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: o.durum === 'Ödendi' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: o.durum === 'Ödendi' ? 'var(--profit)' : 'var(--warning)', border: '1px solid transparent' }}>{o.durum}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'teminat' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {TEMINATLAR.map((t, i) => (
            <div key={i} className={styles.sectionCard}>
              <div className={styles.cardBody} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.ad}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{t.tip}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Değer</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>₺{(t.deger / 1000000).toFixed(0)}M</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Teminat</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{t.ipotek}</div>
                </div>
                <div style={{ minWidth: 100 }}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.min(100, (toplamKredi / t.deger) * 100)}%`, background: 'var(--profit)' }} />
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Kredi/Değer: %{Math.round((toplamKredi / t.deger) * 100)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
