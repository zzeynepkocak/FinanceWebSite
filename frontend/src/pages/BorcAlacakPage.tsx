import { useState } from 'react'
import styles from './SharedPage.module.css'

type Kayit = {
  id: number; ad: string; tip: 'Alacak' | 'Borç'; tutar: number; odenen: number;
  tarih: string; vadeTarihi: string; kategori: string; notlar: string; gecikme: boolean;
}

const KAYITLAR: Kayit[] = [
  { id: 1, ad: 'Mehmet Kaya', tip: 'Alacak', tutar: 15000, odenen: 5000, tarih: '2026-03-15', vadeTarihi: '2026-06-15', kategori: 'Kişisel Borç', notlar: 'Araba tamiri için', gecikme: false },
  { id: 2, ad: 'Ayşe Demir', tip: 'Alacak', tutar: 8500, odenen: 8500, tarih: '2026-01-20', vadeTarihi: '2026-04-20', kategori: 'Kişisel Borç', notlar: 'Kira yardımı', gecikme: false },
  { id: 3, ad: 'ABC Tedarik Ltd.', tip: 'Alacak', tutar: 42000, odenen: 0, tarih: '2026-02-01', vadeTarihi: '2026-04-01', kategori: 'Ticari Alacak', notlar: 'Fatura no: FAT-2026-082', gecikme: true },
  { id: 4, ad: 'Garanti Bankası', tip: 'Borç', tutar: 120000, odenen: 48000, tarih: '2024-06-01', vadeTarihi: '2027-06-01', kategori: 'İhtiyaç Kredisi', notlar: 'Aylık taksit: ₺4.800', gecikme: false },
  { id: 5, ad: 'Hasan Öztürk', tip: 'Borç', tutar: 25000, odenen: 10000, tarih: '2026-01-10', vadeTarihi: '2026-07-10', kategori: 'Kişisel Borç', notlar: 'İş ortağına', gecikme: false },
  { id: 6, ad: 'XYZ İnşaat', tip: 'Borç', tutar: 85000, odenen: 85000, tarih: '2025-09-01', vadeTarihi: '2025-12-01', kategori: 'Ticari Borç', notlar: 'Tadilat ödemesi', gecikme: false },
]

const SENETLER = [
  { id: 1, tip: 'Senet', taraf: 'ABC Ticaret A.Ş.', tutar: 35000, vade: '2026-07-15', durum: 'Aktif' },
  { id: 2, tip: 'Çek', taraf: 'Mehmet Yıldız', tutar: 18500, vade: '2026-06-30', durum: 'Tahsil Edildi' },
  { id: 3, tip: 'Senet', taraf: 'Fatma Kılıç', tutar: 12000, vade: '2026-08-01', durum: 'Aktif' },
  { id: 4, tip: 'Çek', taraf: 'Güven İnşaat', tutar: 62000, vade: '2026-06-10', durum: 'Protesto' },
]

export function BorcAlacakPage() {
  const [aktifTab, setAktifTab] = useState('liste')
  const [filtre, setFiltre] = useState<'Hepsi' | 'Alacak' | 'Borç'>('Hepsi')
  const [odemeKayit, setOdemeKayit] = useState<number | null>(null)
  const [odemeMiktar, setOdemeMiktar] = useState('')

  const filtreliKayitlar = KAYITLAR.filter(k => filtre === 'Hepsi' || k.tip === filtre)
  const toplamAlacak = KAYITLAR.filter(k => k.tip === 'Alacak').reduce((s, k) => s + (k.tutar - k.odenen), 0)
  const toplamBorc = KAYITLAR.filter(k => k.tip === 'Borç').reduce((s, k) => s + (k.tutar - k.odenen), 0)
  const gecikmeliler = KAYITLAR.filter(k => k.gecikme)

  const gunKaldi = (tarih: string) => Math.ceil((new Date(tarih).getTime() - Date.now()) / 86400000)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Borç & Alacak Defteri</h1>
          <p className={styles.pageSub}>Kişisel ve ticari borç/alacak yönetimi</p>
        </div>
        <button className="btn btn-primary">+ Yeni Kayıt</button>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Alacak</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>₺{toplamAlacak.toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>{KAYITLAR.filter(k => k.tip === 'Alacak' && k.odenen < k.tutar).length} aktif</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Borç</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>₺{toplamBorc.toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.down}`}>{KAYITLAR.filter(k => k.tip === 'Borç' && k.odenen < k.tutar).length} aktif</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Net Pozisyon</span>
          <span className={styles.metricValue} style={{ color: toplamAlacak - toplamBorc >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
            {toplamAlacak - toplamBorc >= 0 ? '+' : ''}₺{(toplamAlacak - toplamBorc).toLocaleString('tr-TR')}
          </span>
          <span className={`${styles.metricChange} ${toplamAlacak >= toplamBorc ? styles.up : styles.down}`}>{toplamAlacak >= toplamBorc ? 'Alacak fazlası' : 'Borç fazlası'}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Gecikmiş Alacak</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>{gecikmeliler.length}</span>
          <span className={`${styles.metricChange} ${styles.down}`}>acil takip</span>
        </div>
      </div>

      {gecikmeliler.length > 0 && (
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: 'var(--radius)', fontSize: '0.82rem' }}>
          <strong style={{ color: 'var(--loss)' }}>⚠ Gecikmiş Alacaklar:</strong> {gecikmeliler.map(g => g.ad).join(', ')} — derhal hatırlatma gönderin!
        </div>
      )}

      <div className={styles.tabs}>
        {[
          { k: 'liste', l: 'Borç/Alacak Listesi' },
          { k: 'senet', l: 'Senet & Çek Takibi' },
          { k: 'odeme', l: 'Kısmi Ödeme Girişi' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'liste' && (
        <>
          <div className={styles.filterBar}>
            {(['Hepsi', 'Alacak', 'Borç'] as const).map(f => (
              <button key={f} className={`${styles.filterTag} ${filtre === f ? styles.filterTagActive : ''}`} onClick={() => setFiltre(f)}>{f}</button>
            ))}
          </div>
          <div className={styles.sectionCard}>
            <table className={styles.table}>
              <thead>
                <tr><th>Taraf</th><th>Tip</th><th>Tutar</th><th>Ödenen</th><th>Kalan</th><th>Vade</th><th>Durum</th><th></th></tr>
              </thead>
              <tbody>
                {filtreliKayitlar.map(k => {
                  const kalan = k.tutar - k.odenen
                  const yuzde = (k.odenen / k.tutar) * 100
                  const gunKal = gunKaldi(k.vadeTarihi)
                  return (
                    <tr key={k.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{k.ad}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{k.kategori}</div>
                      </td>
                      <td>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: k.tip === 'Alacak' ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)', color: k.tip === 'Alacak' ? 'var(--profit)' : 'var(--loss)', border: `1px solid ${k.tip === 'Alacak' ? 'rgba(0,212,170,0.3)' : 'rgba(255,71,87,0.3)'}` }}>
                          {k.tip}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{k.tutar.toLocaleString('tr-TR')}</td>
                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>₺{k.odenen.toLocaleString('tr-TR')}</div>
                        <div className={styles.progressBar} style={{ marginTop: 3, width: 70 }}>
                          <div className={styles.progressFill} style={{ width: `${yuzde}%`, background: yuzde === 100 ? 'var(--profit)' : 'var(--accent)' }}></div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: kalan > 0 ? (k.gecikme ? 'var(--loss)' : 'var(--text)') : 'var(--profit)', fontWeight: kalan > 0 ? 700 : 400 }}>
                        {kalan > 0 ? `₺${kalan.toLocaleString('tr-TR')}` : 'Tamamlandı'}
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>
                        <div>{k.vadeTarihi}</div>
                        <div style={{ color: gunKal < 0 ? 'var(--loss)' : gunKal <= 14 ? 'var(--warning)' : 'var(--text-dim)', fontWeight: gunKal <= 14 ? 600 : 400 }}>
                          {gunKal < 0 ? `${Math.abs(gunKal)} gün gecikmiş` : `${gunKal} gün kaldı`}
                        </div>
                      </td>
                      <td>
                        {k.gecikme && (
                          <span style={{ padding: '0.15rem 0.45rem', borderRadius: 100, fontSize: '0.65rem', background: 'rgba(255,71,87,0.1)', color: 'var(--loss)', border: '1px solid rgba(255,71,87,0.3)', fontWeight: 700 }}>Gecikmiş</span>
                        )}
                        {kalan === 0 && (
                          <span style={{ padding: '0.15rem 0.45rem', borderRadius: 100, fontSize: '0.65rem', background: 'rgba(0,212,170,0.1)', color: 'var(--profit)', border: '1px solid rgba(0,212,170,0.3)', fontWeight: 700 }}>Tamamlandı</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {kalan > 0 && k.tip === 'Alacak' && (
                            <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => { setOdemeKayit(k.id); setAktifTab('odeme') }}>Hatırlat</button>
                          )}
                          {kalan > 0 && (
                            <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => { setOdemeKayit(k.id); setAktifTab('odeme') }}>Ödeme</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {aktifTab === 'senet' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Senet & Çek Takip Defteri</span>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>+ Yeni Senet/Çek</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>Belge Türü</th><th>Taraf</th><th>Tutar</th><th>Vade</th><th>Durum</th><th></th></tr>
            </thead>
            <tbody>
              {SENETLER.map(s => (
                <tr key={s.id}>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, background: s.tip === 'Senet' ? 'rgba(0,102,255,0.1)' : 'rgba(153,69,255,0.1)', color: s.tip === 'Senet' ? '#0066ff' : '#9945ff', border: `1px solid ${s.tip === 'Senet' ? 'rgba(0,102,255,0.3)' : 'rgba(153,69,255,0.3)'}` }}>
                      {s.tip}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.taraf}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{s.tutar.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{s.vade}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: s.durum === 'Tahsil Edildi' ? 'rgba(0,212,170,0.1)' : s.durum === 'Protesto' ? 'rgba(255,71,87,0.1)' : 'rgba(240,180,41,0.1)', color: s.durum === 'Tahsil Edildi' ? 'var(--profit)' : s.durum === 'Protesto' ? 'var(--loss)' : 'var(--warning)', border: `1px solid ${s.durum === 'Tahsil Edildi' ? 'rgba(0,212,170,0.3)' : s.durum === 'Protesto' ? 'rgba(255,71,87,0.3)' : 'rgba(240,180,41,0.3)'}` }}>
                      {s.durum}
                    </span>
                  </td>
                  <td><button className="btn btn-secondary" style={{ fontSize: '0.72rem' }}>İncele</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'odeme' && (
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Kısmi Ödeme Girişi</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Kayıt Seçin</label>
                <select className={styles.select} style={{ width: '100%' }} value={odemeKayit || ''} onChange={e => setOdemeKayit(Number(e.target.value))}>
                  <option value="">Seçiniz...</option>
                  {KAYITLAR.filter(k => k.odenen < k.tutar).map(k => (
                    <option key={k.id} value={k.id}>{k.ad} — ₺{(k.tutar - k.odenen).toLocaleString('tr-TR')} kalan</option>
                  ))}
                </select>
              </div>
              {odemeKayit && (() => {
                const kayit = KAYITLAR.find(k => k.id === odemeKayit)!
                return (
                  <>
                    <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Toplam</span><span style={{ fontFamily: 'var(--font-mono)' }}>₺{kayit.tutar.toLocaleString('tr-TR')}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Ödenen</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)' }}>₺{kayit.odenen.toLocaleString('tr-TR')}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>Kalan Borç</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>₺{(kayit.tutar - kayit.odenen).toLocaleString('tr-TR')}</span></div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Ödeme Miktarı (₺)</label>
                      <input className={styles.input} style={{ width: '100%' }} type="number" placeholder={`Max: ₺${(kayit.tutar - kayit.odenen).toLocaleString('tr-TR')}`} value={odemeMiktar} onChange={e => setOdemeMiktar(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Ödeme Yöntemi</label>
                      <select className={styles.select} style={{ width: '100%' }}>
                        <option>Nakit</option><option>Banka Transferi</option><option>Çek</option>
                      </select>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Ödemeyi Kaydet</button>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
