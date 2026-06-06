import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const MARKETLAR = [
  { id: 1, ad: 'Trendyol', logo: 'T', renk: '#FF6900', bagliMi: true, magaraAdi: 'TechStore TR', aylikCiro: 48200, siparis: 312 },
  { id: 2, ad: 'Amazon TR', logo: 'A', renk: '#FF9900', bagliMi: true, magaraAdi: 'TechStore Amazon', aylikCiro: 22400, siparis: 148 },
  { id: 3, ad: 'Hepsiburada', logo: 'H', renk: '#FF6600', bagliMi: false, magaraAdi: '—', aylikCiro: 0, siparis: 0 },
  { id: 4, ad: 'N11', logo: 'N', renk: '#5F259F', bagliMi: false, magaraAdi: '—', aylikCiro: 0, siparis: 0 },
]

const KESINTILER = [
  { kalem: 'Kargo (Yurtiçi Kargo)', tutar: 4840, oran: '%8.2' },
  { kalem: 'Trendyol Komisyon', tutar: 3376, oran: '%7.0' },
  { kalem: 'Amazon Komisyon', tutar: 1568, oran: '%7.0' },
  { kalem: 'Reklam & Tanıtım', tutar: 1200, oran: '%2.6' },
  { kalem: 'İade İşlem Ücreti', tutar: 420, oran: '%0.9' },
]

const IADELER = [
  { urun: 'Bluetooth Kulaklık Pro X', adet: 3, maliyet: 1890, sebep: 'Ürün hasarlı', tarih: '2026-05-27' },
  { urun: 'Şarj Kablosu 2m', adet: 8, maliyet: 560, sebep: 'Yanlış ürün', tarih: '2026-05-24' },
  { urun: 'Telefon Kılıfı A54', adet: 12, maliyet: 840, sebep: 'Beğenilmedi', tarih: '2026-05-21' },
]

const STOK = [
  { urun: 'Bluetooth Kulaklık Pro X', stok: 45, maliyet: 630, satisFiyati: 1299, deger: 28350 },
  { urun: 'Şarj Kablosu 2m USB-C', stok: 120, maliyet: 70, satisFiyati: 149, deger: 8400 },
  { urun: 'Telefon Kılıfı Samsung A54', stok: 88, maliyet: 70, satisFiyati: 189, deger: 6160 },
  { urun: 'Powerbank 20000mAh', stok: 22, maliyet: 490, satisFiyati: 899, deger: 10780 },
]

export function ETicaretPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('magazalar')
  const [erkenOdemeBasvuru, setErkenOdemeBasvuru] = useState(false)

  const toplamStokDeger = STOK.reduce((t, s) => t + s.deger, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>E-Ticaret Satıcı Finansmanı</h1>
          <p className={styles.pageSub}>Marketplace bağlantıları, kesintiler ve stok finansmanı</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Mağaza bağlantısı kuruldu', 'success')}>+ Yeni Mağaza Bağla</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aylık Toplam Ciro</span>
          <span className={styles.metricValue}>₺70.600</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%12.4 geçen ay</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Kesinti</span>
          <span className={styles.metricValue}>₺11.404</span>
          <span className={`${styles.metricChange} ${styles.down}`}>%16.2 oran</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>İade Maliyeti</span>
          <span className={styles.metricValue}>₺3.290</span>
          <span className={`${styles.metricChange} ${styles.down}`}>23 ürün iade</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Stok Değeri</span>
          <span className={styles.metricValue}>₺{(toplamStokDeger / 1000).toFixed(0)}K</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>4 ürün kalemi</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'magazalar', l: 'Mağazalar' },
          { k: 'kesintiler', l: 'Kargo & Komisyon' },
          { k: 'erken', l: 'Erken Tahsilat' },
          { k: 'iadeler', l: 'İade Takibi' },
          { k: 'stok', l: 'Stok & Finansman' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'magazalar' && (
        <div className={styles.grid2}>
          {MARKETLAR.map(m => (
            <div key={m.id} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: `${m.renk}22`, border: `1px solid ${m.renk}44`, display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '1.1rem', color: m.renk }}>
                    {m.logo}
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{m.ad}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{m.magaraAdi}</div>
                  </div>
                </div>
                <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: m.bagliMi ? 'rgba(0,212,170,0.1)' : 'rgba(150,150,150,0.1)', color: m.bagliMi ? 'var(--profit)' : 'var(--text-dim)', border: `1px solid ${m.bagliMi ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
                  {m.bagliMi ? 'Bağlı' : 'Bağlanmadı'}
                </span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {m.bagliMi ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Aylık Ciro</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{m.aylikCiro.toLocaleString('tr-TR')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Sipariş Sayısı</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{m.siparis}</span>
                    </div>
                    <button className="btn btn-secondary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Bağlantıyı Yönet</button>
                  </>
                ) : (
                  <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>Mağazayı Bağla</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'kesintiler' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Kesinti Kalemi</th><th>Tutar</th><th>Ciro Oranı</th></tr>
            </thead>
            <tbody>
              {KESINTILER.map((k, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{k.kalem}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>₺{k.tutar.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{k.oran}</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--bg-card)' }}>
                <td style={{ fontWeight: 700 }}>Toplam Kesinti</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--loss)' }}>₺{KESINTILER.reduce((t, k) => t + k.tutar, 0).toLocaleString('tr-TR')}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>%16.2</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'erken' && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Erken Tahsilat Başvurusu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Bekleyen Trendyol Ödemesi</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺38.420</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Normal Ödeme Tarihi</span>
                <span>15 Haziran 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Erken Tahsilat Ücreti (%1.2)</span>
                <span style={{ color: 'var(--loss)', fontFamily: 'var(--font-mono)' }}>- ₺461</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderTop: '1px solid var(--border)', paddingTop: '0.65rem' }}>
                <span style={{ fontWeight: 600 }}>Alacağınız Tutar</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)', fontSize: '1rem' }}>₺37.959</span>
              </div>
              {!erkenOdemeBasvuru ? (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setErkenOdemeBasvuru(true)}>Bugün Tahsil Et</button>
              ) : (
                <div className={`${styles.alertCard} ${styles.alertSuccess}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--profit)" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="var(--profit)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: '0.78rem', color: 'var(--profit)' }}>Başvurunuz alındı. ₺37.959, 2 iş günü içinde hesabınıza aktarılacak.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'iadeler' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Ürün</th><th>Adet</th><th>Maliyet</th><th>Sebep</th><th>Tarih</th></tr>
            </thead>
            <tbody>
              {IADELER.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{r.urun}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{r.adet}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>₺{r.maliyet.toLocaleString('tr-TR')}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{r.sebep}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.tarih}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'stok' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Ürün</th><th>Stok</th><th>Maliyet</th><th>Satış Fiyatı</th><th>Stok Değeri</th><th>Marj</th></tr>
              </thead>
              <tbody>
                {STOK.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{s.urun}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{s.stok}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₺{s.maliyet}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₺{s.satisFiyati}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₺{s.deger.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)' }}>%{Math.round(((s.satisFiyati - s.maliyet) / s.satisFiyati) * 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Stok Finansmanı Başvurusu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Toplam stok değeriniz: <strong style={{ color: 'var(--text)' }}>₺{toplamStokDeger.toLocaleString('tr-TR')}</strong>.
                Stok değerinizin %60'ına kadar finansman kullanabilirsiniz.
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Maksimum Finansman Tutarı</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>₺{Math.round(toplamStokDeger * 0.6).toLocaleString('tr-TR')}</span>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>Finansman Başvurusu Yap</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
