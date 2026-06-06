import { useState } from 'react'
import styles from './SharedPage.module.css'
import kstyles from './KartlarimPage.module.css'

/* ── Mock cards ── */
const KARTLAR = [
  { id: 1, tip: 'Kredi Kartı', banka: 'Garanti BBVA', son4: '4821', isim: 'AHMET YILMAZ', limit: 50000, kullanilan: 12480, renk1: '#0066ff', renk2: '#6c5ce7', internet: true, yurtdisi: false, temassiz: true, durum: 'Aktif' },
  { id: 2, tip: 'Banka Kartı', banka: 'Yapı Kredi', son4: '7293', isim: 'AHMET YILMAZ', limit: 0, kullanilan: 0, renk1: '#00d4aa', renk2: '#0066ff', internet: true, yurtdisi: true, temassiz: true, durum: 'Aktif' },
  { id: 3, tip: 'Sanal Kart', banka: 'Garanti BBVA', son4: '5577', isim: 'AHMET YILMAZ', limit: 5000, kullanilan: 2100, renk1: '#e17055', renk2: '#f0b429', internet: true, yurtdisi: false, temassiz: false, durum: 'Sanal' },
]

const ODULLER = [
  { label: 'Bonus Puan', value: '4.280', icon: '⭐', renk: '#f0b429' },
  { label: 'Miles Mil', value: '12.500', icon: '✈', renk: '#0066ff' },
  { label: 'Cashback', value: '₺ 184', icon: '💰', renk: '#00d4aa' },
]

function KartGorseli({ kart }: { kart: typeof KARTLAR[0] }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className={kstyles.cardScene} onClick={() => setFlipped(!flipped)}>
      <div className={`${kstyles.card3d} ${flipped ? kstyles.flipped : ''}`}>
        {/* Ön yüz */}
        <div className={kstyles.cardFace} style={{ background: `linear-gradient(135deg, ${kart.renk1}, ${kart.renk2})` }}>
          <div className={kstyles.cardChip}>
            <div className={kstyles.chipLines}></div>
          </div>
          <div className={kstyles.cardNfc}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M8 6C8 6 6 8 6 12C6 16 8 18 8 18M12 4C12 4 8 7.5 8 12C8 16.5 12 20 12 20M16 2C16 2 10 6.5 10 12C10 17.5 16 22 16 22"/>
            </svg>
          </div>
          <div className={kstyles.cardNumber}>•••• •••• •••• {kart.son4}</div>
          <div className={kstyles.cardBottom}>
            <div>
              <div className={kstyles.cardLabel}>Kart Sahibi</div>
              <div className={kstyles.cardName}>{kart.isim}</div>
            </div>
            <div>
              <div className={kstyles.cardLabel}>Son Kullanma</div>
              <div className={kstyles.cardName}>12/28</div>
            </div>
            <div className={kstyles.cardNetwork}>VISA</div>
          </div>
          <div className={kstyles.cardType}>{kart.tip}</div>
          <div className={kstyles.cardHint} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '0.5rem' }}>
            Çevirmek için tıkla
          </div>
        </div>
        {/* Arka yüz */}
        <div className={`${kstyles.cardFace} ${kstyles.cardBack}`} style={{ background: `linear-gradient(135deg, ${kart.renk2}, ${kart.renk1})` }}>
          <div className={kstyles.magneticStripe}></div>
          <div className={kstyles.cvvArea}>
            <div className={kstyles.cvvLabel}>CVV</div>
            <div className={kstyles.cvvValue}>•••</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function KartlarimPage() {
  const [aktifKart, setAktifKart] = useState(0)
  const [switches, setSwitches] = useState(
    KARTLAR.map(k => ({ internet: k.internet, yurtdisi: k.yurtdisi, temassiz: k.temassiz }))
  )

  const kart = KARTLAR[aktifKart]
  const sw = switches[aktifKart]

  const toggle = (field: 'internet' | 'yurtdisi' | 'temassiz') => {
    setSwitches(prev => prev.map((s, i) => i === aktifKart ? { ...s, [field]: !s[field] } : s))
  }

  const limitKullanim = kart.limit > 0 ? (kart.kullanilan / kart.limit) * 100 : 0

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kartlarım</h1>
          <p className={styles.pageSub}>{KARTLAR.length} kart — Kredi, Banka, Sanal</p>
        </div>
        <button className="btn btn-primary">+ Yeni Sanal Kart</button>
      </div>

      {/* Kart seçici */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {KARTLAR.map((k, i) => (
          <button
            key={k.id}
            className={`${kstyles.kartSecici} ${aktifKart === i ? kstyles.kartSeciciAktif : ''}`}
            onClick={() => setAktifKart(i)}
          >
            <div className={kstyles.kartSeciciDot} style={{ background: k.renk1 }}></div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{k.tip}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>•••• {k.son4}</div>
            </div>
            <span className={kstyles.kartDurum} style={{ background: k.durum === 'Aktif' ? 'rgba(0,212,170,0.15)' : 'rgba(240,180,41,0.15)', color: k.durum === 'Aktif' ? 'var(--profit)' : 'var(--warning)' }}>
              {k.durum}
            </span>
          </button>
        ))}
      </div>

      <div className={kstyles.mainGrid}>
        {/* Sol: 3D Kart Görseli */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{kart.banka} — {kart.tip}</span>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <KartGorseli kart={kart} />

            {kart.limit > 0 && (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Kullanılan Limit</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    ₺{kart.kullanilan.toLocaleString('tr-TR')} / ₺{kart.limit.toLocaleString('tr-TR')}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${limitKullanim}%`, background: limitKullanim > 80 ? 'var(--loss)' : 'var(--accent)' }}></div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem', textAlign: 'right' }}>
                  {limitKullanim.toFixed(0)}% kullanıldı
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
              <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem' }}>Şifre Değiştir</button>
              <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem', color: 'var(--loss)' }}>
                🔒 Geçici Kilitle
              </button>
            </div>
          </div>
        </div>

        {/* Sağ: Kart ayarları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Özellik switchleri */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Kart Özellikleri</span>
            </div>
            <div className={styles.cardBody}>
              {[
                { key: 'internet' as const, label: 'İnternet Alışverişi', desc: 'Online ödeme işlemleri', icon: '🌐' },
                { key: 'yurtdisi' as const, label: 'Yurtdışı İşlemler', desc: 'Yabancı para birimi işlemleri', icon: '🌍' },
                { key: 'temassiz' as const, label: 'Temassız Ödeme', desc: 'NFC ile temas gerektirmez', icon: '📡' },
              ].map(({ key, label, desc, icon }) => (
                <div key={key} className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>{icon} {label}</div>
                    <div className={styles.settingDesc}>{desc}</div>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={sw[key]} onChange={() => toggle(key)} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Harcama Limiti Slider */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Dinamik Harcama Limiti</span>
            </div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Günlük ATM Limiti', value: 5000, max: 20000 },
                { label: 'Online Alışveriş Limiti', value: 15000, max: 50000 },
                { label: 'Temassız Limit', value: 2500, max: 10000 },
              ].map(({ label, value, max }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₺{value.toLocaleString('tr-TR')}</span>
                  </div>
                  <input type="range" min={0} max={max} defaultValue={value} style={{ width: '100%', accentColor: 'var(--accent)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Ödül Takibi */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Puan & Mil Ödülleri</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.grid3} style={{ gap: '0.75rem' }}>
                {ODULLER.map(o => (
                  <div key={o.label} style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{o.icon}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: o.renk }}>{o.value}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{o.label}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.78rem' }}>
                ✈ Mil ile Uçak Bileti Al
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Harcama Yuvarlama */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Harcama Yuvarlama (Round-Up) ile Otomatik Birikim</span>
          <label className={styles.switch}>
            <input type="checkbox" defaultChecked />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.cardBody}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
            Her alışverişte kalan kuruş değeri otomatik birikim hesabına aktarılır.
            Örnek: ₺47,30 harcama → ₺0,70 birikime aktarılır.
          </p>
          <div className={styles.grid4} style={{ gap: '0.75rem' }}>
            {[
              { label: 'Bu Ay Biriken', value: '₺142,80', color: 'var(--profit)' },
              { label: 'Toplam Biriken', value: '₺1.847,20', color: 'var(--accent)' },
              { label: 'İşlem Sayısı', value: '384', color: 'var(--text)' },
              { label: 'Hedef', value: '₺5.000', color: 'var(--text-dim)' },
            ].map(m => (
              <div key={m.label} className={styles.metricCard}>
                <span className={styles.metricLabel}>{m.label}</span>
                <span className={styles.metricValue} style={{ fontSize: '1.1rem', color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
