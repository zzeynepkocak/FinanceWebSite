import { useState } from 'react'
import styles from './SharedPage.module.css'

const POZISYONLAR = [
  { sembol: 'BTCUSDT', yon: 'Long', kaldirac: 10, giris: 62400, guncel: 65200, miktar: 0.5, marjin: 3120, pnl: 1400, pnlPct: 22.44, likidasyon: 56700, taraf: 'Isolated' },
  { sembol: 'ETHUSDT', yon: 'Short', kaldirac: 5, giris: 3450, guncel: 3380, miktar: 2, marjin: 1380, pnl: 140, pnlPct: 5.07, likidasyon: 3795, taraf: 'Cross' },
  { sembol: 'XAUUSDT', yon: 'Long', kaldirac: 20, giris: 2920, guncel: 2960, miktar: 1, marjin: 146, pnl: 40, pnlPct: 13.70, likidasyon: 2774, taraf: 'Isolated' },
]

const FUNDING_RATES = [
  { sembol: 'BTCUSDT', rate: '+0.0100%', sonrakiSure: '02:14:38', color: 'var(--profit)' },
  { sembol: 'ETHUSDT', rate: '-0.0050%', sonrakiSure: '02:14:38', color: 'var(--loss)' },
  { sembol: 'SOLUSDT', rate: '+0.0080%', sonrakiSure: '02:14:38', color: 'var(--profit)' },
]

export function VadeliIslemlerPage() {
  const [aktifTab, setAktifTab] = useState('pozisyonlar')
  const [kaldirac, setKaldirac] = useState(10)
  const [marjinTipi, setMarjinTipi] = useState<'Isolated' | 'Cross'>('Isolated')
  const [yon, setYon] = useState<'Long' | 'Short'>('Long')
  const [tutar, setTutar] = useState('')

  const girisFiyati = 65200
  const likidasyon = marjinTipi === 'Isolated'
    ? yon === 'Long'
      ? (girisFiyati * (1 - 1/kaldirac) * 0.97).toFixed(2)
      : (girisFiyati * (1 + 1/kaldirac) * 1.03).toFixed(2)
    : 'Hesaplanıyor...'

  const marjin = tutar && !isNaN(Number(tutar)) ? (Number(tutar) / kaldirac).toFixed(2) : '—'

  const totalPnl = POZISYONLAR.reduce((s, p) => s + p.pnl, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Vadeli İşlemler & Kaldıraçlı Trading</h1>
          <p className={styles.pageSub}>{POZISYONLAR.length} açık pozisyon · Toplam PNL: <span style={{ color: totalPnl > 0 ? 'var(--profit)' : 'var(--loss)', fontWeight: 700 }}>{totalPnl > 0 ? '+' : ''}₺{totalPnl.toLocaleString('tr-TR')}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: 'var(--radius)', fontSize: '0.78rem', color: 'var(--loss)' }}>
          ⚠️ Yüksek Risk: Kaldıraçlı işlemler tüm sermayenizi kaybettirebilir
        </div>
      </div>

      <div className={styles.tabs}>
        {['pozisyonlar', 'emir-gir', 'funding', 'risk'].map(t => (
          <button key={t} className={`${styles.tab} ${aktifTab === t ? styles.tabActive : ''}`} onClick={() => setAktifTab(t)}>
            {{ pozisyonlar: 'Açık Pozisyonlar', 'emir-gir': 'Emir Gir', funding: 'Funding Rate', risk: 'Risk Analizi' }[t]}
          </button>
        ))}
      </div>

      {/* ── Açık Pozisyonlar ── */}
      {aktifTab === 'pozisyonlar' && (
        <div className={styles.sectionCard}>
          <div className={styles.tableWrap} style={{ border: 'none' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sembol</th>
                  <th>Yön</th>
                  <th>Kaldıraç</th>
                  <th>Marjin Tipi</th>
                  <th>Giriş Fiyatı</th>
                  <th>Güncel Fiyat</th>
                  <th>Miktar</th>
                  <th>Marjin</th>
                  <th>Likidasyon</th>
                  <th style={{ textAlign: 'right' }}>PNL</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {POZISYONLAR.map(p => (
                  <tr key={p.sembol}>
                    <td style={{ fontWeight: 700 }}>{p.sembol}</td>
                    <td>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: p.yon === 'Long' ? 'rgba(0,212,170,0.15)' : 'rgba(255,71,87,0.15)', color: p.yon === 'Long' ? 'var(--profit)' : 'var(--loss)', border: `1px solid ${p.yon === 'Long' ? 'rgba(0,212,170,0.3)' : 'rgba(255,71,87,0.3)'}` }}>
                        {p.yon === 'Long' ? '↑ Long' : '↓ Short'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{p.kaldirac}x</td>
                    <td><span className="badge badge-neutral">{p.taraf}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${p.giris.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${p.guncel.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{p.miktar}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>${p.marjin.toLocaleString()}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)', fontSize: '0.78rem' }}>
                        ${Number(p.likidasyon).toLocaleString()}
                      </span>
                      {/* Maintenance margin bar */}
                      <div className={styles.progressBar} style={{ marginTop: '0.25rem', height: 4 }}>
                        <div className={styles.progressFill} style={{ width: '65%', background: '#f0b429' }}></div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: p.pnl > 0 ? 'var(--profit)' : 'var(--loss)' }}>
                        {p.pnl > 0 ? '+' : ''}${p.pnl}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: p.pnlPct > 0 ? 'var(--profit)' : 'var(--loss)' }}>
                        {p.pnlPct > 0 ? '+' : ''}{p.pnlPct}%
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}>TP/SL</button>
                        <button className="btn btn-danger" style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}>Kapat</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Emir Gir ── */}
      {aktifTab === 'emir-gir' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Emir Paneli</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Long/Short seç */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
                <button onClick={() => setYon('Long')} style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', border: `1px solid ${yon === 'Long' ? 'rgba(0,212,170,0.5)' : 'var(--border)'}`, background: yon === 'Long' ? 'rgba(0,212,170,0.12)' : 'transparent', color: yon === 'Long' ? 'var(--profit)' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>
                  ↑ Long / Al
                </button>
                <button onClick={() => setYon('Short')} style={{ padding: '0.65rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', border: `1px solid ${yon === 'Short' ? 'rgba(255,71,87,0.5)' : 'var(--border)'}`, background: yon === 'Short' ? 'rgba(255,71,87,0.1)' : 'transparent', color: yon === 'Short' ? 'var(--loss)' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>
                  ↓ Short / Sat
                </button>
              </div>

              {/* Marjin tipi */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block' }}>Marjin Tipi</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  {(['Isolated', 'Cross'] as const).map(t => (
                    <button key={t} onClick={() => setMarjinTipi(t)} style={{ padding: '0.5rem', border: `1px solid ${marjinTipi === t ? 'var(--accent)' : 'var(--border)'}`, background: marjinTipi === t ? 'var(--accent-dim)' : 'transparent', color: marjinTipi === t ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', borderRadius: t === 'Isolated' ? 'var(--radius-sm) 0 0 var(--radius-sm)' : '0 var(--radius-sm) var(--radius-sm) 0' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kaldıraç */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Kaldıraç</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem' }}>{kaldirac}x</span>
                </div>
                <input type="range" min={1} max={100} value={kaldirac} onChange={e => setKaldirac(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  {[1, 5, 10, 20, 50, 100].map(v => <span key={v} style={{ cursor: 'pointer' }} onClick={() => setKaldirac(v)}>{v}x</span>)}
                </div>
              </div>

              {/* Tutar */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block' }}>Emir Tutarı (USDT)</label>
                <input className={styles.input} style={{ width: '100%', boxSizing: 'border-box' }} placeholder="0.00" value={tutar} onChange={e => setTutar(e.target.value)} type="number" />
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {[25, 50, 75, 100].map(p => (
                    <button key={p} className={styles.filterTag} style={{ flex: 1, textAlign: 'center' }}>{p}%</button>
                  ))}
                </div>
              </div>

              {/* TP/SL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--profit)', marginBottom: '0.3rem', display: 'block' }}>Kar Al (TP)</label>
                  <input className={styles.input} style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Opsiyonel" />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--loss)', marginBottom: '0.3rem', display: 'block' }}>Zarar Durdur (SL)</label>
                  <input className={styles.input} style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Opsiyonel" />
                </div>
              </div>

              {/* Özet */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Gerekli Marjin</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${marjin}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Likidasyon Fiyatı</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>${likidasyon}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Açılış Ücreti (0.02%)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{tutar ? `$${(Number(tutar) * 0.0002).toFixed(4)}` : '—'}</span>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', background: yon === 'Long' ? 'rgba(0,212,170,0.8)' : 'rgba(255,71,87,0.8)', border: 'none', fontWeight: 700, fontSize: '0.9rem', padding: '0.75rem' }}>
                {yon === 'Long' ? '↑ Long Aç' : '↓ Short Aç'} — {kaldirac}x
              </button>
            </div>
          </div>

          {/* Sağ: Bilgi kartları */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Emir Tipleri</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { tip: 'Market', desc: 'Anlık piyasa fiyatından al/sat', aktif: true },
                  { tip: 'Limit', desc: 'Belirttiğin fiyatta gerçekleştirir' },
                  { tip: 'Stop-Limit', desc: 'Tetiklenme + limit fiyat kombinasyonu' },
                  { tip: 'Trailing Stop', desc: 'Fiyat hareketiyle birlikte kayar' },
                ].map(e => (
                  <div key={e.tip} style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${e.aktif ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`, background: e.aktif ? 'var(--accent-dim)' : 'transparent', cursor: 'pointer' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: e.aktif ? 'var(--accent)' : 'var(--text)' }}>{e.tip}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{e.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Sürdürme Marjini (BTCUSDT)</span></div>
              <div className={styles.cardBody}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Mevcut: <span style={{ color: 'var(--profit)', fontWeight: 700 }}>58.4%</span> — Güvenli bölge
                </div>
                <div style={{ height: 20, background: 'var(--border)', borderRadius: 100, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ width: '58.4%', height: '100%', background: 'linear-gradient(to right, #00d4aa, #f0b429)', borderRadius: 100 }}></div>
                  <div style={{ position: 'absolute', left: '75%', top: 0, bottom: 0, width: 2, background: 'var(--loss)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                  <span>0% (Likidasyon)</span>
                  <span>75% Uyarı</span>
                  <span>100% Güvenli</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Funding Rates ── */}
      {aktifTab === 'funding' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Finansman Oranları (Funding Rate)</span></div>
          <div className={styles.cardBody}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Her 8 saatte bir hesaplanır. Pozitif oran: Long'lar Short'lara öder. Negatif oran: Short'lar Long'lara öder.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sembol</th>
                  <th>Funding Rate</th>
                  <th>Sonraki Ödeme</th>
                  <th>8s Tahmin</th>
                </tr>
              </thead>
              <tbody>
                {FUNDING_RATES.map(f => (
                  <tr key={f.sembol}>
                    <td style={{ fontWeight: 700 }}>{f.sembol}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: f.color }}>{f.rate}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>⏱ {f.sonrakiSure}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '0.75rem' }}>%8.76 yıllık</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Risk Analizi ── */}
      {aktifTab === 'risk' && (
        <div className={styles.grid2}>
          {[
            { label: 'Toplam Kullanılan Marjin', value: '$4.646', color: 'var(--accent)' },
            { label: 'Kullanılabilir Bakiye', value: '$18.354', color: 'var(--profit)' },
            { label: 'Marjin Kullanım Oranı', value: '20.2%', color: 'var(--warning)' },
            { label: 'Tahmini Tasfiye', value: 'Yok', color: 'var(--text-dim)' },
          ].map(m => (
            <div key={m.label} className={styles.metricCard}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue} style={{ color: m.color }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
