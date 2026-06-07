import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const CASH_POOLS = [
  { sirket: 'Toyota Türkiye A.Ş.', bakiye: 12840000, doviz: 'TRY', renk: '#e30613' },
  { sirket: 'Toyota Leasing', bakiye: 4200000, doviz: 'TRY', renk: '#0066cc' },
  { sirket: 'Toyota Sigorta', bakiye: 2800000, doviz: 'TRY', renk: '#00a651' },
  { sirket: 'Toyota Finans', bakiye: 8100000, doviz: 'TRY', renk: '#f0b429' },
]

const REPO_IŞLEMLERI = [
  { id: 'REPO-2026-081', banka: 'Garanti BBVA', tutar: 10000000, oran: '%55.8', baslangic: '2026-05-28', bitis: '2026-05-29', faizGeliri: 15286, durum: 'Aktif' },
  { id: 'REPO-2026-079', banka: 'Akbank', tutar: 5000000, oran: '%55.2', baslangic: '2026-05-27', bitis: '2026-05-28', faizGeliri: 7562, durum: 'Kapandı' },
  { id: 'REPO-2026-082', banka: 'Ziraat', tutar: 8000000, oran: '%56.1', baslangic: '2026-05-29', bitis: '2026-05-30', faizGeliri: 12299, durum: 'Aktif' },
]

const KUR_MARUZIYET = [
  { doviz: 'USD', uzun: 1200000, kisa: 800000, net: 400000, kur: 38.42, tlCinsinden: 15368000 },
  { doviz: 'EUR', uzun: 600000, kisa: 900000, net: -300000, kur: 41.85, tlCinsinden: -12555000 },
  { doviz: 'GBP', uzun: 150000, kisa: 50000, net: 100000, kur: 48.72, tlCinsinden: 4872000 },
  { doviz: 'JPY', uzun: 5000000, kisa: 2000000, net: 3000000, kur: 0.258, tlCinsinden: 774000 },
]

const SIRKET_ARASI_TRANSFERLER = [
  { gonderen: 'Toyota Türkiye', alici: 'Toyota Leasing', tutar: 2500000, aciklama: 'Fon aktarımı', durum: 'Onay Bekliyor', tarih: '2026-05-29' },
  { gonderen: 'Toyota Finans', alici: 'Toyota Sigorta', tutar: 800000, aciklama: 'Sermaye tamamlama', durum: 'Onaylandı', tarih: '2026-05-28' },
]

export function HazinePage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('pool')
  const [forwardForm, setForwardForm] = useState({ doviz: 'USD', miktar: '', vade: '', kur: '' })

  const toplamPool = CASH_POOLS.reduce((s, c) => s + c.bakiye, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kurumsal Hazine Yönetimi</h1>
          <p className={styles.pageSub}>Nakit havuzu, repo ve döviz maruziyet yönetimi</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Hazine işlemi oluşturuldu', 'success')}>+ Yeni İşlem</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Nakit Havuzu</span>
          <span className={styles.metricValue}>₺{(toplamPool / 1000000).toFixed(1)}M</span>
          <span className={`${styles.metricChange} ${styles.up}`}>{CASH_POOLS.length} şirket</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aktif Repo</span>
          <span className={styles.metricValue}>₺18M</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Gecelik %55.8-56.1</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Net Döviz Pozisyonu</span>
          <span className={styles.metricValue}>${(400000).toLocaleString()}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>USD Long</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bugün Repo Getirisi</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>₺{(15286 + 12299).toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>2 aktif repo</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'pool', l: 'Nakit Havuzu' },
          { k: 'repo', l: 'Repo İşlemleri' },
          { k: 'kur', l: 'Kur Maruziyeti' },
          { k: 'forward', l: 'Forward Sözleşme' },
          { k: 'transfer', l: 'Şirket İçi Transferler' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'pool' && (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Nakit Havuzu Konsolidasyonu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {CASH_POOLS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: `1px solid ${c.renk}33` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.renk, flexShrink: 0 }}></div>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: '0.84rem' }}>{c.sirket}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{c.bakiye.toLocaleString('tr-TR')}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>%{((c.bakiye / toplamPool) * 100).toFixed(1)}</span>
                  <div style={{ width: 100 }}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${(c.bakiye / toplamPool) * 100}%`, background: c.renk }}></div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '0.85rem 1rem', background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,212,170,0.3)', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Konsolide Toplam</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '1.05rem' }}>₺{toplamPool.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {aktifTab === 'repo' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Gecelik Repo İşlemleri</span>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>+ Yeni Repo</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>İşlem ID</th><th>Banka</th><th>Tutar</th><th>Oran</th><th>Başlangıç</th><th>Bitiş</th><th>Faiz Getirisi</th><th>Durum</th></tr>
            </thead>
            <tbody>
              {REPO_IŞLEMLERI.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{r.id}</td>
                  <td style={{ fontWeight: 600 }}>{r.banka}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{r.tutar.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 600 }}>{r.oran}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.baslangic}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.bitis}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 700 }}>+₺{r.faizGeliri.toLocaleString('tr-TR')}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: r.durum === 'Aktif' ? 'rgba(0,212,170,0.1)' : 'rgba(100,100,100,0.1)', color: r.durum === 'Aktif' ? 'var(--profit)' : 'var(--text-dim)', border: `1px solid ${r.durum === 'Aktif' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
                      {r.durum}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'kur' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Döviz Maruziyet Tablosu</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>Döviz</th><th>Uzun Pozisyon</th><th>Kısa Pozisyon</th><th>Net Pozisyon</th><th>Kur (TL)</th><th>TL Karşılığı</th></tr>
            </thead>
            <tbody>
              {KUR_MARUZIYET.map((k, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{k.doviz}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)' }}>{k.uzun.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>{k.kisa.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: k.net >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                    {k.net >= 0 ? '+' : ''}{k.net.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₺{k.kur}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: k.tlCinsinden >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                    {k.tlCinsinden >= 0 ? '+' : ''}₺{Math.abs(k.tlCinsinden).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'forward' && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Forward Sözleşme Giriş Formu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Döviz Çifti</label>
                <select className={styles.select} style={{ width: '100%' }} value={forwardForm.doviz} onChange={e => setForwardForm(f => ({ ...f, doviz: e.target.value }))}>
                  <option>USD/TRY</option><option>EUR/TRY</option><option>GBP/TRY</option><option>CHF/TRY</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Nominal Tutarı ({forwardForm.doviz.split('/')[0]})</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" placeholder="Döviz miktarı" value={forwardForm.miktar} onChange={e => setForwardForm(f => ({ ...f, miktar: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Vade Tarihi</label>
                <input className={styles.input} style={{ width: '100%' }} type="date" value={forwardForm.vade} onChange={e => setForwardForm(f => ({ ...f, vade: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Hedef Kur</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" step="0.01" placeholder="₺ kur" value={forwardForm.kur} onChange={e => setForwardForm(f => ({ ...f, kur: e.target.value }))} />
              </div>
              {forwardForm.miktar && forwardForm.kur && (
                <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Nominal</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{parseFloat(forwardForm.miktar).toLocaleString()} {forwardForm.doviz.split('/')[0]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>TL Karşılığı (Vade)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>₺{(parseFloat(forwardForm.miktar) * parseFloat(forwardForm.kur)).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              )}
              <button className="btn btn-primary" style={{ width: '100%' }}>Forward Sözleşme Oluştur</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'transfer' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Şirketler Arası Transfer Onayları</span>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>+ Yeni Transfer</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>Gönderen</th><th>Alıcı</th><th>Tutar</th><th>Açıklama</th><th>Tarih</th><th>Durum</th><th>Aksiyon</th></tr>
            </thead>
            <tbody>
              {SIRKET_ARASI_TRANSFERLER.map((t, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{t.gonderen}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{t.alici}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{t.tutar.toLocaleString('tr-TR')}</td>
                  <td style={{ fontSize: '0.78rem' }}>{t.aciklama}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{t.tarih}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: t.durum === 'Onaylandı' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: t.durum === 'Onaylandı' ? 'var(--profit)' : 'var(--warning)', border: `1px solid ${t.durum === 'Onaylandı' ? 'rgba(0,212,170,0.3)' : 'rgba(240,180,41,0.3)'}` }}>
                      {t.durum}
                    </span>
                  </td>
                  <td>
                    {t.durum === 'Onay Bekliyor' && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Onayla</button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: 'var(--loss)' }}>Reddet</button>
                      </div>
                    )}
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
