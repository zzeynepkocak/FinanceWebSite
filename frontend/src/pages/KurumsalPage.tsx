import { useState } from 'react'
import styles from './SharedPage.module.css'

type Firma = { id: number; ad: string; vergiNo: string; tip: string; sehir: string; bakiye: number; renk: string }
const FIRMALAR: Firma[] = [
  { id: 1, ad: 'Toyota Türkiye A.Ş.', vergiNo: '1234567890', tip: 'Ana Şirket', sehir: 'İstanbul', bakiye: 12840000, renk: '#e30613' },
  { id: 2, ad: 'Toyota Leasing', vergiNo: '0987654321', tip: 'İştirak', sehir: 'İstanbul', bakiye: 4200000, renk: '#0066cc' },
  { id: 3, ad: 'Ankara Bayi A.Ş.', vergiNo: '5555666677', tip: 'Bayi', sehir: 'Ankara', bakiye: 820000, renk: '#00a651' },
  { id: 4, ad: 'İzmir Otomotiv Ltd.', vergiNo: '3334445556', tip: 'Bayi', sehir: 'İzmir', bakiye: 540000, renk: '#9945ff' },
]

const TEDARIKÇILER = [
  { ad: 'Bosch Otomotiv', bakiye: -285000, vadeSon: '2026-06-10', durum: 'Vadeli', kategori: 'Parça' },
  { ad: 'Bridgestone Lastik', bakiye: -142000, vadeSon: '2026-06-05', durum: 'Acil', kategori: 'Lastik' },
  { ad: 'Shell Yakıt', bakiye: -48000, vadeSon: '2026-06-20', durum: 'Normal', kategori: 'Yakıt' },
  { ad: 'Migros (Sosyal)', bakiye: 12500, vadeSon: '—', durum: 'Alacak', kategori: 'Diğer' },
  { ad: 'Oracle (Lisans)', bakiye: -95000, vadeSon: '2026-07-01', durum: 'Normal', kategori: 'Yazılım' },
]

const MAASLAR = [
  { departman: 'Satış', calisan: 45, brut: 580000, net: 472000 },
  { departman: 'Teknik Servis', calisan: 32, brut: 420000, net: 342000 },
  { departman: 'Muhasebe', calisan: 12, brut: 195000, net: 158000 },
  { departman: 'Yönetim', calisan: 8, brut: 320000, net: 260000 },
]

const ONAY_BEKLEYENLER = [
  { islem: 'Tedarikçi Ödemesi — Bosch', tutar: 285000, talep: 'Mehmet Demir (Muhasebe)', tarih: '2026-05-29', aciliyet: 'Yüksek' },
  { islem: 'Maaş Ödemeleri — Mayıs 2026', tutar: 1232000, talep: 'HR Sistemi', tarih: '2026-05-29', aciliyet: 'Yüksek' },
  { islem: 'Reklam Harcaması', tutar: 85000, talep: 'Ahmet Yılmaz (Pazarlama)', tarih: '2026-05-28', aciliyet: 'Normal' },
]

const ROLLER = [
  { kullanici: 'Ahmet Yılmaz', email: 'ahmet@toyota.tr', rol: 'Yönetici', yetki: ['Onay', 'Görüntüleme', 'Ödeme'], aktif: true },
  { kullanici: 'Fatma Kaya', email: 'fatma@toyota.tr', rol: 'Muhasebeci', yetki: ['Görüntüleme', 'Ödeme'], aktif: true },
  { kullanici: 'Mehmet Demir', email: 'mehmet@toyota.tr', rol: 'Muhasebeci', yetki: ['Görüntüleme'], aktif: true },
  { kullanici: 'Ayşe Şahin', email: 'ayse@toyota.tr', rol: 'Görüntüleyici', yetki: ['Görüntüleme'], aktif: false },
]

export function KurumsalPage() {
  const [seciliFirma, setSeciliFirma] = useState<number>(1)
  const [aktifTab, setAktifTab] = useState('genel')
  const [maasOdeme, setMaasOdeme] = useState(false)

  const firma = FIRMALAR.find(f => f.id === seciliFirma)!
  const toplamMaas = MAASLAR.reduce((s, m) => s + m.net, 0)

  const gunKaldi = (tarih: string) => {
    if (tarih === '—') return null
    return Math.ceil((new Date(tarih).getTime() - Date.now()) / 86400000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kurumsal Finans</h1>
          <p className={styles.pageSub}>Çok şirketli yapı, tedarikçi ve maaş yönetimi</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select className={styles.select} value={seciliFirma} onChange={e => setSeciliFirma(Number(e.target.value))}>
            {FIRMALAR.map(f => <option key={f.id} value={f.id}>{f.ad}</option>)}
          </select>
          <button className="btn btn-primary">+ Yeni Firma</button>
        </div>
      </div>

      {/* Firma özet banner */}
      <div style={{ padding: '0.85rem 1rem', background: `${firma.renk}11`, border: `1px solid ${firma.renk}33`, borderRadius: 'var(--radius)', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${firma.renk}22`, border: `1px solid ${firma.renk}44`, display: 'grid', placeItems: 'center', fontWeight: 800, color: firma.renk, fontSize: '0.8rem', flexShrink: 0 }}>{firma.ad[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{firma.ad}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>VKN: {firma.vergiNo} | {firma.tip} | {firma.sehir}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Hesap Bakiyesi</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>₺{firma.bakiye.toLocaleString('tr-TR')}</div>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Çalışan</span>
          <span className={styles.metricValue}>{MAASLAR.reduce((s, m) => s + m.calisan, 0)}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>kişi</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aylık Maaş Net</span>
          <span className={styles.metricValue}>₺{(toplamMaas / 1000).toFixed(0)}K</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>Mayıs 2026</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Tedarikçi Borcu</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>₺{Math.abs(TEDARIKÇILER.filter(t => t.bakiye < 0).reduce((s, t) => s + t.bakiye, 0)).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
          <span className={`${styles.metricChange} ${styles.down}`}>vadeli</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Onay Bekleyen</span>
          <span className={styles.metricValue} style={{ color: 'var(--warning)' }}>{ONAY_BEKLEYENLER.length}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>işlem</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'genel', l: 'Genel Bakış' },
          { k: 'maas', l: 'Maaş Ödemeleri' },
          { k: 'tedarik', l: 'Tedarikçi/Cari' },
          { k: 'onay', l: 'Onay Akışı' },
          { k: 'roller', l: 'Rol Yönetimi' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'genel' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Firma Portföyü</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {FIRMALAR.map(f => (
                <div key={f.id} onClick={() => setSeciliFirma(f.id)} style={{ padding: '0.65rem 0.85rem', background: seciliFirma === f.id ? 'var(--accent-dim)' : 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: `1px solid ${seciliFirma === f.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.renk }}></div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{f.ad}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{f.tip} · {f.sehir}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.84rem' }}>₺{(f.bakiye / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Nakit Akışı Risk Matrisi</span></div>
            <div className={styles.cardBody}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    {['', 'Düşük Etki', 'Orta Etki', 'Yüksek Etki'].map((h, i) => (
                      <td key={i} style={{ padding: '0.45rem 0.5rem', fontWeight: 600, color: 'var(--text-dim)', fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{h}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { oy: 'Düşük Olasılık', hücreler: ['Ofis malzemeleri', 'IT bakım', ''] },
                    { oy: 'Orta Olasılık', hücreler: ['Personel', 'Tedarikçi gecikmesi', ''] },
                    { oy: 'Yüksek Olasılık', hücreler: ['Vadeli ödeme', 'Döviz dalgalanması', 'Maaş ödemesi'] },
                  ].map((satir, i) => (
                    <tr key={i}>
                      <td style={{ padding: '0.55rem 0.5rem', color: 'var(--text-dim)', fontSize: '0.72rem', borderRight: '1px solid var(--border)' }}>{satir.oy}</td>
                      {satir.hücreler.map((h, j) => (
                        <td key={j} style={{ padding: '0.55rem 0.5rem', background: h ? (j === 2 && i === 2 ? 'rgba(255,71,87,0.1)' : j === 1 && i === 1 ? 'rgba(240,180,41,0.1)' : 'rgba(0,212,170,0.05)') : 'transparent', color: h ? (j === 2 && i === 2 ? 'var(--loss)' : j === 1 && i === 1 ? 'var(--warning)' : 'var(--text)') : 'var(--text-dim)', borderRadius: h ? 4 : 0, fontWeight: h ? 500 : 400, textAlign: 'center' }}>
                          {h || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'maas' && (
        <>
          {!maasOdeme ? (
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Toplu Maaş Ödemesi — Mayıs 2026</span>
                <button className="btn btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => setMaasOdeme(true)}>Toplu Öde</button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr><th>Departman</th><th>Çalışan</th><th>Brüt Maaş</th><th>SGK/Vergi</th><th>Net Maaş</th></tr>
                </thead>
                <tbody>
                  {MAASLAR.map((m, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{m.departman}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{m.calisan} kişi</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>₺{m.brut.toLocaleString('tr-TR')}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>-₺{(m.brut - m.net).toLocaleString('tr-TR')}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>₺{m.net.toLocaleString('tr-TR')}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 700, background: 'var(--bg-card)' }}>
                    <td>TOPLAM</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{MAASLAR.reduce((s, m) => s + m.calisan, 0)} kişi</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₺{MAASLAR.reduce((s, m) => s + m.brut, 0).toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>-₺{MAASLAR.reduce((s, m) => s + (m.brut - m.net), 0).toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontSize: '1rem' }}>₺{toplamMaas.toLocaleString('tr-TR')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ maxWidth: 460, margin: '0 auto' }}>
              <div className={styles.sectionCard}>
                <div className={styles.cardHeader}><span className={styles.cardTitle}>Toplu Maaş Ödeme Onayı</span></div>
                <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Toplam Net Ödeme</div>
                    <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>₺{toplamMaas.toLocaleString('tr-TR')}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{MAASLAR.reduce((s, m) => s + m.calisan, 0)} çalışan</div>
                  </div>
                  <div className={styles.settingRow}>
                    <div className={styles.settingInfo}>
                      <div className={styles.settingLabel}>Ödeme Tarihi</div>
                      <div className={styles.settingDesc}>30 Mayıs 2026</div>
                    </div>
                  </div>
                  <div className={styles.settingRow}>
                    <div className={styles.settingInfo}>
                      <div className={styles.settingLabel}>Kaynak Hesap</div>
                      <div className={styles.settingDesc}>{firma.ad} — Garanti BBVA Vadesiz</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setMaasOdeme(false)}>İptal</button>
                    <button className="btn btn-primary" style={{ flex: 1 }}>Onayla ve Öde</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {aktifTab === 'tedarik' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Tedarikçi / Cari Hesap Tablosu</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>Tedarikçi</th><th>Kategori</th><th>Bakiye</th><th>Vade Son</th><th>Durum</th><th></th></tr>
            </thead>
            <tbody>
              {TEDARIKÇILER.map((t, i) => {
                const gun = gunKaldi(t.vadeSon)
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{t.ad}</td>
                    <td style={{ fontSize: '0.78rem' }}>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.72rem' }}>{t.kategori}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: t.bakiye < 0 ? 'var(--loss)' : 'var(--profit)' }}>
                      {t.bakiye < 0 ? '-' : '+'}₺{Math.abs(t.bakiye).toLocaleString('tr-TR')}
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {gun !== null && (
                        <span style={{ color: gun <= 5 ? 'var(--loss)' : gun <= 14 ? 'var(--warning)' : 'var(--text)' }}>
                          {t.vadeSon} ({gun} gün)
                        </span>
                      )}
                      {gun === null && '—'}
                    </td>
                    <td>
                      <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: t.durum === 'Acil' ? 'rgba(255,71,87,0.1)' : t.durum === 'Vadeli' ? 'rgba(240,180,41,0.1)' : t.durum === 'Alacak' ? 'rgba(0,212,170,0.1)' : 'rgba(100,100,100,0.1)', color: t.durum === 'Acil' ? 'var(--loss)' : t.durum === 'Vadeli' ? 'var(--warning)' : t.durum === 'Alacak' ? 'var(--profit)' : 'var(--text-dim)', border: '1px solid currentColor', opacity: 1 }}>
                        {t.durum}
                      </span>
                    </td>
                    <td>
                      {t.bakiye < 0 && (
                        <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}>Öde</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'onay' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Ödeme Onay Akışı</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ONAY_BEKLEYENLER.map((o, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: `1px solid ${o.aciliyet === 'Yüksek' ? 'rgba(255,71,87,0.25)' : 'var(--border)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{o.islem}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>Talep eden: {o.talep} · {o.tarih}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>₺{o.tutar.toLocaleString('tr-TR')}</div>
                    <span style={{ padding: '0.15rem 0.45rem', borderRadius: 100, fontSize: '0.65rem', background: o.aciliyet === 'Yüksek' ? 'rgba(255,71,87,0.1)' : 'rgba(240,180,41,0.1)', color: o.aciliyet === 'Yüksek' ? 'var(--loss)' : 'var(--warning)', border: `1px solid ${o.aciliyet === 'Yüksek' ? 'rgba(255,71,87,0.3)' : 'rgba(240,180,41,0.3)'}`, fontWeight: 700 }}>{o.aciliyet}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.78rem' }}>Onayla</button>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem' }}>Reddet</button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.78rem' }}>Detay</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aktifTab === 'roller' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Kullanıcı Rol Yönetimi</span>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>+ Kullanıcı Ekle</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>Kullanıcı</th><th>Rol</th><th>Yetkiler</th><th>Durum</th><th>Aksiyon</th></tr>
            </thead>
            <tbody>
              {ROLLER.map((r, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.kullanici}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{r.email}</div>
                  </td>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: r.rol === 'Yönetici' ? 'rgba(0,102,255,0.1)' : r.rol === 'Muhasebeci' ? 'rgba(0,212,170,0.1)' : 'rgba(100,100,100,0.1)', color: r.rol === 'Yönetici' ? '#0066ff' : r.rol === 'Muhasebeci' ? 'var(--profit)' : 'var(--text-dim)', border: '1px solid currentColor' }}>
                      {r.rol}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {r.yetki.map(y => (
                        <span key={y} style={{ padding: '0.15rem 0.45rem', borderRadius: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.7rem' }}>{y}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.aktif ? 'var(--profit)' : 'var(--border)' }}></div>
                      <span style={{ fontSize: '0.78rem', color: r.aktif ? 'var(--profit)' : 'var(--text-dim)' }}>{r.aktif ? 'Aktif' : 'Pasif'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Düzenle</button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: 'var(--loss)' }}>Kaldır</button>
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
