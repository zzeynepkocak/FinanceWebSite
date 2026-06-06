import { useState } from 'react'
import styles from './SharedPage.module.css'

const SISTEM_DURUMU = [
  { servis: 'API Gateway', durum: 'Sağlıklı', gecikme: '12ms', uptime: '99.98%', renk: 'var(--profit)' },
  { servis: 'Veritabanı (Primary)', durum: 'Sağlıklı', gecikme: '4ms', uptime: '99.99%', renk: 'var(--profit)' },
  { servis: 'Redis Cache', durum: 'Sağlıklı', gecikme: '1ms', uptime: '100%', renk: 'var(--profit)' },
  { servis: 'Bildirim Servisi', durum: 'Uyarı', gecikme: '280ms', uptime: '98.4%', renk: 'var(--warning)' },
  { servis: 'Ödeme Entegrasyonu', durum: 'Sağlıklı', gecikme: '45ms', uptime: '99.91%', renk: 'var(--profit)' },
  { servis: 'OCR Servisi', durum: 'Sağlıklı', gecikme: '380ms', uptime: '99.7%', renk: 'var(--profit)' },
]

const ŞÜPHELI_ISLEMLER = [
  { id: 'TXN-88421', kullanici: 'user_4421', tip: 'Hızlı Transfer', tutar: 485000, ip: '185.241.x.x', risk: 'Yüksek', zaman: '14:22:08' },
  { id: 'TXN-88305', kullanici: 'user_1092', tip: 'Kripto Çekim', tutar: 182000, ip: '91.189.x.x', risk: 'Orta', zaman: '13:58:44' },
  { id: 'TXN-88184', kullanici: 'user_7741', tip: 'Çoklu Küçük Transfer', tutar: 24900, ip: '46.101.x.x', risk: 'Yüksek', zaman: '13:12:19' },
]

const KARA_LISTE = [
  { tip: 'IBAN', deger: 'TR45 0006 2001 7160 0006 2988 26', sebep: 'Dolandırıcılık', tarih: '2026-04-12' },
  { tip: 'IP', deger: '185.241.208.xxx', sebep: 'Brute-force', tarih: '2026-05-01' },
  { tip: 'TC No', deger: '123*****890', sebep: 'Sahte KYC', tarih: '2026-05-18' },
]

const KOMISYON_AYARLARI = [
  { islem: 'EFT', oran: '₺5,00', maks: '₺50', duzenle: false },
  { islem: 'SWIFT', oran: '%0.25', maks: '₺250', duzenle: false },
  { islem: 'Kripto Swap', oran: '%0.30', maks: '—', duzenle: false },
  { islem: 'Vadeli İşlem', oran: '%0.05', maks: '₺500', duzenle: false },
  { islem: 'Borsa Alım', oran: '%0.15', maks: '—', duzenle: false },
]

export function AdminPage() {
  const [aktifTab, setAktifTab] = useState('sistem')
  const [aktifKullanici] = useState(1847)
  const [onayBekleyen] = useState(23)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Admin Paneli</h1>
          <p className={styles.pageSub}>Sistem sağlığı, kullanıcı yönetimi ve güvenlik</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius)', fontSize: '0.78rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--profit)', animation: 'pulse 2s infinite' }}></div>
            <span style={{ color: 'var(--profit)' }}>{aktifKullanici.toLocaleString()} aktif kullanıcı</span>
          </div>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aktif Kullanıcı</span>
          <span className={styles.metricValue}>{aktifKullanici.toLocaleString()}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+12% son saat</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Günlük İşlem</span>
          <span className={styles.metricValue}>24.841</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+8.4% dün</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Onay Bekleyen KYC</span>
          <span className={styles.metricValue} style={{ color: 'var(--warning)' }}>{onayBekleyen}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>manuel inceleme</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Şüpheli İşlem</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>3</span>
          <span className={`${styles.metricChange} ${styles.down}`}>yüksek risk</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'sistem', l: 'Sistem Sağlığı' },
          { k: 'shupheli', l: 'Şüpheli İşlemler' },
          { k: 'karalistesi', l: 'Kara Listesi' },
          { k: 'komisyon', l: 'Komisyon Ayarları' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'sistem' && (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Servis Durumu</span><span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Son güncelleme: 14:28:00</span></div>
            <table className={styles.table}>
              <thead>
                <tr><th>Servis</th><th>Durum</th><th>Gecikme</th><th>Uptime</th><th>Aksiyon</th></tr>
              </thead>
              <tbody>
                {SISTEM_DURUMU.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{s.servis}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.renk }}></div>
                        <span style={{ color: s.renk, fontSize: '0.8rem', fontWeight: 600 }}>{s.durum}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: parseFloat(s.gecikme) > 200 ? 'var(--warning)' : 'var(--text)' }}>{s.gecikme}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: parseFloat(s.uptime) >= 99.9 ? 'var(--profit)' : 'var(--warning)' }}>{s.uptime}</td>
                    <td>
                      <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Detay</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.grid2}>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Canlı Trafik (Son 1 Saat)</span></div>
              <div className={styles.cardBody}>
                {/* SVG bar chart */}
                <svg width="100%" viewBox="0 0 320 80" preserveAspectRatio="xMidYMid meet">
                  {Array.from({ length: 12 }, (_, i) => {
                    const h = 20 + Math.random() * 45
                    return (
                      <rect key={i} x={i * 26 + 2} y={75 - h} width={22} height={h} fill="var(--accent)" opacity={0.7 + i * 0.025} rx={3} />
                    )
                  })}
                  {['5dk', '10', '20', '30', '40', '50', '60dk'].map((l, i) => (
                    <text key={i} x={i * 46 + 2} y={79} fill="var(--text-dim)" fontSize="8">{l}</text>
                  ))}
                </svg>
              </div>
            </div>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Sistem Metrikleri</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { l: 'CPU Kullanımı', v: 42, renk: 'var(--accent)' },
                  { l: 'RAM Kullanımı', v: 68, renk: 'var(--warning)' },
                  { l: 'Disk I/O', v: 23, renk: 'var(--profit)' },
                  { l: 'Ağ Bant Genişliği', v: 55, renk: 'var(--accent)' },
                ].map((m, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                      <span>{m.l}</span><span style={{ fontFamily: 'var(--font-mono)', color: m.renk }}>%{m.v}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${m.v}%`, background: m.renk }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {aktifTab === 'shupheli' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Şüpheli İşlem Paneli</span>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Tümünü İhbar Et</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>İşlem ID</th><th>Kullanıcı</th><th>Tür</th><th>Tutar</th><th>IP Adresi</th><th>Risk</th><th>Zaman</th><th>Aksiyon</th></tr>
            </thead>
            <tbody>
              {ŞÜPHELI_ISLEMLER.map((s, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{s.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{s.kullanici}</td>
                  <td style={{ fontSize: '0.8rem' }}>{s.tip}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--loss)' }}>₺{s.tutar.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.ip}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: s.risk === 'Yüksek' ? 'rgba(255,71,87,0.1)' : 'rgba(240,180,41,0.1)', color: s.risk === 'Yüksek' ? 'var(--loss)' : 'var(--warning)', border: `1px solid ${s.risk === 'Yüksek' ? 'rgba(255,71,87,0.3)' : 'rgba(240,180,41,0.3)'}` }}>
                      {s.risk}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{s.zaman}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>İncele</button>
                      <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: 'rgba(255,71,87,0.1)', color: 'var(--loss)', border: '1px solid rgba(255,71,87,0.3)' }}>Dondur</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'karalistesi' && (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Kara Liste Yönetimi</span>
              <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>+ Ekle</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr><th>Tür</th><th>Değer</th><th>Sebep</th><th>Ekleme Tarihi</th><th>Aksiyon</th></tr>
              </thead>
              <tbody>
                {KARA_LISTE.map((k, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: 'rgba(255,71,87,0.1)', color: 'var(--loss)', border: '1px solid rgba(255,71,87,0.3)' }}>{k.tip}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{k.deger}</td>
                    <td style={{ fontSize: '0.8rem' }}>{k.sebep}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{k.tarih}</td>
                    <td>
                      <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: 'var(--loss)' }}>Kaldır</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ maxWidth: 460 }}>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Yeni Kara Liste Girişi</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <select className={styles.select} style={{ width: '100%' }}>
                  <option>IBAN</option><option>IP Adresi</option><option>TC No</option><option>E-posta</option><option>Telefon</option>
                </select>
                <input className={styles.input} style={{ width: '100%' }} placeholder="Değer" />
                <input className={styles.input} style={{ width: '100%' }} placeholder="Sebep / Not" />
                <button className="btn btn-primary" style={{ width: '100%' }}>Kara Listeye Ekle</button>
              </div>
            </div>
          </div>
        </>
      )}

      {aktifTab === 'komisyon' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Komisyon Oranları Yönetimi</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>İşlem Türü</th><th>Mevcut Oran</th><th>Tavan</th><th>Düzenleme</th></tr>
            </thead>
            <tbody>
              {KOMISYON_AYARLARI.map((k, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{k.islem}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{k.oran}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{k.maks}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <input className={styles.input} style={{ width: 80 }} defaultValue={k.oran} />
                      <button className="btn btn-primary" style={{ fontSize: '0.72rem' }}>Güncelle</button>
                    </div>
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
