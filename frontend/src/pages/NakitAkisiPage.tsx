import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

// 30 günlük tahmin verisi
const TAHMIN_VERISI = Array.from({ length: 30 }, (_, i) => {
  const gun = i + 1
  const base = 85000
  const giris = gun % 7 === 1 ? 45000 : gun === 15 ? 120000 : gun % 3 === 0 ? 12000 : 3000
  const cikis = gun % 5 === 0 ? 28000 : gun === 1 ? 18000 : gun === 10 ? 35000 : 5000
  return { gun: `Haz ${gun}`, giris, cikis, net: giris - cikis, birikim: base + (giris - cikis) * (i + 1) / 2 }
})

const ACIL_FON_HEDEF = 180000
const ACIL_FON_MEVCUT = 124000

const ATIL_NAKIT_ÖNERILERI = [
  { ad: 'Vadeli Mevduat (3 Ay)', banka: 'Garanti BBVA', faiz: '%58.5 yıllık', miktar: 50000, sure: '3 ay', renk: '#00a651' },
  { ad: 'TEFAS Para Piyasası Fonu', banka: 'TEB Asset', faiz: '%59.2 yıllık', miktar: 30000, sure: 'Günlük', renk: '#0066ff' },
  { ad: 'Hazine Bonosu (91 Gün)', banka: 'Hazine & Maliye', faiz: '%57.8 yıllık', miktar: 25000, sure: '3 ay', renk: '#f0b429' },
]

const VADE_UYUMSUZLUKLARI = [
  { ad: 'Tedarikçi Ödemeleri', tutar: 85000, vade: '5 gün', nakit: 62000, fark: -23000 },
  { ad: 'Maaş Ödemeleri', tutar: 145000, vade: '12 gün', nakit: 180000, fark: 35000 },
  { ad: 'Vergi Ödemeleri', tutar: 42000, vade: '28 gün', nakit: 180000, fark: 138000 },
]

export function NakitAkisiPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('tahmin')
  const [bufferAlert] = useState(50000)

  const minBirikim = Math.min(...TAHMIN_VERISI.map(d => d.birikim))
  const maxBirikim = Math.max(...TAHMIN_VERISI.map(d => d.birikim))
  const chartH = 160
  const chartW = 560
  const pad = { l: 10, r: 10, t: 20, b: 20 }

  const mapY = (val: number) => {
    const ratio = (val - minBirikim * 0.95) / (maxBirikim * 1.05 - minBirikim * 0.95)
    return chartH - pad.b - ratio * (chartH - pad.t - pad.b)
  }

  const mapX = (i: number) => pad.l + (i / (TAHMIN_VERISI.length - 1)) * (chartW - pad.l - pad.r)

  const linePath = TAHMIN_VERISI.map((d, i) => `${i === 0 ? 'M' : 'L'} ${mapX(i)} ${mapY(d.birikim)}`).join(' ')
  const areaPath = `${linePath} L ${mapX(TAHMIN_VERISI.length - 1)} ${chartH - pad.b} L ${mapX(0)} ${chartH - pad.b} Z`
  const bufferY = mapY(bufferAlert)

  const toplamGiris = TAHMIN_VERISI.reduce((s, d) => s + d.giris, 0)
  const toplamCikis = TAHMIN_VERISI.reduce((s, d) => s + d.cikis, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Nakit Akışı & Likidite</h1>
          <p className={styles.pageSub}>30 günlük nakit akışı tahmini ve likidite analizi</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Nakit akışı planı PDF olarak indiriliyor…', 'success')}>Nakit Planı İndir</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Mevcut Nakit</span>
          <span className={styles.metricValue}>₺85.000</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Tüm hesaplar</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>30 Gün Tahmini Giriş</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>₺{(toplamGiris / 1000).toFixed(0)}K</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Tahmin</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>30 Gün Tahmini Çıkış</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>₺{(toplamCikis / 1000).toFixed(0)}K</span>
          <span className={`${styles.metricChange} ${styles.down}`}>Tahmin</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Acil Fon Hedefi</span>
          <span className={styles.metricValue}>%{Math.round((ACIL_FON_MEVCUT / ACIL_FON_HEDEF) * 100)}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>₺{((ACIL_FON_HEDEF - ACIL_FON_MEVCUT) / 1000).toFixed(0)}K eksik</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'tahmin', l: '30 Gün Tahmini' },
          { k: 'acil', l: 'Acil Fon' },
          { k: 'atil', l: 'Atıl Nakit Önerileri' },
          { k: 'vade', l: 'Vade Uyumsuzluğu' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'tahmin' && (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Nakit Bakiye Tahmini (SVG)</span></div>
            <div className={styles.cardBody}>
              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
                {/* Area fill */}
                <defs>
                  <linearGradient id="nakitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,212,170,0.3)" />
                    <stop offset="100%" stopColor="rgba(0,212,170,0)" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#nakitGrad)" />
                <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
                {/* Buffer alert line */}
                <line x1={pad.l} y1={bufferY} x2={chartW - pad.r} y2={bufferY} stroke="var(--loss)" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x={chartW - pad.r - 2} y={bufferY - 4} textAnchor="end" fill="var(--loss)" fontSize="10">Min Tampon ₺{(bufferAlert / 1000).toFixed(0)}K</text>
                {/* X axis labels — every 5 days */}
                {TAHMIN_VERISI.filter((_, i) => i % 5 === 0).map((d, i) => (
                  <text key={i} x={mapX(i * 5)} y={chartH - 4} textAnchor="middle" fill="var(--text-dim)" fontSize="9">{d.gun}</text>
                ))}
              </svg>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Günlük Nakit Akışı (Seçili Günler)</span></div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead><tr><th>Tarih</th><th>Giriş</th><th>Çıkış</th><th>Net</th></tr></thead>
                <tbody>
                  {TAHMIN_VERISI.filter(d => d.giris > 10000 || d.cikis > 10000).slice(0, 10).map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{d.gun}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)' }}>+₺{d.giris.toLocaleString('tr-TR')}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>-₺{d.cikis.toLocaleString('tr-TR')}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: d.net >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                        {d.net >= 0 ? '+' : ''}₺{d.net.toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {aktifTab === 'acil' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Acil Durum Fonu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Mevcut / Hedef</div>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  <span style={{ color: 'var(--accent)' }}>₺{ACIL_FON_MEVCUT.toLocaleString('tr-TR')}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1rem' }}> / ₺{ACIL_FON_HEDEF.toLocaleString('tr-TR')}</span>
                </div>
              </div>
              <div className={styles.progressBar} style={{ height: 10 }}>
                <div className={styles.progressFill} style={{ width: `${(ACIL_FON_MEVCUT / ACIL_FON_HEDEF) * 100}%` }}></div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                %{Math.round((ACIL_FON_MEVCUT / ACIL_FON_HEDEF) * 100)} tamamlandı. Hedefe ulaşmak için <strong style={{ color: 'var(--accent)' }}>₺{(ACIL_FON_HEDEF - ACIL_FON_MEVCUT).toLocaleString('tr-TR')}</strong> daha gerekli.
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                💡 Tavsiye: 6 aylık gider kadar acil fon hedefleyin. Aylık gideriniz ~₺30.000 ise hedef ₺180.000'dir.
              </div>
              <button className="btn btn-primary" onClick={() => show('Aylık otomatik katkı planı oluşturuldu', 'success')}>Aylık Otomatik Katkı Kur</button>
            </div>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Min Nakit Tamponu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { etiket: 'Önerilen Min Tampon', deger: '₺50.000', renk: 'var(--warning)' },
                { etiket: 'Mevcut Nakit', deger: '₺85.000', renk: 'var(--profit)' },
                { etiket: 'Fazla Likidite', deger: '₺35.000', renk: 'var(--accent)' },
                { etiket: 'Aylık Sabit Gider', deger: '₺18.000', renk: 'var(--text)' },
                { etiket: 'Likidite Oranı', deger: '4.7 ay', renk: 'var(--profit)' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{r.etiket}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.renk }}>{r.deger}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'atil' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Atıl Nakit Değerlendirme Önerileri</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ATIL_NAKIT_ÖNERILERI.map((o, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: `1px solid ${o.renk}33`, display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: 10, height: 40, borderRadius: 4, background: o.renk, flexShrink: 0 }}></div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{o.ad}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{o.banka}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>{o.faiz}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{o.sure}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₺{o.miktar.toLocaleString('tr-TR')}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Önerilen</div>
                </div>
                <button className="btn btn-primary" style={{ fontSize: '0.78rem' }}>Uygula</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {aktifTab === 'vade' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Vade Uyumsuzluğu Analizi</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>Yükümlülük</th><th>Tutar</th><th>Vadeye Kalan</th><th>Mevcut Nakit</th><th>Açık/Fazla</th></tr>
            </thead>
            <tbody>
              {VADE_UYUMSUZLUKLARI.map((v, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{v.ad}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--loss)' }}>₺{v.tutar.toLocaleString('tr-TR')}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.72rem', background: parseInt(v.vade) <= 7 ? 'rgba(255,71,87,0.1)' : 'rgba(240,180,41,0.1)', color: parseInt(v.vade) <= 7 ? 'var(--loss)' : 'var(--warning)', border: `1px solid ${parseInt(v.vade) <= 7 ? 'rgba(255,71,87,0.3)' : 'rgba(240,180,41,0.3)'}`, fontWeight: 600 }}>
                      {v.vade}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)' }}>₺{v.nakit.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: v.fark >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                    {v.fark >= 0 ? '+' : ''}₺{v.fark.toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.cardBody} style={{ borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--loss)' }}>
              ⚠ Tedarikçi ödemelerinde <strong>₺23.000</strong> likidite açığı var. 5 gün içinde ek nakit gerekiyor.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
