import { useState } from 'react'
import styles from './SharedPage.module.css'

const EMTIALAR = [
  { id: 1, ad: 'Ham Petrol (Brent)', sembol: 'BRENT', fiyat: 6824, doviz: 'USD/varil', degisim: +1.42, renk: '#1a1a2e', emoji: '🛢' },
  { id: 2, ad: 'Doğal Gaz', sembol: 'NATGAS', fiyat: 312.80, doviz: '$/MMBtu', degisim: -0.85, renk: '#16213e', emoji: '🔥' },
  { id: 3, ad: 'Buğday', sembol: 'WHEAT', fiyat: 5.42, doviz: '$/buşel', degisim: +2.15, renk: '#f0b429', emoji: '🌾' },
  { id: 4, ad: 'Kahve (Arabica)', sembol: 'COFFEE', fiyat: 2.18, doviz: '$/libre', degisim: -1.20, renk: '#6B3A2A', emoji: '☕' },
  { id: 5, ad: 'Altın', sembol: 'GOLD', fiyat: 3420, doviz: '$/ons', degisim: +0.62, renk: '#f0b429', emoji: '🥇' },
  { id: 6, ad: 'Gümüş', sembol: 'SILVER', fiyat: 32.80, doviz: '$/ons', degisim: +1.05, renk: '#a8a9ad', emoji: '🥈' },
]

const SEZONSAL_DATA = {
  labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  arz: [85, 80, 75, 70, 65, 60, 90, 100, 95, 88, 82, 80],
  talep: [75, 78, 82, 88, 92, 95, 88, 70, 72, 80, 85, 90],
}

export function EmtiaPage() {
  const [aktifTab, setAktifTab] = useState('fiyatlar')
  const [depoMiktari, setDepoMiktari] = useState('')
  const [depoTuru, setDepoTuru] = useState('Buğday')
  const [karbonMiktar, setKarbonMiktar] = useState('')
  const [karbonIslem, setKarbonIslem] = useState<'al' | 'sat'>('al')

  const svgW = 480, svgH = 120, pad = 30
  const maxVal = Math.max(...SEZONSAL_DATA.arz, ...SEZONSAL_DATA.talep)
  const minVal = 50

  const toX = (i: number) => pad + (i / (SEZONSAL_DATA.labels.length - 1)) * (svgW - pad * 2)
  const toY = (v: number) => svgH - pad - ((v - minVal) / (maxVal - minVal)) * (svgH - pad * 2)

  const arzPath = SEZONSAL_DATA.arz.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')
  const talepPath = SEZONSAL_DATA.talep.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Emtia & Enerji Piyasaları</h1>
          <p className={styles.pageSub}>Petrol, gaz, tarımsal emtia ve karbon kredi işlemleri</p>
        </div>
        <button className="btn btn-primary">+ Emir Gir</button>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'fiyatlar', l: 'Canlı Fiyatlar' },
          { k: 'sezonsal', l: 'Mevsimsel Arz/Talep' },
          { k: 'depo', l: 'Fiziki Depo Makbuzu' },
          { k: 'karbon', l: 'Karbon Kredi' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'fiyatlar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className={styles.grid3}>
            {EMTIALAR.map(e => (
              <div key={e.id} className={styles.sectionCard}>
                <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{e.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{e.ad}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{e.sembol}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.15rem' }}>{e.fiyat.toLocaleString('tr-TR')}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{e.doviz}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.82rem', color: e.degisim >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                    {e.degisim >= 0 ? '+' : ''}{e.degisim}%
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.68rem' }}>Al</button>
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.68rem' }}>Sat</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aktifTab === 'sezonsal' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Buğday — Mevsimsel Arz & Talep Grafiği</span>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 12, height: 3, background: 'var(--accent)', display: 'inline-block', borderRadius: 2 }} />Arz</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 12, height: 3, background: 'var(--loss)', display: 'inline-block', borderRadius: 2 }} />Talep</span>
            </div>
          </div>
          <div className={styles.cardBody}>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              {[0, 0.5, 1].map(t => {
                const y = svgH - pad - t * (svgH - pad * 2)
                const val = Math.round(minVal + t * (maxVal - minVal))
                return (
                  <g key={t}>
                    <line x1={pad} y1={y} x2={svgW - pad} y2={y} stroke="var(--border)" strokeWidth="0.5" />
                    <text x={pad - 4} y={y + 4} textAnchor="end" fill="var(--text-dim)" fontSize="9">{val}</text>
                  </g>
                )
              })}
              <path d={arzPath} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={talepPath} stroke="var(--loss)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {SEZONSAL_DATA.arz.map((v, i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill="var(--accent)" />
              ))}
              {SEZONSAL_DATA.talep.map((v, i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill="var(--loss)" />
              ))}
              {SEZONSAL_DATA.labels.map((l, i) => (
                <text key={l} x={toX(i)} y={svgH - 6} textAnchor="middle" fill="var(--text-dim)" fontSize="8">{l}</text>
              ))}
            </svg>
            <div className={`${styles.alertCard} ${styles.alertInfo}`} style={{ marginTop: '0.75rem' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#0066ff" strokeWidth="1.2"/><line x1="7" y1="6" x2="7" y2="10" stroke="#0066ff" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="4.5" r="0.6" fill="#0066ff"/></svg>
              <span style={{ fontSize: '0.78rem' }}>Hasat sezonu (Temmuz-Eylül): Arz pik, talep düşük. Fiyat baskısı bekleniyor. Mayıs-Haziran: Arz kıtlık, iyi alım fırsatı.</span>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'depo' && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Fiziki Depo Makbuzu Girişi</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Emtia Türü</label>
                <select className={styles.select} style={{ width: '100%' }} value={depoTuru} onChange={e => setDepoTuru(e.target.value)}>
                  {['Buğday', 'Mısır', 'Çeltik (Pirinç)', 'Fındık', 'Pamuk', 'Çay'].map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Miktar (ton)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} placeholder="Örn: 50" value={depoMiktari} onChange={e => setDepoMiktari(e.target.value)} />
              </div>
              {[
                { l: 'Depo', p: 'TMO — Polatlı Lisanslı Depo' },
                { l: 'Makbuz No', p: 'LDM-2026-XXXX' },
                { l: 'Depo Tarihi', p: 'gg/aa/yyyy' },
              ].map(f => (
                <div key={f.l}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>{f.l}</label>
                  <input className={styles.input} style={{ width: '100%' }} placeholder={f.p} />
                </div>
              ))}
              <button className="btn btn-primary" style={{ width: '100%' }}>Depo Makbuzu Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'karbon' && (
        <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.metricsRow}>
            {[
              { l: 'Karbon Kredi Fiyatı', v: '€62.40/ton', renk: 'var(--profit)' },
              { l: 'Sahip Olduğum', v: '1.200 ton', renk: 'var(--accent)' },
              { l: 'Portföy Değeri', v: '€74.880', renk: 'var(--text)' },
            ].map(m => (
              <div key={m.l} className={styles.metricCard}>
                <span className={styles.metricLabel}>{m.l}</span>
                <span className={styles.metricValue} style={{ color: m.renk, fontSize: '1rem' }}>{m.v}</span>
              </div>
            ))}
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Karbon Kredi Al / Sat</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['al', 'sat'] as const).map(t => (
                  <button key={t} onClick={() => setKarbonIslem(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${karbonIslem === t ? (t === 'al' ? 'rgba(0,212,170,0.4)' : 'rgba(255,71,87,0.4)') : 'var(--border)'}`, background: karbonIslem === t ? (t === 'al' ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)') : 'transparent', color: karbonIslem === t ? (t === 'al' ? 'var(--profit)' : 'var(--loss)') : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                    {t === 'al' ? 'Kredi Satın Al' : 'Kredi Sat'}
                  </button>
                ))}
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Miktar (ton CO₂)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} placeholder="Örn: 100" value={karbonMiktar} onChange={e => setKarbonMiktar(e.target.value)} />
              </div>
              {karbonMiktar && (
                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Tahmini Tutar</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>€{(parseFloat(karbonMiktar) * 62.40).toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <button className="btn btn-primary" style={{ width: '100%' }}>{karbonIslem === 'al' ? 'Sözleşme Satın Al' : 'Sözleşme Sat'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
