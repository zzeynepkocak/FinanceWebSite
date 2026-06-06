import { useState } from 'react'
import styles from './SharedPage.module.css'

const ULKELER = [
  { kod: 'DE', ad: 'Almanya', para: 'EUR', kur: 36.42 },
  { kod: 'US', ad: 'Amerika Birleşik Devletleri', para: 'USD', kur: 33.85 },
  { kod: 'GB', ad: 'Birleşik Krallık', para: 'GBP', kur: 43.12 },
  { kod: 'JP', ad: 'Japonya', para: 'JPY', kur: 0.229 },
  { kod: 'AE', ad: 'Birleşik Arap Emirlikleri', para: 'AED', kur: 9.22 },
  { kod: 'SA', ad: 'Suudi Arabistan', para: 'SAR', kur: 9.02 },
  { kod: 'CH', ad: 'İsviçre', para: 'CHF', kur: 38.17 },
]

const ATMS = [
  { ulke: 'Almanya', banka: 'Deutsche Bank', limitGun: 500, limitAy: 3000, ucret: '€2 + %1.5', ozel: 'Ücretsiz ilk 2 çekim' },
  { ulke: 'ABD', banka: 'Chase ATM', limitGun: 300, limitAy: 2000, ucret: '$3.50', ozel: '—' },
  { ulke: 'İngiltere', banka: 'Barclays', limitGun: 200, limitAy: 1500, ucret: '£2 + %2', ozel: '—' },
  { ulke: 'BAE', banka: 'Emirates NBD', limitGun: 2000, limitAy: 10000, ucret: 'AED 10', ozel: 'Ücretsiz limitli çekim' },
]

const IBANLAR = [
  { para: 'EUR', iban: 'TR48 0001 0017 0001 2345 6789 12', bakiye: 2840.50, durum: 'Aktif' },
  { para: 'USD', iban: 'TR48 0001 0017 0001 9876 5432 10', bakiye: 1520.00, durum: 'Aktif' },
  { para: 'GBP', iban: 'TR48 0001 0017 0001 1122 3344 55', bakiye: 0, durum: 'Pasif' },
]

export function SeyahatPage() {
  const [seyahatMod, setSeyahatMod] = useState(false)
  const [secilenUlke, setSecilenUlke] = useState('DE')
  const [tutar, setTutar] = useState('1000')
  const [aktifTab, setAktifTab] = useState('doviz')
  const [qrGoster, setQrGoster] = useState(false)

  const ulke = ULKELER.find(u => u.kod === secilenUlke) || ULKELER[0]
  const hesaplanan = parseFloat(tutar || '0') / ulke.kur

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Seyahat & Çok Dövizli İşlemler</h1>
          <p className={styles.pageSub}>Seyahat modu, döviz çevirici ve uluslararası ATM bilgileri</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Seyahat Modu</span>
          <label className={styles.switch}>
            <input type="checkbox" checked={seyahatMod} onChange={() => setSeyahatMod(s => !s)} />
            <span className={styles.slider} />
          </label>
        </div>
      </div>

      {seyahatMod && (
        <div className={`${styles.alertCard} ${styles.alertSuccess}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C5 2 3 4.5 3 7c0 3.5 5 9 5 9s5-5.5 5-9c0-2.5-2-5-5-5z" stroke="var(--profit)" strokeWidth="1.5" fill="none"/><circle cx="8" cy="7" r="1.5" stroke="var(--profit)" strokeWidth="1.2"/></svg>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--profit)' }}>Seyahat Modu Aktif — {ulke.ad}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Yurt dışı ödeme bildirimleri ve döviz uyarıları etkinleştirildi. Yabancı işlem ücreti: %0 (Platinum kart).</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Ülke Seçin</label>
          <select className={styles.select} style={{ width: '100%' }} value={secilenUlke} onChange={e => setSecilenUlke(e.target.value)}>
            {ULKELER.map(u => <option key={u.kod} value={u.kod}>{u.ad} ({u.para})</option>)}
          </select>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'doviz', l: 'Döviz Çevirici' },
          { k: 'iban', l: 'Çok Dövizli IBAN' },
          { k: 'atm', l: 'ATM Bilgileri' },
          { k: 'lounge', l: 'Havalimanı Lounge' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'doviz' && (
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Dinamik Döviz Çevirici</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Türk Lirası (TRY)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} value={tutar} onChange={e => setTutar(e.target.value)} />
              </div>
              <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '1.2rem' }}>⇅</div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>{ulke.para} ({ulke.ad})</label>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>
                  {hesaplanan.toFixed(2)} {ulke.para}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem' }}>
                <span>1 {ulke.para} = ₺{ulke.kur.toFixed(2)}</span>
                <span>Güncelleme: 29 May 15:42</span>
              </div>
            </div>
          </div>
          <div className={styles.grid4}>
            {ULKELER.map(u => (
              <div key={u.kod} className={styles.metricCard} style={{ cursor: 'pointer' }} onClick={() => setSecilenUlke(u.kod)}>
                <span className={styles.metricLabel}>{u.para}</span>
                <span className={styles.metricValue} style={{ fontSize: '1rem' }}>₺{u.kur.toFixed(2)}</span>
                <span className={`${styles.metricChange} ${styles.neutral}`}>{u.ad.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aktifTab === 'iban' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {IBANLAR.map((ib, i) => (
            <div key={i} className={styles.sectionCard}>
              <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--accent-dim)', border: '1px solid rgba(0,212,170,0.3)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent)', flexShrink: 0 }}>
                  {ib.para}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text)' }}>{ib.iban}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Bakiye: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{ib.bakiye.toFixed(2)} {ib.para}</strong></div>
                </div>
                <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: ib.durum === 'Aktif' ? 'rgba(0,212,170,0.1)' : 'rgba(150,150,150,0.1)', color: ib.durum === 'Aktif' ? 'var(--profit)' : 'var(--text-dim)', border: `1px solid ${ib.durum === 'Aktif' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
                  {ib.durum}
                </span>
                <button className="btn btn-secondary" style={{ fontSize: '0.72rem' }}>Kopyala</button>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>+ Yeni Döviz Hesabı Aç</button>
        </div>
      )}

      {aktifTab === 'atm' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ülke</th>
                <th>Banka / ATM Ağı</th>
                <th>Günlük Limit</th>
                <th>Aylık Limit</th>
                <th>Çekim Ücreti</th>
                <th>Özel Avantaj</th>
              </tr>
            </thead>
            <tbody>
              {ATMS.map((a, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{a.ulke}</td>
                  <td>{a.banka}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{a.limitGun}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{a.limitAy}</td>
                  <td style={{ color: 'var(--loss)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{a.ucret}</td>
                  <td style={{ color: 'var(--profit)', fontSize: '0.78rem' }}>{a.ozel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'lounge' && (
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Havalimanı Lounge Erişim QR Kodu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center', textAlign: 'center' }}>
              {!qrGoster ? (
                <>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                    Platinum kartınızla dünya genelinde 1.300+ havalimanı lounge'ına ücretsiz erişiminiz bulunmaktadır. QR kodu göstermek için doğrulama gereklidir.
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setQrGoster(true)}>QR Kodu Göster</button>
                </>
              ) : (
                <>
                  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="60" height="60" rx="4" stroke="var(--text)" strokeWidth="3" fill="none"/>
                    <rect x="22" y="22" width="36" height="36" rx="2" fill="var(--text)"/>
                    <rect x="90" y="10" width="60" height="60" rx="4" stroke="var(--text)" strokeWidth="3" fill="none"/>
                    <rect x="102" y="22" width="36" height="36" rx="2" fill="var(--text)"/>
                    <rect x="10" y="90" width="60" height="60" rx="4" stroke="var(--text)" strokeWidth="3" fill="none"/>
                    <rect x="22" y="102" width="36" height="36" rx="2" fill="var(--text)"/>
                    <rect x="90" y="90" width="10" height="10" fill="var(--text)"/>
                    <rect x="106" y="90" width="10" height="10" fill="var(--text)"/>
                    <rect x="122" y="90" width="10" height="10" fill="var(--text)"/>
                    <rect x="140" y="90" width="10" height="10" fill="var(--text)"/>
                    <rect x="90" y="106" width="10" height="10" fill="var(--text)"/>
                    <rect x="114" y="106" width="26" height="10" fill="var(--text)"/>
                    <rect x="90" y="122" width="18" height="10" fill="var(--text)"/>
                    <rect x="122" y="122" width="10" height="10" fill="var(--text)"/>
                    <rect x="90" y="138" width="10" height="10" fill="var(--text)"/>
                    <rect x="106" y="138" width="18" height="10" fill="var(--text)"/>
                    <rect x="140" y="122" width="10" height="28" fill="var(--text)"/>
                  </svg>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Ahmet Yılmaz — Platinum Kart</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Geçerlilik: 29 Mayıs 2026 · 1 giriş hakkı</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Priority Pass · Dragon Pass · LoungeKey ağları geçerli</div>
                  <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.75rem' }} onClick={() => setQrGoster(false)}>Kapat</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
