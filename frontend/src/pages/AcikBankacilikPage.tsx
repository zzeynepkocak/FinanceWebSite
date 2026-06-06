import { useState } from 'react'
import styles from './SharedPage.module.css'

type Banka = {
  id: string; ad: string; renk: string; logo: string;
  bagli: boolean; sonSync: string; bakiye: number; hesapSayisi: number;
}

const BANKALAR: Banka[] = [
  { id: 'garanti', ad: 'Garanti BBVA', renk: '#00a651', logo: 'G', bagli: true, sonSync: '2026-05-29 14:23', bakiye: 142800, hesapSayisi: 3 },
  { id: 'akbank', ad: 'Akbank', renk: '#e30613', logo: 'A', bagli: true, sonSync: '2026-05-29 14:15', bakiye: 58400, hesapSayisi: 2 },
  { id: 'isbank', ad: 'İş Bankası', renk: '#003087', logo: 'İ', bagli: false, sonSync: '—', bakiye: 0, hesapSayisi: 0 },
  { id: 'yapikredi', ad: 'Yapı Kredi', renk: '#0066cc', logo: 'YK', bagli: true, sonSync: '2026-05-28 09:41', bakiye: 24100, hesapSayisi: 1 },
  { id: 'ziraat', ad: 'Ziraat Bankası', renk: '#c8102e', logo: 'Z', bagli: false, sonSync: '—', bakiye: 0, hesapSayisi: 0 },
]

const HARCAMA_KATEGORILERI = [
  { kategori: 'Market & Yiyecek', tutar: 8420, banka: 'Garanti BBVA', renk: '#0066ff' },
  { kategori: 'Ulaşım', tutar: 2800, banka: 'Akbank', renk: '#00a651' },
  { kategori: 'Faturalar', tutar: 5240, banka: 'Garanti BBVA', renk: '#f0b429' },
  { kategori: 'Eğlence', tutar: 1650, banka: 'Yapı Kredi', renk: '#9945ff' },
  { kategori: 'Giyim', tutar: 3200, banka: 'Akbank', renk: '#e30613' },
]

const TRANSFER_UCRETLERI = [
  { banka: 'Garanti → Akbank', EFT: '₺5', Havale: 'Ücretsiz', FAST: 'Ücretsiz' },
  { banka: 'Akbank → İş', EFT: '₺5', Havale: 'Ücretsiz', FAST: 'Ücretsiz' },
  { banka: 'Yapı Kredi → Ziraat', EFT: '₺7,50', Havale: '₺1', FAST: 'Ücretsiz' },
  { banka: 'Ziraat → Garanti', EFT: '₺5', Havale: 'Ücretsiz', FAST: 'Ücretsiz' },
]

export function AcikBankacilikPage() {
  const [bankalar, setBankalar] = useState(BANKALAR)
  const [aktifTab, setAktifTab] = useState('hesaplar')
  const [senkronize, setSenkronize] = useState(false)

  const baglilar = bankalar.filter(b => b.bagli)
  const toplamBakiye = baglilar.reduce((s, b) => s + b.bakiye, 0)

  const baglan = (id: string) => {
    setBankalar(prev => prev.map(b => b.id === id ? { ...b, bagli: true, sonSync: new Date().toLocaleString('tr-TR'), bakiye: Math.floor(Math.random() * 100000) + 10000, hesapSayisi: 2 } : b))
  }

  const kes = (id: string) => {
    setBankalar(prev => prev.map(b => b.id === id ? { ...b, bagli: false, sonSync: '—', bakiye: 0, hesapSayisi: 0 } : b))
  }

  const handleSync = () => {
    setSenkronize(true)
    setTimeout(() => setSenkronize(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Açık Bankacılık (PSD2)</h1>
          <p className={styles.pageSub}>Bağlı hesaplar ve çapraz banka harcama analizi</p>
        </div>
        <button className="btn btn-primary" onClick={handleSync} disabled={senkronize}>
          {senkronize ? '⟳ Senkronize ediliyor...' : '↻ Tüm Hesapları Yenile'}
        </button>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bağlı Banka</span>
          <span className={styles.metricValue}>{baglilar.length}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>{bankalar.length - baglilar.length} bağlanmadı</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Bakiye</span>
          <span className={styles.metricValue}>₺{toplamBakiye.toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>{baglilar.length} hesap</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bu Ay Harcama</span>
          <span className={styles.metricValue}>₺{HARCAMA_KATEGORILERI.reduce((s, h) => s + h.tutar, 0).toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.down}`}>Tüm bankalar</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Son Senkronizasyon</span>
          <span className={styles.metricValue} style={{ fontSize: '0.9rem' }}>14:23</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>Bugün</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'hesaplar', l: 'Banka Bağlantıları' },
          { k: 'harcama', l: 'Çapraz Harcama' },
          { k: 'transfer', l: 'Transfer Ücretleri' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'hesaplar' && (
        <div className={styles.grid2}>
          {bankalar.map(b => (
            <div key={b.id} className={styles.sectionCard} style={{ borderColor: b.bagli ? b.renk + '55' : 'var(--border)', transition: 'border-color 0.2s' }}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: b.bagli ? `${b.renk}22` : 'var(--bg-card)', border: `1px solid ${b.bagli ? b.renk + '55' : 'var(--border)'}`, display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 800, color: b.bagli ? b.renk : 'var(--text-dim)' }}>
                    {b.logo}
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{b.ad}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Son sync: {b.sonSync}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.bagli ? 'var(--profit)' : 'var(--border)' }}></div>
                  <span style={{ fontSize: '0.72rem', color: b.bagli ? 'var(--profit)' : 'var(--text-dim)' }}>{b.bagli ? 'Bağlı' : 'Bağlı Değil'}</span>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {b.bagli ? (
                  <>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Toplam Bakiye</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem' }}>₺{b.bakiye.toLocaleString('tr-TR')}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Hesap Sayısı</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem' }}>{b.hesapSayisi}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={handleSync}>Yenile</button>
                      <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', color: 'var(--loss)' }} onClick={() => kes(b.id)}>Bağlantıyı Kes</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Bu bankayla bağlantı kurarak hesaplarınızı görüntüleyebilirsiniz.</div>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => baglan(b.id)}>Bağlan (PSD2 Yetkilendir)</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'harcama' && (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Çapraz Banka Harcama Dağılımı — Mayıs 2026</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* SVG bar chart */}
              <svg width="100%" height="160" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet">
                {HARCAMA_KATEGORILERI.map((h, i) => {
                  const maxTutar = Math.max(...HARCAMA_KATEGORILERI.map(x => x.tutar))
                  const barW = 70, gap = 50, x = i * (barW + gap) + 30
                  const barH = (h.tutar / maxTutar) * 110
                  const y = 130 - barH
                  return (
                    <g key={i}>
                      <rect x={x} y={y} width={barW} height={barH} fill={h.renk} opacity={0.85} rx={4} />
                      <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="600">₺{(h.tutar / 1000).toFixed(1)}K</text>
                      <text x={x + barW / 2} y="148" textAnchor="middle" fill="var(--text-dim)" fontSize="9">{h.kategori.split(' ')[0]}</text>
                    </g>
                  )
                })}
              </svg>
              {HARCAMA_KATEGORILERI.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: h.renk, flexShrink: 0 }}></div>
                  <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 500 }}>{h.kategori}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{h.banka}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{h.tutar.toLocaleString('tr-TR')}</span>
                  <div style={{ width: 80 }}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${(h.tutar / HARCAMA_KATEGORILERI.reduce((s, x) => s + x.tutar, 0)) * 100}%`, background: h.renk }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {aktifTab === 'transfer' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Banka Arası Transfer Ücret Karşılaştırması</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>Transfer Yönü</th><th>EFT</th><th>Havale</th><th>FAST</th></tr>
            </thead>
            <tbody>
              {TRANSFER_UCRETLERI.map((t, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{t.banka}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: t.EFT === 'Ücretsiz' ? 'var(--profit)' : 'var(--warning)' }}>{t.EFT}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: t.Havale === 'Ücretsiz' ? 'var(--profit)' : 'var(--warning)' }}>{t.Havale}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: t.FAST === 'Ücretsiz' ? 'var(--profit)' : 'var(--warning)' }}>{t.FAST}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.cardBody} style={{ borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
              💡 <strong>Öneri:</strong> FAST (Anlık Ödeme Sistemi) 7/24 ücretsiz çalışır ve 10 saniye içinde teslim eder. EFT yerine FAST kullanarak yıllık ₺240+ tasarruf edebilirsiniz.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
