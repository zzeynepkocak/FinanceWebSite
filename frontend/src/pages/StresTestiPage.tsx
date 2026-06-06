import { useState } from 'react'
import styles from './SharedPage.module.css'

const SENARYOLAR = [
  { id: 1, ad: '%20 TL Devalüasyonu', etki: -12.4, renk: 'var(--loss)', aciklama: 'Dövizli borçlar ve ithalat maliyetleri artar' },
  { id: 2, ad: 'BIST %30 Düşüşü', etki: -18.2, renk: 'var(--loss)', aciklama: 'Hisse senedi ağırlıklı portföy ciddi zarar görür' },
  { id: 3, ad: 'Faiz %10 Artışı', etki: -6.8, renk: '#f0b429', aciklama: 'Tahvil değerleri düşer, kredi maliyeti artar' },
  { id: 4, ad: 'Kripto %50 Çöküşü', etki: -8.1, renk: '#f0b429', aciklama: 'Kripto varlıkların erimesi' },
  { id: 5, ad: 'İşsizlik (3 Aylık)', etki: -35.0, renk: 'var(--loss)', aciklama: 'Gelir kesilmesi durumunda dayanma süresi' },
  { id: 6, ad: 'Enflasyon %60', etki: -22.5, renk: 'var(--loss)', aciklama: 'Satın alma gücü kaybı' },
]

const ANOMALI_VERISI = [
  { kategori: 'Market', normal: 6000, bu_ay: 9200, sapma: 53.3, uyari: true },
  { kategori: 'Yeme-İçme', normal: 3000, bu_ay: 3800, sapma: 26.7, uyari: true },
  { kategori: 'Ulaşım', normal: 2500, bu_ay: 2100, sapma: -16.0, uyari: false },
  { kategori: 'Eğlence', normal: 2000, bu_ay: 4500, sapma: 125.0, uyari: true },
  { kategori: 'Sağlık', normal: 1500, bu_ay: 850, sapma: -43.3, uyari: false },
]

export function StresTestiPage() {
  const [aktifSenaryo, setAktifSenaryo] = useState<number | null>(null)
  const [aktifTab, setAktifTab] = useState('senaryo')
  const [portfolyoDegeri] = useState(2847340)

  const senaryo = SENARYOLAR.find(s => s.id === aktifSenaryo)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Finansal Check-Up & Stres Testi</h1>
          <p className={styles.pageSub}>Portföy dayanıklılık analizi ve harcama anomali tespiti</p>
        </div>
        <button className="btn btn-primary">Check-Up Başlat</button>
      </div>

      {/* Check-up skoru */}
      <div className={styles.metricsRow}>
        {[
          { label: 'Finansal Sağlık Skoru', value: '74/100', renk: '#f0b429', desc: 'Orta' },
          { label: 'Acil Fon Karşılama', value: '4.2 ay', renk: 'var(--profit)', desc: 'Yeterli' },
          { label: 'Borç/Gelir Oranı', value: '%28', renk: 'var(--profit)', desc: 'Güvenli' },
          { label: 'Portföy Çeşitliliği', value: '8.5/10', renk: 'var(--accent)', desc: 'İyi' },
        ].map(m => (
          <div key={m.label} className={styles.metricCard}>
            <span className={styles.metricLabel}>{m.label}</span>
            <span className={styles.metricValue} style={{ color: m.renk, fontSize: '1.3rem' }}>{m.value}</span>
            <span className={styles.metricChange} style={{ color: m.renk }}>{m.desc}</span>
          </div>
        ))}
      </div>

      <div className={styles.tabs}>
        {['senaryo', 'checkup', 'anomali'].map(t => (
          <button key={t} className={`${styles.tab} ${aktifTab === t ? styles.tabActive : ''}`} onClick={() => setAktifTab(t)}>
            {{ senaryo: 'Stres Senaryoları', checkup: 'Aylık Check-Up', anomali: 'Anomali Tespiti' }[t]}
          </button>
        ))}
      </div>

      {aktifTab === 'senaryo' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Kriz Senaryoları</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {SENARYOLAR.map(s => (
                <div
                  key={s.id}
                  onClick={() => setAktifSenaryo(aktifSenaryo === s.id ? null : s.id)}
                  style={{ padding: '0.85rem 1rem', background: aktifSenaryo === s.id ? 'rgba(255,71,87,0.08)' : 'var(--bg-card)', border: `1px solid ${aktifSenaryo === s.id ? 'rgba(255,71,87,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.84rem' }}>{s.ad}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: s.renk, fontSize: '1rem' }}>{s.etki}%</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: 0 }}>{s.aciklama}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Portföy Etki Simülasyonu</span></div>
            <div className={styles.cardBody}>
              {senaryo ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,71,87,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,71,87,0.2)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Senaryo: {senaryo.ad}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: senaryo.renk }}>{senaryo.etki}%</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Tahmini Kayıp: ₺{Math.abs(portfolyoDegeri * senaryo.etki / 100).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Mevcut Portföy</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>₺{portfolyoDegeri.toLocaleString('tr-TR')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Senaryo Sonrası</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: senaryo.renk, fontWeight: 700 }}>
                        ₺{Math.abs(portfolyoDegeri * (1 + senaryo.etki / 100)).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${100 + senaryo.etki}%`, background: senaryo.renk }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    💡 Bu senaryoda portföyünüz <strong style={{ color: 'var(--text)' }}>{100 + senaryo.etki}</strong> aya dayanır. Önerilen aksiyon: Döviz varlığını artırın.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--text-dim)', fontSize: '0.82rem', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>🎯</span>
                  Bir senaryo seçin
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'checkup' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Aylık Finansal Check-Up — Mayıs 2026</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { baslik: 'Acil Fon Yeterliliği', puan: 85, renk: 'var(--profit)', detay: '4.2 aylık gideri karşılar. Hedef: 6 ay' },
              { baslik: 'Bütçe Disiplini', puan: 72, renk: '#f0b429', detay: '3 kategoride bütçe aşımı tespit edildi' },
              { baslik: 'Borç Yönetimi', puan: 90, renk: 'var(--profit)', detay: 'Borç/gelir oranı %28 — Optimal seviye' },
              { baslik: 'Yatırım Çeşitliliği', puan: 68, renk: '#f0b429', detay: 'Hisse ağırlığı yüksek (%52), kripto riski mevcut' },
              { baslik: 'Sigorta Kapsamı', puan: 55, renk: 'var(--loss)', detay: 'Hayat sigortası eksik, DASK güncel değil' },
              { baslik: 'Emeklilik Planlaması', puan: 60, renk: '#f0b429', detay: 'BES katkısı yetersiz — hedefin %40 gerisinde' },
            ].map(item => (
              <div key={item.baslik}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 500 }}>{item.baslik}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.renk }}>{item.puan}/100</span>
                </div>
                <div className={styles.progressBar} style={{ height: 8 }}>
                  <div className={styles.progressFill} style={{ width: `${item.puan}%`, background: item.renk }}></div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>{item.detay}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aktifTab === 'anomali' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Harcama Anomali Tespiti</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--loss)', fontWeight: 600 }}>3 anormallik tespit edildi</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Normal Ortalama</th>
                <th>Bu Ay</th>
                <th>Sapma</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {ANOMALI_VERISI.map(a => (
                <tr key={a.kategori}>
                  <td style={{ fontWeight: 600 }}>{a.kategori}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₺{a.normal.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: a.uyari ? 'var(--loss)' : 'var(--text)' }}>₺{a.bu_ay.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: a.sapma > 0 ? 'var(--loss)' : 'var(--profit)', fontWeight: 700 }}>
                    {a.sapma > 0 ? '+' : ''}{a.sapma.toFixed(1)}%
                  </td>
                  <td>
                    {a.uyari
                      ? <span style={{ fontSize: '0.72rem', color: 'var(--loss)', fontWeight: 600 }}>⚠ Anormal</span>
                      : <span style={{ fontSize: '0.72rem', color: 'var(--profit)', fontWeight: 600 }}>✓ Normal</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
