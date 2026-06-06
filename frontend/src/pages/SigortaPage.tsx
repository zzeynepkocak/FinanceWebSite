import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const POLIÇELER = [
  {
    id: 1, tip: 'Kasko', sirket: 'Allianz Sigorta', poliçeNo: 'KSK-2024-88421',
    bitis: '2026-08-15', prim: 18400, durum: 'Aktif', renk: '#0066cc',
    kapsam: 'Tam Kasko + Cam Kırılması + Hırsızlık',
    arac: '34 ABC 1234 — Toyota Corolla 2022',
  },
  {
    id: 2, tip: 'Sağlık Sigortası', sirket: 'Axa Sigorta', poliçeNo: 'SGL-2025-44182',
    bitis: '2026-12-31', prim: 28500, durum: 'Aktif', renk: '#e30613',
    kapsam: 'Yatarak + Ayakta Tedavi, Diş, Göz',
    arac: '—',
  },
  {
    id: 3, tip: 'DASK', sirket: 'Türkiye Sigorta', poliçeNo: 'DSK-2025-91034',
    bitis: '2026-07-01', prim: 2400, durum: 'Aktif', renk: '#f0b429',
    kapsam: 'Zorunlu Deprem Sigortası — 110m² Konut',
    arac: '—',
  },
  {
    id: 4, tip: 'Seyahat Sigortası', sirket: 'Generali Sigorta', poliçeNo: 'SYH-2026-10091',
    bitis: '2026-06-30', prim: 1200, durum: 'Süresi Dolmak Üzere', renk: '#ff4757',
    kapsam: 'Avrupa Geneli, Tıbbi Harcama €50K',
    arac: '—',
  },
]

const RISK_SORULARI = [
  { soru: 'Yaşınız kaç?', secenekler: ['18-30', '31-45', '46-60', '60+'] },
  { soru: 'Sigara kullanıyor musunuz?', secenekler: ['Hayır', 'Bıraktım', 'Evet, az', 'Evet, fazla'] },
  { soru: 'Kronik rahatsızlığınız var mı?', secenekler: ['Hayır', '1 hastalık', '2+ hastalık'] },
  { soru: 'Yıllık seyahat sıklığı?', secenekler: ['Hiç', '1-3 kez', '4-8 kez', '8+'] },
]

export function SigortaPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('poliçeler')
  const [hasarArac, setHasarArac] = useState('')
  const [hasarAciklama, setHasarAciklama] = useState('')
  const [riskCevaplar, setRiskCevaplar] = useState<string[]>([])
  const [riskTamamlandi, setRiskTamamlandi] = useState(false)

  const gunKaldi = (tarih: string) => {
    const fark = new Date(tarih).getTime() - Date.now()
    return Math.ceil(fark / 86400000)
  }

  const riskPuani = riskCevaplar.length === RISK_SORULARI.length
    ? Math.max(30, 90 - riskCevaplar.filter((c, i) => i > 0 && c !== RISK_SORULARI[i].secenekler[0]).length * 15)
    : null

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Sigorta & Risk Yönetimi</h1>
          <p className={styles.pageSub}>Poliçeleriniz ve risk profili</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Yeni sigorta teklifi hazirlanıyor, e-posta ile bilgilendirileceksiniz', 'success')}>+ Yeni Poliçe</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aktif Poliçe</span>
          <span className={styles.metricValue}>4</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>adet</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Yıllık Prim Toplamı</span>
          <span className={styles.metricValue}>₺50.500</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>4 poliçe</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>En Yakın Bitiş</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>32 gün</span>
          <span className={`${styles.metricChange} ${styles.down}`}>Seyahat — 30 Haz</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Açık Hasar</span>
          <span className={styles.metricValue}>0</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Hasar yok</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'poliçeler', l: 'Poliçelerim' },
          { k: 'hasar', l: 'Hasar Bildirimi' },
          { k: 'karsilastir', l: 'Sigorta Karşılaştır' },
          { k: 'risk', l: 'Risk Profil Testi' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'poliçeler' && (
        <div className={styles.grid2}>
          {POLIÇELER.map(p => {
            const kalan = gunKaldi(p.bitis)
            return (
              <div key={p.id} className={styles.sectionCard}>
                <div className={styles.cardHeader} style={{ borderLeft: `3px solid ${p.renk}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${p.renk}22`, border: `1px solid ${p.renk}44`, display: 'grid', placeItems: 'center', fontSize: '1.1rem' }}>
                      {{ 'Kasko': '🚗', 'Sağlık Sigortası': '🏥', 'DASK': '🏠', 'Seyahat Sigortası': '✈️' }[p.tip] || '📋'}
                    </div>
                    <div>
                      <div className={styles.cardTitle}>{p.tip}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{p.sirket}</div>
                    </div>
                  </div>
                  <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: p.durum === 'Aktif' ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)', color: p.durum === 'Aktif' ? 'var(--profit)' : 'var(--loss)', border: `1px solid ${p.durum === 'Aktif' ? 'rgba(0,212,170,0.3)' : 'rgba(255,71,87,0.3)'}` }}>
                    {p.durum}
                  </span>
                </div>
                <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Poliçe No</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{p.poliçeNo}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Yıllık Prim</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{p.prim.toLocaleString('tr-TR')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Bitiş Tarihi</span>
                    <span style={{ color: kalan <= 60 ? 'var(--loss)' : 'var(--text)', fontWeight: kalan <= 60 ? 700 : 400 }}>{p.bitis} ({kalan} gün)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{p.kapsam}</div>
                  {kalan <= 60 && (
                    <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--loss)' }}>
                      ⚠ Poliçeniz {kalan} gün içinde sona eriyor!
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>İncele</button>
                    {kalan <= 60 && <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>Yenile</button>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {aktifTab === 'hasar' && (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Hızlı Hasar Bildirimi</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Poliçe Seçin</label>
                <select className={styles.select} style={{ width: '100%' }}>
                  {POLIÇELER.map(p => <option key={p.id}>{p.tip} — {p.poliçeNo}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Hasar Türü</label>
                <select className={styles.select} style={{ width: '100%' }}>
                  <option>Trafik Kazası</option>
                  <option>Hırsızlık</option>
                  <option>Doğal Afet</option>
                  <option>Yangın</option>
                  <option>Hastalık/Kaza</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Araç Plakası (Kasko için)</label>
                <input className={styles.input} style={{ width: '100%' }} placeholder="Örn: 34 ABC 1234" value={hasarArac} onChange={e => setHasarArac(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Olay Açıklaması</label>
                <textarea style={{ width: '100%', minHeight: 80, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.8rem', padding: '0.5rem 0.65rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} placeholder="Olayı kısaca açıklayın..." value={hasarAciklama} onChange={e => setHasarAciklama(e.target.value)} />
              </div>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                📷 Hasar Fotoğrafı Yükle
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Hasar Bildirimi Gönder</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'karsilastir' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Sigorta Teklif Karşılaştırma Matrisi</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Özellik</th>
                  <th>Allianz</th>
                  <th>Axa</th>
                  <th>Generali</th>
                  <th>Mapfre</th>
                  <th>HDI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { oz: 'Yıllık Prim', d: ['₺18.400', '₺17.200', '₺19.800', '₺16.900', '₺20.100'] },
                  { oz: 'Muafiyet', d: ['₺2.000', '₺1.500', '₺2.500', '₺1.800', '₺1.200'] },
                  { oz: 'Cam Kırılması', d: ['✓', '✓', '✓', '—', '✓'] },
                  { oz: 'Asistans Hizmeti', d: ['7/24', '7/24', 'Hafta içi', '7/24', '7/24'] },
                  { oz: 'Hasar Sonrası Primsizlik', d: ['3 yıl', '2 yıl', '3 yıl', '5 yıl', '2 yıl'] },
                  { oz: 'Online Hasar', d: ['✓', '✓', '—', '✓', '✓'] },
                  { oz: 'Değer Kaybı', d: ['✓ (Ek)', '—', '✓ (Ek)', '—', '✓ (Dahil)'] },
                ].map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{r.oz}</td>
                    {r.d.map((d, j) => <td key={j} style={{ fontSize: '0.8rem', color: d === '—' ? 'var(--text-dim)' : d === '✓' ? 'var(--profit)' : 'var(--text)' }}>{d}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aktifTab === 'risk' && (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Risk Profil Testi</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!riskTamamlandi ? (
                <>
                  {RISK_SORULARI.map((s, i) => (
                    <div key={i}>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.5rem' }}>{i + 1}. {s.soru}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {s.secenekler.map(sec => (
                          <button key={sec} onClick={() => {
                            const yeni = [...riskCevaplar]
                            yeni[i] = sec
                            setRiskCevaplar(yeni)
                          }} style={{ padding: '0.55rem 0.85rem', textAlign: 'left', borderRadius: 'var(--radius-sm)', border: `1px solid ${riskCevaplar[i] === sec ? 'var(--accent)' : 'var(--border)'}`, background: riskCevaplar[i] === sec ? 'var(--accent-dim)' : 'var(--bg-card)', color: riskCevaplar[i] === sec ? 'var(--accent)' : 'var(--text)', cursor: 'pointer', fontSize: '0.82rem' }}>
                            {sec}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={riskCevaplar.length < RISK_SORULARI.length}
                    onClick={() => setRiskTamamlandi(true)}
                  >
                    Risk Puanımı Hesapla
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: riskPuani && riskPuani >= 70 ? 'var(--profit)' : riskPuani && riskPuani >= 50 ? 'var(--warning)' : 'var(--loss)' }}>{riskPuani}</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>{riskPuani && riskPuani >= 70 ? 'Düşük Risk' : riskPuani && riskPuani >= 50 ? 'Orta Risk' : 'Yüksek Risk'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Profilinize göre Sağlık ve Hayat sigortalarını güçlendirmenizi öneririz.</div>
                  <button className="btn btn-secondary" onClick={() => { setRiskTamamlandi(false); setRiskCevaplar([]) }}>Testi Tekrarla</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
