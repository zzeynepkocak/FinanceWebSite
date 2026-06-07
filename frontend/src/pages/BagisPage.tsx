import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const SIVIL_TOPLUM = [
  { id: 1, ad: 'Türk Kızılay', kategori: 'İnsani Yardım', toplanan: 2840000, hedef: 5000000, bagisci: 18420 },
  { id: 2, ad: 'LOSEV — Lösemi Vakfı', kategori: 'Sağlık', toplanan: 980000, hedef: 2000000, bagisci: 7210 },
  { id: 3, ad: 'TEMA Vakfı', kategori: 'Çevre', toplanan: 450000, hedef: 1000000, bagisci: 3840 },
  { id: 4, ad: 'Darüşşafaka Cemiyeti', kategori: 'Eğitim', toplanan: 1250000, hedef: 2500000, bagisci: 9120 },
  { id: 5, ad: 'Türk Böbrek Vakfı', kategori: 'Sağlık', toplanan: 320000, hedef: 800000, bagisci: 2950 },
]

const KAMPANYALAR = [
  { id: 1, ad: 'Köy Okulu Kütüphane Projesi', organizasyon: 'Öğretmenler Vakfı', toplanan: 148000, hedef: 250000, bitis: '2026-06-30', kategori: 'Eğitim' },
  { id: 2, ad: 'Deprem Bölgesi Çocuk Oyun Alanları', organizasyon: 'AÇEV', toplanan: 87400, hedef: 200000, bitis: '2026-07-15', kategori: 'Toplumsal' },
  { id: 3, ad: 'Güneş Enerjisi Tarım Projesi', organizasyon: 'TÜGİAD Çevre', toplanan: 312000, hedef: 500000, bitis: '2026-08-01', kategori: 'Çevre' },
]

export function BagisPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('stk')
  const [mikroBagis, setMikroBagis] = useState(false)
  const [mikrYuzde, setMikroYuzde] = useState('1')
  const [kgCo2, setKgCo2] = useState('2400')
  const [secilenStk, setSecilenStk] = useState<number | null>(null)
  const [bagisOdeme, setBagisOdeme] = useState('')

  const offsetMaliyeti = Math.round(parseFloat(kgCo2 || '0') * 0.085)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bağış & Sosyal Sorumluluk</h1>
          <p className={styles.pageSub}>STK bağışları, karbon dengeleme ve kitlesel fonlama projeleri</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Vergi makbuzu e-posta adresinize gönderildi', 'success')}>Vergi Makbuzu İndir</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bu Yıl Toplam Bağış</span>
          <span className={styles.metricValue}>₺4.850</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+₺620 geçen yıla göre</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Vergi Muafiyeti</span>
          <span className={styles.metricValue}>₺970</span>
          <span className={`${styles.metricChange} ${styles.up}`}>%20 indirim</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Mikro Bağış (Aylık)</span>
          <span className={styles.metricValue}>{mikroBagis ? `%${mikrYuzde}` : '—'}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>{mikroBagis ? 'Aktif' : 'Pasif'}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Karbon Dengeleme</span>
          <span className={styles.metricValue}>1.200 kg</span>
          <span className={`${styles.metricChange} ${styles.up}`}>CO₂ dengelendi</span>
        </div>
      </div>

      {/* Mikro Bağış */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}><span className={styles.cardTitle}>Otomatik Mikro Bağış</span></div>
        <div className={styles.cardBody}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Harcamalardan Otomatik Bağış</div>
              <div className={styles.settingDesc}>Her harcamadan belirli bir yüzdeyi otomatik olarak seçtiğiniz STK'ya bağışlayın</div>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" checked={mikroBagis} onChange={() => setMikroBagis(m => !m)} />
              <span className={styles.slider} />
            </label>
          </div>
          {mikroBagis && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Yüzde (%)</label>
                <select className={styles.select} value={mikrYuzde} onChange={e => setMikroYuzde(e.target.value)}>
                  {['0.5', '1', '2', '3', '5'].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Hedef STK</label>
                <select className={styles.select} style={{ width: '100%' }}>
                  {SIVIL_TOPLUM.map(s => <option key={s.id}>{s.ad}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'stk', l: 'STK Bağışları' },
          { k: 'karbon', l: 'Karbon Ayak İzi' },
          { k: 'kitlesel', l: 'Kitlesel Fonlama' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'stk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {SIVIL_TOPLUM.map(s => (
            <div key={s.id} className={styles.sectionCard}>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.ad}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{s.kategori} · {s.bagisci.toLocaleString('tr-TR')} bağışçı</div>
                  </div>
                  <button className="btn btn-primary" style={{ fontSize: '0.72rem' }} onClick={() => setSecilenStk(s.id === secilenStk ? null : s.id)}>
                    Bağış Yap
                  </button>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Toplanan</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>₺{s.toplanan.toLocaleString('tr-TR')} / ₺{s.hedef.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.round((s.toplanan / s.hedef) * 100)}%` }} />
                  </div>
                </div>
                {secilenStk === s.id && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <input className={styles.input} placeholder="Bağış tutarı (₺)" value={bagisOdeme} onChange={e => setBagisOdeme(e.target.value)} style={{ flex: 1 }} />
                    <button className="btn btn-primary" style={{ fontSize: '0.72rem' }}>Öde</button>
                    <button className="btn btn-secondary" style={{ fontSize: '0.72rem' }} onClick={() => setSecilenStk(null)}>İptal</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'karbon' && (
        <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Karbon Ayak İzi Hesaplayıcı</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Yıllık CO₂ Emisyonu (kg)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} value={kgCo2} onChange={e => setKgCo2(e.target.value)} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Türkiye ortalaması: ~4.800 kg/kişi/yıl</div>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Dengeleme Maliyeti</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>₺{offsetMaliyeti.toLocaleString('tr-TR')}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Sertifikalı karbon kredisi projelerine ödeme yapılır. Ortalama ₺85 / ton CO₂.</div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Karbon Ayak İzimi Dengele — ₺{offsetMaliyeti.toLocaleString('tr-TR')}</button>
            </div>
          </div>
          <div className={`${styles.alertCard} ${styles.alertSuccess}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--profit)" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="var(--profit)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span style={{ fontSize: '0.78rem' }}>Bu yıl 1.200 kg CO₂ dengelenmiştir. Sertifikanızı indirmek için Makbuzlar bölümünü ziyaret edin.</span>
          </div>
        </div>
      )}

      {aktifTab === 'kitlesel' && (
        <div className={styles.grid2}>
          {KAMPANYALAR.map(k => (
            <div key={k.id} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>{k.ad}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{k.organizasyon}</div>
                </div>
                <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: 'rgba(0,102,255,0.1)', color: '#0066ff', border: '1px solid rgba(0,102,255,0.3)' }}>{k.kategori}</span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Toplanan</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round((k.toplanan / k.hedef) * 100)}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.round((k.toplanan / k.hedef) * 100)}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '0.25rem', color: 'var(--text-dim)' }}>
                    <span>₺{k.toplanan.toLocaleString('tr-TR')}</span>
                    <span>Hedef: ₺{k.hedef.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Bitiş: {k.bitis}</div>
                <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>Destekle</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
