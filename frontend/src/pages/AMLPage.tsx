import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const ISLEMLER = [
  { id: 'TRX-48291', tarih: '2026-05-29 14:32', miktar: 48200, tip: 'Havale', karsi: 'Mehmet Yılmaz', ulke: 'TR', risk: 'Düşük', durum: 'Temiz' },
  { id: 'TRX-48290', tarih: '2026-05-29 13:15', miktar: 125000, tip: 'EFT', karsi: 'Offshore Holdings Ltd.', ulke: 'BVI', risk: 'Yüksek', durum: 'İncelemede' },
  { id: 'TRX-48285', tarih: '2026-05-29 10:44', miktar: 9800, tip: 'POS', karsi: 'Market ABC', ulke: 'TR', risk: 'Düşük', durum: 'Temiz' },
  { id: 'TRX-48271', tarih: '2026-05-28 18:22', miktar: 75000, tip: 'Havale', karsi: 'Unknown Corp', ulke: 'RU', risk: 'Yüksek', durum: 'SAR Gönderildi' },
  { id: 'TRX-48260', tarih: '2026-05-28 11:05', miktar: 22400, tip: 'EFT', karsi: 'Ahmet Çelik', ulke: 'TR', risk: 'Orta', durum: 'Temiz' },
]

const YUKSEK_RISKLI_ULKELER = ['BVI', 'RU', 'IR', 'KP', 'SY', 'AF', 'MM']

export function AMLPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('izleme')
  const [gunlukLimit] = useState(500000)
  const [gunlukKullanim] = useState(283200)
  const [pepDurumu] = useState<'PEP Değil' | 'PEP' | 'Yakın PEP'>('PEP Değil')
  const [ipFiltresi, setIpFiltresi] = useState(true)

  const kullanımYuzdesi = Math.round((gunlukKullanim / gunlukLimit) * 100)

  const riskRenk = (risk: string) => {
    if (risk === 'Yüksek') return { bg: 'rgba(255,71,87,0.1)', color: 'var(--loss)', border: 'rgba(255,71,87,0.3)' }
    if (risk === 'Orta') return { bg: 'rgba(240,180,41,0.1)', color: 'var(--warning)', border: 'rgba(240,180,41,0.3)' }
    return { bg: 'rgba(0,212,170,0.1)', color: 'var(--profit)', border: 'rgba(0,212,170,0.3)' }
  }

  const durumRenk = (durum: string) => {
    if (durum === 'SAR Gönderildi') return { bg: 'rgba(255,71,87,0.1)', color: 'var(--loss)' }
    if (durum === 'İncelemede') return { bg: 'rgba(240,180,41,0.1)', color: 'var(--warning)' }
    return { bg: 'rgba(0,212,170,0.1)', color: 'var(--profit)' }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>AML & Uyum (Kara Para Aklamayla Mücadele)</h1>
          <p className={styles.pageSub}>SAR uyarıları, coğrafi kısıtlamalar, PEP durumu ve işlem izleme</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('SAR raporu oluşturuldu, Uyum Ekibine iletildi', 'success')}>SAR Raporu Oluştur</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Kritik Uyarı */}
      <div className={`${styles.alertCard} ${styles.alertDanger}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" stroke="var(--loss)" strokeWidth="1.5" fill="none"/><line x1="8" y1="6" x2="8" y2="9.5" stroke="var(--loss)" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="var(--loss)"/></svg>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--loss)' }}>1 Şüpheli İşlem Tespit Edildi</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TRX-48271: Rusya'ya ₺75.000 EFT transferi. SAR raporu MASAK'a iletildi.</div>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Günlük İşlem Limiti</span>
          <span className={styles.metricValue}>₺500K</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>%{kullanımYuzdesi} kullanıldı</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>PEP Durumu</span>
          <span className={styles.metricValue} style={{ fontSize: '0.9rem', color: pepDurumu === 'PEP Değil' ? 'var(--profit)' : 'var(--loss)' }}>{pepDurumu}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Doğrulandı</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bugün İşlem</span>
          <span className={styles.metricValue}>₺{(gunlukKullanim / 1000).toFixed(1)}K</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>5 işlem</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aktif SAR</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>1</span>
          <span className={`${styles.metricChange} ${styles.down}`}>İnceleniyor</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'izleme', l: 'İşlem İzleme' },
          { k: 'limit', l: 'Limit Yönetimi' },
          { k: 'cografi', l: 'Coğrafi Kısıtlama' },
          { k: 'pep', l: 'PEP & KYC' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'izleme' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>İşlem ID</th>
                <th>Tarih / Saat</th>
                <th>Tutar</th>
                <th>Tür</th>
                <th>Karşı Taraf</th>
                <th>Ülke</th>
                <th>Risk</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {ISLEMLER.map(i => {
                const rr = riskRenk(i.risk)
                const dr = durumRenk(i.durum)
                const yuksekRisklUlke = YUKSEK_RISKLI_ULKELER.includes(i.ulke)
                return (
                  <tr key={i.id} style={{ background: i.risk === 'Yüksek' ? 'rgba(255,71,87,0.02)' : undefined }}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{i.id}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{i.tarih}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: i.miktar >= 50000 ? 'var(--warning)' : 'var(--text)' }}>₺{i.miktar.toLocaleString('tr-TR')}</td>
                    <td style={{ fontSize: '0.78rem' }}>{i.tip}</td>
                    <td style={{ fontSize: '0.82rem', fontWeight: 500 }}>{i.karsi}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: 4, background: yuksekRisklUlke ? 'rgba(255,71,87,0.1)' : 'var(--bg-card)', color: yuksekRisklUlke ? 'var(--loss)' : 'var(--text-dim)', border: `1px solid ${yuksekRisklUlke ? 'rgba(255,71,87,0.3)' : 'var(--border)'}` }}>{i.ulke}</span>
                    </td>
                    <td><span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, background: rr.bg, color: rr.color, border: `1px solid ${rr.border}` }}>{i.risk}</span></td>
                    <td><span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: dr.bg, color: dr.color, border: '1px solid transparent' }}>{i.durum}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'limit' && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Günlük İşlem Limiti</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Kullanılan</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{gunlukKullanim.toLocaleString('tr-TR')} / ₺{gunlukLimit.toLocaleString('tr-TR')}</span>
              </div>
              <div className={styles.progressBar} style={{ height: 12 }}>
                <div className={styles.progressFill} style={{ width: `${kullanımYuzdesi}%`, background: kullanımYuzdesi >= 80 ? 'var(--loss)' : kullanımYuzdesi >= 60 ? 'var(--warning)' : 'var(--accent)' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Kalan: ₺{(gunlukLimit - gunlukKullanim).toLocaleString('tr-TR')} · Gece yarısı sıfırlanır</div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                {[
                  { l: 'Tek İşlem Limiti', v: '₺100.000' },
                  { l: 'Aylık İşlem Limiti', v: '₺5.000.000' },
                  { l: 'Yurt Dışı Günlük Limit', v: '₺200.000' },
                ].map(item => (
                  <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.45rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{item.l}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'cografi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardBody}>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Yüksek Riskli Ülke IP Filtreleme</div>
                  <div className={styles.settingDesc}>Kara listedeki ülkelerden giriş denemeleri otomatik engellenir</div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={ipFiltresi} onChange={() => setIpFiltresi(f => !f)} />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Kısıtlı Ülkeler (FATF Gri/Kara Liste)</span></div>
            <div className={styles.cardBody}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {[
                  { kod: 'KP', ad: 'Kuzey Kore' },
                  { kod: 'IR', ad: 'İran' },
                  { kod: 'SY', ad: 'Suriye' },
                  { kod: 'RU', ad: 'Rusya' },
                  { kod: 'AF', ad: 'Afganistan' },
                  { kod: 'MM', ad: 'Myanmar' },
                  { kod: 'BVI', ad: 'BVI (Offsh.)' },
                  { kod: 'CY', ad: 'Kıbrıs (İzl.)' },
                ].map(u => (
                  <div key={u.kod} style={{ padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.3)', fontSize: '0.72rem', color: 'var(--loss)', fontWeight: 500 }}>
                    {u.kod} — {u.ad}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'pep' && (
        <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>PEP (Politically Exposed Person) Durumu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(0,212,170,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,212,170,0.2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="var(--profit)" strokeWidth="1.5"/><path d="M7 12l3.5 3.5L17 8" stroke="var(--profit)" strokeWidth="2" strokeLinecap="round"/></svg>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--profit)' }}>PEP Değil</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Son tarama: 29 Mayıs 2026 — Worldcheck, Dow Jones</div>
                </div>
              </div>
              {[
                { l: 'Ad Soyad', v: 'Ahmet Yılmaz' },
                { l: 'TC Kimlik', v: '1234•••••••' },
                { l: 'KYC Seviyesi', v: 'Gelişmiş (Tier 3)' },
                { l: 'Son KYC Güncellemesi', v: '15 Ocak 2026' },
                { l: 'Tarama Sıklığı', v: 'Aylık Otomatik' },
              ].map(item => (
                <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.45rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{item.l}</span>
                  <span style={{ fontWeight: 500 }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
