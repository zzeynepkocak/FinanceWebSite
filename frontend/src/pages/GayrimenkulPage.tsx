import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const MÜLKLER = [
  {
    id: 1, tip: 'Konut', ad: 'Ataşehir Rezidans', konum: 'İstanbul, Ataşehir',
    deger: 4800000, kiraGeliri: 28000, metrekare: 120, yil: 2019,
    durum: 'Kiralanmış', renk: '#0066ff', kiracı: 'Ahmet Yılmaz',
    sonKira: '2026-11-30',
  },
  {
    id: 2, tip: 'Ofis', ad: 'Maslak Plaza Ofisi', konum: 'İstanbul, Maslak',
    deger: 2200000, kiraGeliri: 35000, metrekare: 85, yil: 2017,
    durum: 'Kiralanmış', renk: '#9945ff', kiracı: 'TechCorp A.Ş.',
    sonKira: '2026-08-31',
  },
  {
    id: 3, tip: 'Arsa', ad: 'Çekmeköy Arsası', konum: 'İstanbul, Çekmeköy',
    deger: 1800000, kiraGeliri: 0, metrekare: 500, yil: 2021,
    durum: 'Boş', renk: '#f0b429', kiracı: '—',
    sonKira: '—',
  },
]

const ARAÇLAR = [
  { plaka: '34 ABC 1234', marka: 'Toyota Corolla', yil: 2022, deger: 1240000 },
  { plaka: '06 XYZ 5678', marka: 'Ford Transit (Ticari)', yil: 2020, deger: 820000 },
]

const BÖLGE_FİYATLARI = [
  { bolge: 'Ataşehir', fiyatM2: 42000, artis12ay: 38.2, renk: '#0066ff' },
  { bolge: 'Kadıköy', fiyatM2: 68000, artis12ay: 44.1, renk: '#00a651' },
  { bolge: 'Beşiktaş', fiyatM2: 85000, artis12ay: 41.8, renk: '#e30613' },
  { bolge: 'Maslak', fiyatM2: 55000, artis12ay: 35.6, renk: '#9945ff' },
  { bolge: 'Çekmeköy', fiyatM2: 22000, artis12ay: 52.3, renk: '#f0b429' },
]

export function GayrimenkulPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('mulkler')
  const [plakaArama, setPlakaArama] = useState('')

  const toplamDeger = MÜLKLER.reduce((s, m) => s + m.deger, 0) + ARAÇLAR.reduce((s, a) => s + a.deger, 0)
  const toplamKira = MÜLKLER.reduce((s, m) => s + m.kiraGeliri, 0)

  const araçBulunan = ARAÇLAR.find(a => a.plaka.replace(/\s/g, '').toLowerCase().includes(plakaArama.replace(/\s/g, '').toLowerCase()) && plakaArama.length > 2)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gayrimenkul & Sabit Varlıklar</h1>
          <p className={styles.pageSub}>Mülk portföyü ve varlık yönetimi</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Mülk portföyünüze eklendi', 'success')}>+ Mülk Ekle</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Varlık Değeri</span>
          <span className={styles.metricValue}>₺{(toplamDeger / 1000000).toFixed(1)}M</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%41.2 (12 ay)</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aylık Kira Geliri</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>₺{toplamKira.toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>2 aktif kira</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kira Getiri Oranı</span>
          <span className={styles.metricValue}>%{((toplamKira * 12 / (MÜLKLER.reduce((s, m) => s + m.deger, 0))) * 100).toFixed(1)}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>Yıllık brüt</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Mülk</span>
          <span className={styles.metricValue}>{MÜLKLER.length}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>{ARAÇLAR.length} araç</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'mulkler', l: 'Mülklerim' },
          { k: 'bolge', l: 'Bölgesel Fiyatlar' },
          { k: 'araclar', l: 'Araçlar & Plaka' },
          { k: 'portfoy', l: 'Portföy Özeti' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'mulkler' && (
        <div className={styles.grid2}>
          {MÜLKLER.map(m => (
            <div key={m.id} className={styles.sectionCard}>
              <div className={styles.cardHeader} style={{ borderLeft: `3px solid ${m.renk}` }}>
                <div>
                  <div className={styles.cardTitle}>{m.ad}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>📍 {m.konum}</div>
                </div>
                <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: m.durum === 'Kiralanmış' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: m.durum === 'Kiralanmış' ? 'var(--profit)' : 'var(--warning)', border: `1px solid ${m.durum === 'Kiralanmış' ? 'rgba(0,212,170,0.3)' : 'rgba(240,180,41,0.3)'}` }}>
                  {m.durum}
                </span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Güncel Değer</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{m.deger.toLocaleString('tr-TR')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Aylık Kira</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>{m.kiraGeliri > 0 ? `₺${m.kiraGeliri.toLocaleString('tr-TR')}` : '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Alan</div>
                    <div style={{ fontFamily: 'var(--font-mono)' }}>{m.metrekare} m²</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>m² Birim Fiyat</div>
                    <div style={{ fontFamily: 'var(--font-mono)' }}>₺{(m.deger / m.metrekare).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
                {m.kiracı !== '—' && (
                  <div style={{ padding: '0.55rem 0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Kiracı: </span><strong>{m.kiracı}</strong>
                    <span style={{ color: 'var(--text-dim)', marginLeft: '0.75rem' }}>Bitiş: </span><span>{m.sonKira}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>Detay</button>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>Değerleme</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'bolge' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>İstanbul Bölgesel Konut Fiyatları (Mayıs 2026)</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {BÖLGE_FİYATLARI.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: b.renk, flexShrink: 0 }}></div>
                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.84rem' }}>{b.bolge}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: 80, textAlign: 'right' }}>₺{b.fiyatM2.toLocaleString('tr-TR')}/m²</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 600, minWidth: 60, textAlign: 'right' }}>+%{b.artis12ay}</span>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ width: `${(b.fiyatM2 / 85000) * 100}%`, height: '100%', background: b.renk, borderRadius: 100 }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aktifTab === 'araclar' && (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Araç Portföyü</span></div>
            <table className={styles.table}>
              <thead><tr><th>Plaka</th><th>Araç</th><th>Yıl</th><th>Güncel Değer</th><th></th></tr></thead>
              <tbody>
                {ARAÇLAR.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{a.plaka}</td>
                    <td>{a.marka}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{a.yil}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{a.deger.toLocaleString('tr-TR')}</td>
                    <td><button className="btn btn-secondary" style={{ fontSize: '0.72rem' }}>Sorgula</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ maxWidth: 420 }}>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Plaka Sorgulama</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input className={styles.input} style={{ width: '100%' }} placeholder="Plaka giriniz (örn: 34 ABC 1234)" value={plakaArama} onChange={e => setPlakaArama(e.target.value)} />
                {araçBulunan ? (
                  <div style={{ padding: '0.85rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>✓ Araç Bulundu</div>
                    <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div><span style={{ color: 'var(--text-dim)' }}>Marka/Model: </span>{araçBulunan.marka}</div>
                      <div><span style={{ color: 'var(--text-dim)' }}>Yıl: </span>{araçBulunan.yil}</div>
                      <div><span style={{ color: 'var(--text-dim)' }}>Tahmini Değer: </span><strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>₺{araçBulunan.deger.toLocaleString('tr-TR')}</strong></div>
                    </div>
                  </div>
                ) : plakaArama.length > 2 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Araç portföyünüzde bulunamadı.</div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}

      {aktifTab === 'portfoy' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Varlık Dağılımı</span></div>
            <div className={styles.cardBody}>
              {/* SVG pie donut */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {(() => {
                    const items = [
                      ...MÜLKLER.map(m => ({ ad: m.ad.slice(0, 12), deger: m.deger, renk: m.renk })),
                      { ad: 'Araçlar', deger: ARAÇLAR.reduce((s, a) => s + a.deger, 0), renk: '#ff4757' },
                    ]
                    const total = items.reduce((s, i) => s + i.deger, 0)
                    let cumulative = 0
                    const r = 55, cx = 70, cy = 70, innerR = 32
                    return items.map((item, idx) => {
                      const frac = item.deger / total
                      const start = cumulative * 2 * Math.PI - Math.PI / 2
                      cumulative += frac
                      const end = cumulative * 2 * Math.PI - Math.PI / 2
                      const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
                      const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end)
                      const ix1 = cx + innerR * Math.cos(end), iy1 = cy + innerR * Math.sin(end)
                      const ix2 = cx + innerR * Math.cos(start), iy2 = cy + innerR * Math.sin(start)
                      const large = frac > 0.5 ? 1 : 0
                      return (
                        <path key={idx}
                          d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2} Z`}
                          fill={item.renk} opacity={0.85}
                        />
                      )
                    })
                  })()}
                  <circle cx="70" cy="70" r="28" fill="var(--bg-surface)" />
                  <text x="70" y="66" textAnchor="middle" fill="var(--text)" fontSize="8" fontWeight="600">Toplam</text>
                  <text x="70" y="77" textAnchor="middle" fill="var(--accent)" fontSize="9" fontWeight="700">₺{(toplamDeger / 1000000).toFixed(1)}M</text>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                  {MÜLKLER.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.renk, flexShrink: 0 }}></div>
                      <span style={{ flex: 1 }}>{m.tip}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>%{((m.deger / toplamDeger) * 100).toFixed(0)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4757', flexShrink: 0 }}></div>
                    <span style={{ flex: 1 }}>Araçlar</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>%{((ARAÇLAR.reduce((s, a) => s + a.deger, 0) / toplamDeger) * 100).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Gelir Özeti</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { etiket: 'Aylık Kira Geliri (Brüt)', deger: `₺${toplamKira.toLocaleString('tr-TR')}`, renk: 'var(--profit)' },
                { etiket: 'Stopaj (%15)', deger: `-₺${(toplamKira * 0.15).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, renk: 'var(--loss)' },
                { etiket: 'Yönetim/Bakım', deger: '-₺1.200', renk: 'var(--loss)' },
                { etiket: 'Net Aylık Kira', deger: `₺${(toplamKira * 0.85 - 1200).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, renk: 'var(--accent)' },
                { etiket: 'Yıllık Net Kira', deger: `₺${((toplamKira * 0.85 - 1200) * 12).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, renk: 'var(--accent)' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.45rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{r.etiket}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.renk }}>{r.deger}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
