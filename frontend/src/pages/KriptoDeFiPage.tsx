import { useState } from 'react'
import styles from './SharedPage.module.css'

const VARLIKLAR = [
  { sembol: 'BTC', ad: 'Bitcoin', adet: 0.5, deger: 32600, degisim: +4.2, renk: '#f7931a' },
  { sembol: 'ETH', ad: 'Ethereum', adet: 2.5, deger: 9250, degisim: +2.8, renk: '#627eea' },
  { sembol: 'SOL', ad: 'Solana', adet: 15, deger: 2700, degisim: -1.4, renk: '#9945ff' },
  { sembol: 'AVAX', ad: 'Avalanche', adet: 30, deger: 1140, degisim: +6.1, renk: '#e84142' },
  { sembol: 'USDT', ad: 'Tether', adet: 5000, deger: 5000, degisim: 0, renk: '#26a17b' },
]

const STAKING = [
  { sembol: 'ETH', protokol: 'Lido', apy: '4.2%', miktar: 1.5, gunlukGetiri: 0.000173, renk: '#627eea' },
  { sembol: 'SOL', protokol: 'Marinade', apy: '6.8%', miktar: 10, gunlukGetiri: 0.00186, renk: '#9945ff' },
  { sembol: 'AVAX', protokol: 'Benqi', apy: '8.5%', miktar: 20, gunlukGetiri: 0.00466, renk: '#e84142' },
]

export function KriptoDeFiPage() {
  const [aktifTab, setAktifTab] = useState('cuzdan')
  const [bagli, setBagli] = useState(false)
  const [swapFrom, setSwapFrom] = useState('ETH')
  const [swapTo, setSwapTo] = useState('BTC')
  const [swapMiktar, setSwapMiktar] = useState('')

  const toplamDeger = VARLIKLAR.reduce((s, v) => s + v.deger, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kripto Cüzdan & DeFi</h1>
          <p className={styles.pageSub}>Toplam Değer: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₺{(toplamDeger * 38.42).toLocaleString('tr-TR')}</span> (${toplamDeger.toLocaleString()})</p>
        </div>
        {!bagli ? (
          <button className="btn btn-primary" onClick={() => setBagli(true)}>
            🦊 MetaMask Bağla
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.45rem 0.85rem', background: 'var(--accent-dim)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 'var(--radius)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--profit)' }}>●</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>0x1a2b...3c4d</span>
            <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>Kes</button>
          </div>
        )}
      </div>

      <div className={styles.tabs}>
        {['cuzdan', 'swap', 'staking', 'nft', 'gas'].map(t => (
          <button key={t} className={`${styles.tab} ${aktifTab === t ? styles.tabActive : ''}`} onClick={() => setAktifTab(t)}>
            {{ cuzdan: 'Cüzdan', swap: 'Swap', staking: 'Staking', nft: 'NFT', gas: 'Gas & Ağlar' }[t]}
          </button>
        ))}
      </div>

      {/* ── Cüzdan ── */}
      {aktifTab === 'cuzdan' && (
        <>
          <div className={styles.metricsRow}>
            <div className={styles.metricCard}><span className={styles.metricLabel}>Toplam Portföy ($)</span><span className={styles.metricValue} style={{ fontSize: '1.2rem' }}>${toplamDeger.toLocaleString()}</span></div>
            <div className={styles.metricCard}><span className={styles.metricLabel}>Toplam Portföy (₺)</span><span className={styles.metricValue} style={{ fontSize: '1.2rem' }}>₺{(toplamDeger * 38.42).toLocaleString('tr-TR')}</span></div>
            <div className={styles.metricCard}><span className={styles.metricLabel}>24s Değişim</span><span className={styles.metricValue} style={{ fontSize: '1.2rem', color: 'var(--profit)' }}>+$1.842</span><span className={`${styles.metricChange} ${styles.up}`}>+3.6%</span></div>
            <div className={styles.metricCard}><span className={styles.metricLabel}>Staking Getirisi</span><span className={styles.metricValue} style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>+$4.2/gün</span></div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Varlıklarım</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Gönder</button>
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Al</button>
              </div>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Varlık</th>
                  <th>Adet</th>
                  <th>Değer ($)</th>
                  <th>Değer (₺)</th>
                  <th>Portföy %</th>
                  <th style={{ textAlign: 'right' }}>24s Değişim</th>
                </tr>
              </thead>
              <tbody>
                {VARLIKLAR.map(v => (
                  <tr key={v.sembol}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${v.renk}22`, border: `1px solid ${v.renk}44`, display: 'grid', placeItems: 'center', fontSize: '0.65rem', fontWeight: 700, color: v.renk }}>
                          {v.sembol[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{v.sembol}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{v.ad}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{v.adet}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${v.deger.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₺{(v.deger * 38.42).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ width: `${(v.deger/toplamDeger)*100}%`, height: '100%', background: v.renk, borderRadius: 100 }}></div>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>{((v.deger/toplamDeger)*100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: v.degisim > 0 ? 'var(--profit)' : v.degisim < 0 ? 'var(--loss)' : 'var(--text-dim)', fontWeight: 600 }}>
                      {v.degisim > 0 ? '+' : ''}{v.degisim}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Swap ── */}
      {aktifTab === 'swap' && (
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Token Swap (DEX)</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* From */}
              <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <span>Göndereceğim</span>
                  <span>Bakiye: 2.5 ETH</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input className={styles.input} style={{ flex: 1, fontSize: '1.2rem', background: 'transparent', border: 'none', padding: 0 }} placeholder="0.0" value={swapMiktar} onChange={e => setSwapMiktar(e.target.value)} type="number" />
                  <select className={styles.select} value={swapFrom} onChange={e => setSwapFrom(e.target.value)}>
                    {VARLIKLAR.map(v => <option key={v.sembol}>{v.sembol}</option>)}
                  </select>
                </div>
              </div>

              {/* Swap icon */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => { const t = swapFrom; setSwapFrom(swapTo); setSwapTo(t) }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '1rem' }}>
                  ⇅
                </button>
              </div>

              {/* To */}
              <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <span>Alacağım</span>
                  <span>≈ Tahmin</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: swapMiktar ? 'var(--accent)' : 'var(--text-dim)' }}>
                    {swapMiktar ? (Number(swapMiktar) * 16.82).toFixed(6) : '0.0'}
                  </div>
                  <select className={styles.select} value={swapTo} onChange={e => setSwapTo(e.target.value)}>
                    {VARLIKLAR.map(v => <option key={v.sembol}>{v.sembol}</option>)}
                  </select>
                </div>
              </div>

              {/* Ağ seçimi */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block' }}>Blokzincir Ağı</label>
                <div className={styles.filterGroup}>
                  {['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'].map(n => (
                    <button key={n} className={`${styles.filterTag} ${n === 'Ethereum' ? styles.filterTagActive : ''}`}>{n}</button>
                  ))}
                </div>
              </div>

              {swapMiktar && (
                <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Kur</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>1 {swapFrom} = 16.82 {swapTo}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Slippage Toleransı</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>0.5%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Gas Ücreti (tahmini)</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>≈ $3.40</span>
                  </div>
                </div>
              )}

              <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}>
                {!bagli ? '🦊 Cüzdan Bağla' : `Swap: ${swapFrom} → ${swapTo}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Staking ── */}
      {aktifTab === 'staking' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Staking & Likidite Havuzları</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STAKING.map(s => (
              <div key={s.sembol} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${s.renk}22`, border: `1px solid ${s.renk}44`, display: 'grid', placeItems: 'center', fontWeight: 700, color: s.renk, fontSize: '0.72rem', flexShrink: 0 }}>{s.sembol[0]}</div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{s.sembol} — {s.protokol}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Stake: {s.miktar} {s.sembol}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)', fontSize: '1rem' }}>{s.apy}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>APY</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)' }}>+{s.gunlukGetiri} {s.sembol}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Günlük Getiri</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ fontSize: '0.72rem' }}>Daha Fazla Stake</button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.72rem' }}>Çek</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NFT ── */}
      {aktifTab === 'nft' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>NFT Galerisi</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', padding: '1rem' }}>
            {[
              { ad: 'CryptoPunk #4521', koleksiyon: 'CryptoPunks', deger: '$12,400', renk: '#6c5ce7' },
              { ad: 'BAYC #8822', koleksiyon: 'Bored Apes', deger: '$28,000', renk: '#e17055' },
              { ad: 'Azuki #391', koleksiyon: 'Azuki', deger: '$3,200', renk: '#fd79a8' },
              { ad: 'Doodle #1177', koleksiyon: 'Doodles', deger: '$1,800', renk: '#f0b429' },
            ].map(n => (
              <div key={n.ad} style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-card)' }}>
                <div style={{ height: 140, background: `linear-gradient(135deg, ${n.renk}33, ${n.renk}11)`, display: 'grid', placeItems: 'center', fontSize: '2.5rem' }}>🎨</div>
                <div style={{ padding: '0.65rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.15rem' }}>{n.ad}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{n.koleksiyon}</div>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: n.renk, marginTop: '0.3rem', fontWeight: 700 }}>{n.deger}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Gas ── */}
      {aktifTab === 'gas' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Gas Ücreti Tahmini (Ethereum)</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { hiz: 'Yavaş', gwei: 22, sure: '~5 dakika', maliyet: '$1.20', renk: 'var(--profit)' },
                { hiz: 'Standart', gwei: 35, sure: '~1 dakika', maliyet: '$1.90', renk: 'var(--warning)' },
                { hiz: 'Hızlı', gwei: 55, sure: '~15 saniye', maliyet: '$3.00', renk: 'var(--loss)' },
              ].map(g => (
                <div key={g.hiz} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: `1px solid ${g.renk}33`, cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: g.renk }}>{g.hiz}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{g.sure}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{g.gwei} Gwei</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{g.maliyet}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Desteklenen Ağlar</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { ad: 'Ethereum', sembol: 'ETH', blok: '19.842.177', renk: '#627eea' },
                { ad: 'BNB Smart Chain', sembol: 'BNB', blok: '38.124.456', renk: '#f3ba2f' },
                { ad: 'Polygon', sembol: 'MATIC', blok: '54.789.001', renk: '#8247e5' },
                { ad: 'Arbitrum One', sembol: 'ARB', blok: '187.234.091', renk: '#28a0f0' },
                { ad: 'Solana', sembol: 'SOL', blok: '312.445.882', renk: '#9945ff' },
              ].map(n => (
                <div key={n.ad} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.renk, flexShrink: 0 }}></div>
                  <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 500 }}>{n.ad}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Blok #{n.blok}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--profit)' }}>● Aktif</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
