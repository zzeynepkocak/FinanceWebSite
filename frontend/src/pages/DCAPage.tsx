import { useState } from 'react'
import styles from './SharedPage.module.css'

const DCA_PLANLARI = [
  { id: 1, varlik: 'Altın', miktar: 500, periyot: 'Aylık (Her 15)', toplamAlim: 18, toplamYatirim: 9000, anlikDeger: 11240, getiri: '+24.9%', renk: '#f0b429', durum: 'Aktif' },
  { id: 2, varlik: 'Bitcoin', miktar: 1000, periyot: 'Haftalık (Pazartesi)', toplamAlim: 24, toplamYatirim: 24000, anlikDeger: 31850, getiri: '+32.7%', renk: '#FF9900', durum: 'Aktif' },
  { id: 3, varlik: 'BIST100 ETF', miktar: 300, periyot: 'Aylık (Her 1)', toplamAlim: 12, toplamYatirim: 3600, anlikDeger: 4120, getiri: '+14.4%', renk: '#0066ff', durum: 'Duraklatıldı' },
]

const AYLAR = ['Kas', 'Ara', 'Oca', 'Şub', 'Mar', 'Nis', 'May']
const ALTIN_BIRIKIMLI = [7420, 7890, 8340, 8900, 9480, 10100, 11240]
const ALTIN_ORTALAMA = [7420, 7600, 7750, 7880, 8000, 8200, 8550]

export function DCAPage() {
  const [aktifTab, setAktifTab] = useState('planlar')
  const [secilenVarlik, setSecilenVarlik] = useState('Altın')
  const [miktar, setMiktar] = useState('500')
  const [periyot, setPeriyot] = useState('aylik_15')
  const [gun, setGun] = useState('15')
  const [duraklatilan, setDuraklatilan] = useState<number[]>([3])

  const toggleDuraklat = (id: number) => {
    setDuraklatilan(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const svgH = 140
  const svgW = 480
  const padding = 30
  const maxVal = Math.max(...ALTIN_BIRIKIMLI)
  const minVal = Math.min(...ALTIN_BIRIKIMLI) * 0.9

  const toX = (i: number) => padding + (i / (ALTIN_BIRIKIMLI.length - 1)) * (svgW - padding * 2)
  const toY = (v: number) => svgH - padding - ((v - minVal) / (maxVal - minVal)) * (svgH - padding * 2)

  const birikimliPath = ALTIN_BIRIKIMLI.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')
  const ortalamaPath = ALTIN_ORTALAMA.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Düzenli Alım (DCA)</h1>
          <p className={styles.pageSub}>Dollar Cost Averaging — Periyodik yatırım planlarınız</p>
        </div>
        <button className="btn btn-primary">+ Yeni Plan</button>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Yatırım</span>
          <span className={styles.metricValue}>₺36.600</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>3 aktif plan</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Güncel Değer</span>
          <span className={styles.metricValue}>₺47.210</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%28.9 getiri</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bu Ay Alımlar</span>
          <span className={styles.metricValue}>₺1.800</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>2 plan aktif</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sonraki Alım</span>
          <span className={styles.metricValue}>3 gün</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>1 Haz — Bitcoin</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'planlar', l: 'Aktif Planlar' },
          { k: 'olustur', l: 'Yeni Plan Oluştur' },
          { k: 'grafik', l: 'Ortalama Maliyet Grafiği' },
          { k: 'karsilastir', l: 'DCA Karşılaştırma' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'planlar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DCA_PLANLARI.map(p => (
            <div key={p.id} className={styles.sectionCard}>
              <div className={styles.cardHeader} style={{ borderLeft: `3px solid ${p.renk}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${p.renk}22`, border: `1px solid ${p.renk}44`, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.75rem', color: p.renk }}>DCA</div>
                  <div>
                    <div className={styles.cardTitle}>{p.varlik}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{p.periyot} · ₺{p.miktar}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>{p.getiri}</span>
                  <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: (duraklatilan.includes(p.id) || p.durum === 'Duraklatıldı') ? 'rgba(240,180,41,0.1)' : 'rgba(0,212,170,0.1)', color: (duraklatilan.includes(p.id) || p.durum === 'Duraklatıldı') ? 'var(--warning)' : 'var(--profit)', border: '1px solid transparent' }}>
                    {(duraklatilan.includes(p.id) || p.durum === 'Duraklatıldı') ? 'Duraklatıldı' : 'Aktif'}
                  </span>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {[
                  { l: 'Toplam Alım', v: `${p.toplamAlim} işlem` },
                  { l: 'Toplam Yatırım', v: `₺${p.toplamYatirim.toLocaleString('tr-TR')}` },
                  { l: 'Güncel Değer', v: `₺${p.anlikDeger.toLocaleString('tr-TR')}` },
                ].map(item => (
                  <div key={item.l}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.l}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '0.2rem' }}>{item.v}</div>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignSelf: 'center' }}>
                  <button className="btn btn-secondary" style={{ fontSize: '0.72rem' }} onClick={() => toggleDuraklat(p.id)}>
                    {duraklatilan.includes(p.id) ? 'Devam Et' : 'Duraklat'}
                  </button>
                  <button style={{ background: 'none', border: '1px solid rgba(255,71,87,0.4)', borderRadius: 'var(--radius-sm)', color: 'var(--loss)', fontSize: '0.72rem', cursor: 'pointer', padding: '0.3rem 0.6rem' }}>İptal Et</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'olustur' && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Düzenli Alım Sihirbazı</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Varlık</label>
                <select className={styles.select} style={{ width: '100%' }} value={secilenVarlik} onChange={e => setSecilenVarlik(e.target.value)}>
                  {['Altın', 'Bitcoin', 'Ethereum', 'BIST100 ETF', 'USD/TRY', 'Gümüş', 'S&P500 ETF'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Alım Miktarı (₺)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} value={miktar} onChange={e => setMiktar(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Alım Sıklığı</label>
                <select className={styles.select} style={{ width: '100%' }} value={periyot} onChange={e => setPeriyot(e.target.value)}>
                  <option value="haftalik_pazartesi">Her Pazartesi</option>
                  <option value="haftalik_cuma">Her Cuma</option>
                  <option value="aylik_1">Her Ayın 1'i</option>
                  <option value="aylik_15">Her Ayın 15'i</option>
                  <option value="iki_haftalik">İki Haftada Bir</option>
                </select>
              </div>
              {periyot.includes('aylik') && (
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Gün</label>
                  <input type="number" className={styles.input} style={{ width: '100%' }} min="1" max="28" value={gun} onChange={e => setGun(e.target.value)} />
                </div>
              )}
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Yıllık Beklenen Yatırım</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>
                  ₺{(parseFloat(miktar || '0') * (periyot.includes('haftalik') ? 52 : periyot.includes('iki') ? 26 : 12)).toLocaleString('tr-TR')}
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Planı Başlat</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'grafik' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Altın DCA — Birikim vs Ortalama Maliyet</span>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 12, height: 3, background: 'var(--accent)', display: 'inline-block', borderRadius: 2 }} />Portföy Değeri</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: 12, height: 3, background: 'var(--warning)', display: 'inline-block', borderRadius: 2, border: '1px dashed var(--warning)' }} />Ortalama Maliyet</span>
            </div>
          </div>
          <div className={styles.cardBody}>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <linearGradient id="dcaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map(t => {
                const y = svgH - padding - t * (svgH - padding * 2)
                const val = minVal + t * (maxVal - minVal)
                return (
                  <g key={t}>
                    <line x1={padding} y1={y} x2={svgW - padding} y2={y} stroke="var(--border)" strokeWidth="0.5" />
                    <text x={padding - 4} y={y + 4} textAnchor="end" fill="var(--text-dim)" fontSize="9">₺{Math.round(val / 1000)}K</text>
                  </g>
                )
              })}
              <path d={`${birikimliPath} L${toX(ALTIN_BIRIKIMLI.length - 1)},${toY(minVal)} L${toX(0)},${toY(minVal)} Z`} fill="url(#dcaGrad)" />
              <path d={birikimliPath} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={ortalamaPath} stroke="var(--warning)" strokeWidth="1.5" fill="none" strokeDasharray="5,3" strokeLinecap="round" />
              {AYLAR.map((ay, i) => (
                <text key={ay} x={toX(i)} y={svgH - 6} textAnchor="middle" fill="var(--text-dim)" fontSize="9">{ay}</text>
              ))}
            </svg>
          </div>
        </div>
      )}

      {aktifTab === 'karsilastir' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Varlık</th><th>Toplam Yatırım</th><th>Güncel Değer</th><th>Getiri</th><th>Ortalama Alım Fiyatı</th><th>Sonraki Alım</th></tr>
            </thead>
            <tbody>
              {[
                { varlik: 'Altın', yatirim: 9000, deger: 11240, getiri: 24.9, ort: 'gr ₺2.680', sonraki: '15 Haz' },
                { varlik: 'Bitcoin', yatirim: 24000, deger: 31850, getiri: 32.7, ort: '₺2.184.000', sonraki: '2 Haz' },
                { varlik: 'BIST100 ETF', yatirim: 3600, deger: 4120, getiri: 14.4, ort: '₺48.20', sonraki: 'Duraklatıldı' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.varlik}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₺{r.yatirim.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₺{r.deger.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 700 }}>+{r.getiri}%</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.ort}</td>
                  <td style={{ fontSize: '0.78rem', color: r.sonraki === 'Duraklatıldı' ? 'var(--warning)' : 'var(--text)' }}>{r.sonraki}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
