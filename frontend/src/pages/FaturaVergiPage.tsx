import { useState } from 'react'
import styles from './SharedPage.module.css'

const FATURALAR = [
  { id: 1, ad: 'Elektrik (TEDAŞ)', tutar: 842, vadeTarihi: '2026-06-05', kategori: 'Elektrik', otomatik: true, durum: 'Bekliyor' },
  { id: 2, ad: 'Doğalgaz (İGDAŞ)', tutar: 1240, vadeTarihi: '2026-06-08', kategori: 'Doğalgaz', otomatik: true, durum: 'Bekliyor' },
  { id: 3, ad: 'İnternet (Türk Telekom)', tutar: 389, vadeTarihi: '2026-06-12', kategori: 'İletişim', otomatik: false, durum: 'Bekliyor' },
  { id: 4, ad: 'Kira (Mülk Sahibi)', tutar: 18500, vadeTarihi: '2026-06-01', kategori: 'Kira', otomatik: false, durum: 'Ödendi' },
  { id: 5, ad: 'Su (İSKİ)', tutar: 234, vadeTarihi: '2026-06-20', kategori: 'Su', otomatik: true, durum: 'Bekliyor' },
  { id: 6, ad: 'Sigorta Primi (Axa)', tutar: 2100, vadeTarihi: '2026-06-15', kategori: 'Sigorta', otomatik: false, durum: 'Bekliyor' },
]

const VERGI_DÖNEMLERI = [
  { donem: 'Ocak-Mart 2026', tip: 'KDV Beyannamesi', tutar: 48420, son: '2026-04-24', durum: 'Ödendi' },
  { donem: 'Nisan 2026', tip: 'Muhtasar Beyanname', tutar: 12800, son: '2026-05-26', durum: 'Ödendi' },
  { donem: 'Mayıs 2026', tip: 'Muhtasar Beyanname', tutar: 13200, son: '2026-06-26', durum: 'Bekliyor' },
  { donem: '2025 Yıllık', tip: 'Gelir Vergisi Beyannamesi', tutar: 84600, son: '2026-03-31', durum: 'Ödendi' },
]

export function FaturaVergiPage() {
  const [aktifTab, setAktifTab] = useState('faturalar')
  const [kdvMatrah, setKdvMatrah] = useState('')
  const [kdvOran, setKdvOran] = useState('20')
  const [otoPay, setOtoPay] = useState<Record<number, boolean>>({ 1: true, 2: true, 5: true })
  const [yuklendi, setYuklendi] = useState(false)
  const [einvoiceForm, setEinvoiceForm] = useState({ vkn: '', tutar: '', aciklama: '' })

  const bekleyenFaturalar = FATURALAR.filter(f => f.durum === 'Bekliyor')
  const toplamBekleyen = bekleyenFaturalar.reduce((s, f) => s + f.tutar, 0)

  const kdvHesapla = () => {
    const mat = parseFloat(kdvMatrah)
    if (!mat) return { kdv: 0, toplam: 0 }
    const oran = parseFloat(kdvOran) / 100
    return { kdv: mat * oran, toplam: mat * (1 + oran) }
  }
  const { kdv, toplam } = kdvHesapla()

  const gunKaldi = (tarih: string) => {
    const fark = new Date(tarih).getTime() - Date.now()
    return Math.ceil(fark / 86400000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Fatura & Vergi Yönetimi</h1>
          <p className={styles.pageSub}>Bekleyen ödemeler ve vergi beyannameleri</p>
        </div>
        <button className="btn btn-primary">+ E-Fatura Oluştur</button>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bekleyen Faturalar</span>
          <span className={styles.metricValue}>₺{toplamBekleyen.toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.down}`}>{bekleyenFaturalar.length} fatura</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bu Ay Ödenen</span>
          <span className={styles.metricValue}>₺18.500</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>1 fatura</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>KDV İadesi Tahmini</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>₺4.280</span>
          <span className={`${styles.metricChange} ${styles.up}`}>2026 Q1</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Oto-Ödeme Aktif</span>
          <span className={styles.metricValue}>3</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>fatura</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'faturalar', l: 'Faturalar' },
          { k: 'vergi', l: 'Vergi Dönemleri' },
          { k: 'kdv', l: 'KDV Hesaplayıcı' },
          { k: 'einvoice', l: 'E-Fatura Giriş' },
          { k: 'ocr', l: 'Fiş Yükleme (OCR)' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'faturalar' && (
        <>
          {bekleyenFaturalar.some(f => gunKaldi(f.vadeTarihi) <= 3) && (
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: 'var(--radius)', fontSize: '0.82rem', color: 'var(--loss)' }}>
              ⚠ Yaklaşan son ödeme tarihleri! Bazı faturalar 3 gün içinde ödenmeli.
            </div>
          )}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Ödeme Takvimi</span>
              <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Hepsini Öde</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fatura</th>
                  <th>Kategori</th>
                  <th>Tutar</th>
                  <th>Son Ödeme</th>
                  <th>Kalan Gün</th>
                  <th>Oto-Ödeme</th>
                  <th>Durum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {FATURALAR.map(f => {
                  const kalan = gunKaldi(f.vadeTarihi)
                  return (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600 }}>{f.ad}</td>
                      <td>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.72rem' }}>{f.kategori}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{f.tutar.toLocaleString('tr-TR')}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{f.vadeTarihi}</td>
                      <td>
                        <span style={{ color: kalan <= 3 ? 'var(--loss)' : kalan <= 7 ? 'var(--warning)' : 'var(--text-dim)', fontWeight: kalan <= 3 ? 700 : 400, fontSize: '0.82rem' }}>
                          {f.durum === 'Ödendi' ? '—' : `${kalan} gün`}
                        </span>
                      </td>
                      <td>
                        <label className={styles.switch}>
                          <input type="checkbox" checked={!!otoPay[f.id]} onChange={e => setOtoPay(p => ({ ...p, [f.id]: e.target.checked }))} />
                          <span className={styles.slider}></span>
                        </label>
                      </td>
                      <td>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: f.durum === 'Ödendi' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: f.durum === 'Ödendi' ? 'var(--profit)' : 'var(--warning)', border: `1px solid ${f.durum === 'Ödendi' ? 'rgba(0,212,170,0.3)' : 'rgba(240,180,41,0.3)'}` }}>
                          {f.durum}
                        </span>
                      </td>
                      <td>
                        {f.durum === 'Bekliyor' && (
                          <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}>Öde</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {aktifTab === 'vergi' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Vergi Beyanname Takvimleri</span>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Takvim Ekle</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr><th>Dönem</th><th>Beyanname Türü</th><th>Tutar</th><th>Son Tarih</th><th>Durum</th><th></th></tr>
            </thead>
            <tbody>
              {VERGI_DÖNEMLERI.map((v, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{v.donem}</td>
                  <td style={{ fontSize: '0.8rem' }}>{v.tip}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{v.tutar.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{v.son}</td>
                  <td>
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: v.durum === 'Ödendi' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: v.durum === 'Ödendi' ? 'var(--profit)' : 'var(--warning)', border: `1px solid ${v.durum === 'Ödendi' ? 'rgba(0,212,170,0.3)' : 'rgba(240,180,41,0.3)'}` }}>
                      {v.durum}
                    </span>
                  </td>
                  <td>
                    {v.durum === 'Bekliyor' && (
                      <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}>Beyan Et</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.cardBody} style={{ borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.25)', borderRadius: 'var(--radius)', fontSize: '0.82rem' }}>
              <strong style={{ color: 'var(--accent)' }}>KDV İadesi Tahmini:</strong> 2026 Q1 için yaklaşık <strong>₺4.280</strong> KDV iadesi beklenmektedir. İade başvurusu için gerekli belgeler hazırlanıyor.
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'kdv' && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>KDV Hesaplayıcı</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>Matrah (KDV Hariç Tutar)</label>
                <input className={styles.input} style={{ width: '100%' }} placeholder="₺ Tutar giriniz" value={kdvMatrah} onChange={e => setKdvMatrah(e.target.value)} type="number" />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.35rem' }}>KDV Oranı</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['1', '8', '10', '20'].map(o => (
                    <button key={o} onClick={() => setKdvOran(o)} style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${kdvOran === o ? 'var(--accent)' : 'var(--border)'}`, background: kdvOran === o ? 'var(--accent-dim)' : 'var(--bg-card)', color: kdvOran === o ? 'var(--accent)' : 'var(--text)', cursor: 'pointer', fontWeight: kdvOran === o ? 700 : 400, fontSize: '0.82rem' }}>
                      %{o}
                    </button>
                  ))}
                </div>
              </div>
              {kdvMatrah && (
                <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Matrah</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₺{parseFloat(kdvMatrah).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>KDV (%{kdvOran})</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--warning)' }}>₺{kdv.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700 }}>Toplam Tutar</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>₺{toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'einvoice' && (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>E-Fatura / E-Arşiv Giriş</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Vergi Kimlik No / TC Kimlik No</label>
                <input className={styles.input} style={{ width: '100%' }} placeholder="VKN veya TCKN" value={einvoiceForm.vkn} onChange={e => setEinvoiceForm(f => ({ ...f, vkn: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Fatura Türü</label>
                <select className={styles.select} style={{ width: '100%' }}>
                  <option>E-Fatura</option>
                  <option>E-Arşiv Fatura</option>
                  <option>E-İrsaliye</option>
                  <option>E-Müstahsil</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Tutar (KDV Dahil)</label>
                <input className={styles.input} style={{ width: '100%' }} placeholder="₺" type="number" value={einvoiceForm.tutar} onChange={e => setEinvoiceForm(f => ({ ...f, tutar: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Açıklama</label>
                <input className={styles.input} style={{ width: '100%' }} placeholder="Mal/Hizmet tanımı" value={einvoiceForm.aciklama} onChange={e => setEinvoiceForm(f => ({ ...f, aciklama: e.target.value }))} />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>E-Fatura Gönder</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'ocr' && (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Fiş / Fatura Yükleme (OCR)</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                onClick={() => setYuklendi(true)}
                style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', background: yuklendi ? 'rgba(0,212,170,0.04)' : 'var(--bg-card)', borderColor: yuklendi ? 'var(--accent)' : 'var(--border)', transition: 'all 0.2s' }}
              >
                {yuklendi ? (
                  <>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                    <div style={{ color: 'var(--profit)', fontWeight: 600 }}>Fiş yüklendi</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>fis_2026_05.jpg</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Dosya Sürükle veya Tıkla</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>JPG, PNG, PDF desteklenir. Maks 10MB.</div>
                  </>
                )}
              </div>
              {yuklendi && (
                <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>OCR Sonucu</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Tarih</span><span style={{ fontFamily: 'var(--font-mono)' }}>29.05.2026</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Satıcı</span><span>Migros Ticaret A.Ş.</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Toplam</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>₺347,60</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>KDV</span><span style={{ fontFamily: 'var(--font-mono)' }}>₺55,62</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Gidere Ekle</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
