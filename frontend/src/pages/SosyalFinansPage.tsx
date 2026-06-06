import { useState } from 'react'
import styles from './SharedPage.module.css'

const YATIRIMCILAR = [
  { id: 1, ad: 'Ahmet Yılmaz', kullanici: '@ahmetyilmaz', getiri: '+34.2%', takipci: 1204, portfoy: 'BIST100, Altın, USD', risk: 'Orta', puan: 98 },
  { id: 2, ad: 'Elif Kaya', kullanici: '@elifkaya_trader', getiri: '+28.7%', takipci: 876, portfoy: 'Kripto, Nasdaq ETF', risk: 'Yüksek', puan: 94 },
  { id: 3, ad: 'Mehmet Demir', kullanici: '@mdemir_invest', getiri: '+19.1%', takipci: 2341, portfoy: 'Temettü hisseleri, Eurobond', risk: 'Düşük', puan: 91 },
  { id: 4, ad: 'Selin Arslan', kullanici: '@selinarslann', getiri: '+41.5%', takipci: 560, portfoy: 'Growth hisseler, BTC', risk: 'Yüksek', puan: 88 },
]

const YORUMLAR = [
  { id: 1, kullanici: '@mdemir_invest', icerik: 'THYAO için temettü ödemesi bu çeyrek de güçlü geldi. Pozisyon artırmayı düşünüyorum.', zaman: '12 dk önce', begen: 34 },
  { id: 2, kullanici: '@elifkaya_trader', icerik: 'BTC 70K direncini test ediyor. Kırılırsa ATH güncellemesi kaçınılmaz.', zaman: '1 sa önce', begen: 67 },
  { id: 3, kullanici: '@ahmetyilmaz', icerik: 'Altın pozisyonum aylık bazda %8 kârdayım. Merkez bankası alımları devam ediyor.', zaman: '3 sa önce', begen: 112 },
]

const REFERANSLAR = [
  { ad: 'Burak Şahin', tarih: '2026-05-10', durum: 'Aktif', komisyon: 240 },
  { ad: 'Zeynep Yıldız', tarih: '2026-04-28', durum: 'Aktif', komisyon: 180 },
  { ad: 'Can Öztürk', tarih: '2026-05-20', durum: 'Beklemede', komisyon: 0 },
]

export function SosyalFinansPage() {
  const [aktifTab, setAktifTab] = useState('kopya')
  const [portfoyPaylas, setPortfoyPaylas] = useState(false)
  const [takipEdilenler, setTakipEdilenler] = useState<number[]>([])
  const [yeniYorum, setYeniYorum] = useState('')

  const greediIndex = 68

  const toggleTakip = (id: number) => {
    setTakipEdilenler(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Sosyal Finans</h1>
          <p className={styles.pageSub}>Yatırımcı topluluğu, kopya trading ve referans takibi</p>
        </div>
        <button className="btn btn-primary">+ Portföy Paylaş</button>
      </div>

      {/* Metrikler */}
      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Takipçi Sayım</span>
          <span className={styles.metricValue}>1.847</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+124 bu ay</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kopya Eden</span>
          <span className={styles.metricValue}>312</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+28 bu hafta</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Referans Kazancı</span>
          <span className={styles.metricValue}>₺420</span>
          <span className={`${styles.metricChange} ${styles.up}`}>3 aktif referans</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Korku & Açgözlülük</span>
          <span className={styles.metricValue} style={{ color: 'var(--warning)' }}>{greediIndex}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>Açgözlülük</span>
        </div>
      </div>

      {/* Fear & Greed Göstergesi */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Korku & Açgözlülük Endeksi</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Güncel — 29 Mayıs 2026</span>
        </div>
        <div className={styles.cardBody}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              <span>Aşırı Korku (0)</span>
              <span style={{ fontWeight: 700, color: greediIndex >= 60 ? '#f0b429' : greediIndex >= 40 ? 'var(--text)' : 'var(--loss)' }}>
                {greediIndex} — {greediIndex >= 75 ? 'Aşırı Açgözlülük' : greediIndex >= 55 ? 'Açgözlülük' : greediIndex >= 45 ? 'Nötr' : greediIndex >= 25 ? 'Korku' : 'Aşırı Korku'}
              </span>
              <span>Aşırı Açgözlülük (100)</span>
            </div>
            <div className={styles.progressBar} style={{ height: 14, borderRadius: 100 }}>
              <div className={styles.progressFill} style={{ width: `${greediIndex}%`, background: `hsl(${greediIndex * 1.2}, 80%, 50%)` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              {['Dün: 61', '1 Hafta: 55', '1 Ay: 49', '1 Yıl: 58'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profil Paylaşım Ayarı */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Yatırımcı Profilim</span>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Portföy Görünürlüğü</div>
              <div className={styles.settingDesc}>Portföyünüzü toplulukla paylaşın, kopya trading'e açık hale getirin</div>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" checked={portfoyPaylas} onChange={() => setPortfoyPaylas(p => !p)} />
              <span className={styles.slider} />
            </label>
          </div>
          {portfoyPaylas && (
            <div className={`${styles.alertCard} ${styles.alertSuccess}`} style={{ marginTop: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--profit)" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="var(--profit)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span style={{ fontSize: '0.78rem', color: 'var(--profit)' }}>Portföyünüz toplulukla paylaşılıyor. 312 kişi pozisyonlarınızı takip ediyor.</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'kopya', l: 'Kopya Trading' },
          { k: 'forum', l: 'Topluluk Forumu' },
          { k: 'referans', l: 'Referans & Ortaklık' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'kopya' && (
        <div className={styles.grid2}>
          {YATIRIMCILAR.map(y => (
            <div key={y.id} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent)', display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem' }}>
                    {y.ad.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{y.ad}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{y.kullanici}</div>
                  </div>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--profit)', fontFamily: 'var(--font-mono)' }}>{y.getiri}</span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Portföy</span>
                  <span>{y.portfoy}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Risk Seviyesi</span>
                  <span style={{ color: y.risk === 'Yüksek' ? 'var(--loss)' : y.risk === 'Orta' ? 'var(--warning)' : 'var(--profit)' }}>{y.risk}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Takipçi</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{y.takipci.toLocaleString('tr-TR')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Başarı Puanı</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{y.puan}/100</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.75rem' }}
                    onClick={() => toggleTakip(y.id)}
                  >
                    {takipEdilenler.includes(y.id) ? 'Takibi Bırak' : 'Takip Et'}
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>Kopyala</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'forum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardBody}>
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <input
                  className={styles.input}
                  style={{ flex: 1 }}
                  placeholder="Toplulukla paylaşmak istediğiniz bir şey var mı?"
                  value={yeniYorum}
                  onChange={e => setYeniYorum(e.target.value)}
                />
                <button className="btn btn-primary" style={{ fontSize: '0.78rem' }}>Paylaş</button>
              </div>
            </div>
          </div>
          {YORUMLAR.map(y => (
            <div key={y.id} className={styles.sectionCard}>
              <div className={styles.cardBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--accent)' }}>{y.kullanici}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{y.zaman}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>{y.icerik}</p>
                <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L8.5 5.5H12L9 7.5L10 11L7 9L4 11L5 7.5L2 5.5H5.5L7 2Z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
                    {y.begen}
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.75rem' }}>Yanıtla</button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.75rem' }}>Paylaş</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'referans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Referans Linkiniz</span></div>
            <div className={styles.cardBody}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  https://financeportal.com/ref/USR-AH4721
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Kopyala</button>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Her başarılı referans için <strong style={{ color: 'var(--accent)' }}>₺120</strong> komisyon kazanırsınız. İlk 3 ay boyunca işlem ücretlerinin %10'u hesabınıza yansır.
              </div>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kişi</th>
                  <th>Katılım Tarihi</th>
                  <th>Durum</th>
                  <th>Kazanılan Komisyon</th>
                </tr>
              </thead>
              <tbody>
                {REFERANSLAR.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.ad}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.tarih}</td>
                    <td>
                      <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: r.durum === 'Aktif' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: r.durum === 'Aktif' ? 'var(--profit)' : 'var(--warning)', border: `1px solid ${r.durum === 'Aktif' ? 'rgba(0,212,170,0.3)' : 'rgba(240,180,41,0.3)'}` }}>
                        {r.durum}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.komisyon > 0 ? 'var(--profit)' : 'var(--text-dim)' }}>
                      {r.komisyon > 0 ? `₺${r.komisyon}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
