import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const ALTIN_FIYATLARI = {
  gram: { alis: 3842, satis: 3896, gunlukDegisim: +2.4 },
  ceyrek: { alis: 38420, satis: 38960, gunlukDegisim: +2.4 },
  yarim: { alis: 76840, satis: 77920, gunlukDegisim: +2.4 },
  cumhuriyet: { alis: 246800, satis: 249600, gunlukDegisim: +2.4 },
  bilezik22: { alis: 3640, satis: 3710, gunlukDegisim: +2.1 },
}

const RAFINERILER = [
  { ad: 'IAR (İstanbul Altın Rafinerisi)', sertifika: 'LBMA', minSiparis: '1 gram', teslimat: '2-3 iş günü' },
  { ad: 'Nadir Metal Rafinerisi', sertifika: 'LBMA', minSiparis: '5 gram', teslimat: '3-5 iş günü' },
  { ad: 'Metkon Rafineri', sertifika: 'TSE', minSiparis: '1 gram', teslimat: '1-2 iş günü' },
  { ad: 'AGR Rafinerisi', sertifika: 'LBMA', minSiparis: '10 gram', teslimat: '5-7 iş günü' },
]

const ALTIN_PORTFÖY = [
  { tur: 'Fiziksel Altın', miktar: 50, birim: 'gram', alisFiyati: 3210, anlikFiyat: 3842, renk: '#e5a800' },
  { tur: 'Kağıt Altın', miktar: 30, birim: 'gram', alisFiyati: 3050, anlikFiyat: 3842, renk: '#f0b429' },
  { tur: 'Altın ETF', miktar: 100, birim: 'gram', alisFiyati: 2890, anlikFiyat: 3842, renk: '#ffd700' },
  { tur: 'Çeyrek Altın', miktar: 5, birim: 'adet', alisFiyati: 32000, anlikFiyat: 38420, renk: '#d4a400' },
]

export function AltinPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('fiyatlar')
  const [altinTip, setAltinTip] = useState<'fiziksel' | 'kagit'>('fiziksel')
  const [secilenRafineri, setSecilenRafineri] = useState(RAFINERILER[0].ad)
  const [siparisMiktar, setSiparisMiktar] = useState('')
  const [teslimatAdresi, setTeslimatAdresi] = useState('')
  const [secilenAltin, setSecilenAltin] = useState<keyof typeof ALTIN_FIYATLARI>('gram')

  const seciliFiyat = ALTIN_FIYATLARI[secilenAltin]
  const spread = seciliFiyat.satis - seciliFiyat.alis
  const spreadYuzde = ((spread / seciliFiyat.alis) * 100).toFixed(2)

  const toplamPortfoyDeger = ALTIN_PORTFÖY.reduce((s, a) => {
    const birimFiyat = a.birim === 'adet' ? a.anlikFiyat : a.anlikFiyat
    return s + a.miktar * birimFiyat
  }, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Altın & Değerli Madenler</h1>
          <p className={styles.pageSub}>Fiziksel ve kağıt altın, canlı fiyatlar</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary">Satış Emri</button>
          <button className="btn btn-primary" onClick={() => show('Alış emri iletildi ve işleme alındı', 'success')}>Alış Emri</button>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Gram Altın (Alış)</span>
          <span className={styles.metricValue}>₺{ALTIN_FIYATLARI.gram.alis.toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%{ALTIN_FIYATLARI.gram.gunlukDegisim} bugün</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Çeyrek Altın</span>
          <span className={styles.metricValue}>₺{(ALTIN_FIYATLARI.ceyrek.alis / 1000).toFixed(1)}K</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%{ALTIN_FIYATLARI.ceyrek.gunlukDegisim}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Portföy Değeri</span>
          <span className={styles.metricValue}>₺{(toplamPortfoyDeger / 1000).toFixed(0)}K</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%18.4 maliyet üzeri</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>ONS/USD</span>
          <span className={styles.metricValue}>$2.384</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%1.2</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'fiyatlar', l: 'Canlı Fiyatlar' },
          { k: 'portfoy', l: 'Altın Portföyüm' },
          { k: 'satin-al', l: 'Alış/Satış' },
          { k: 'teslimat', l: 'Fiziksel Teslimat' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'fiyatlar' && (
        <>
          {/* Fiziksel / Kağıt toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Görünüm:</span>
            <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.2rem', gap: '0.15rem' }}>
              {(['fiziksel', 'kagit'] as const).map(t => (
                <button key={t} onClick={() => setAltinTip(t)} style={{ padding: '0.35rem 0.85rem', borderRadius: 'calc(var(--radius) - 3px)', border: `1px solid ${altinTip === t ? 'var(--border)' : 'transparent'}`, background: altinTip === t ? 'var(--bg-surface)' : 'transparent', color: altinTip === t ? 'var(--text)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}>
                  {{ fiziksel: '🥇 Fiziksel', kagit: '📊 Kağıt' }[t]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Altın Alış/Satış Fiyatları</span><span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Güncelleme: 14:28</span></div>
            <table className={styles.table}>
              <thead>
                <tr><th>Tür</th><th>Alış Fiyatı</th><th>Satış Fiyatı</th><th>Spread</th><th>24s Değişim</th><th></th></tr>
              </thead>
              <tbody>
                {(Object.entries(ALTIN_FIYATLARI) as [keyof typeof ALTIN_FIYATLARI, typeof ALTIN_FIYATLARI.gram][]).map(([key, f]) => (
                  <tr key={key} style={{ background: secilenAltin === key ? 'var(--accent-dim)' : 'transparent' }} onClick={() => setSecilenAltin(key)}>
                    <td style={{ fontWeight: 600 }}>{{ gram: 'Gram Altın', ceyrek: 'Çeyrek Altın', yarim: 'Yarım Altın', cumhuriyet: 'Cumhuriyet Altını', bilezik22: '22 Ayar Bilezik' }[key]}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>₺{f.alis.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--loss)' }}>₺{f.satis.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>₺{(f.satis - f.alis).toLocaleString('tr-TR')} (%{((f.satis - f.alis) / f.alis * 100).toFixed(2)})</td>
                    <td><span style={{ color: 'var(--profit)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>+%{f.gunlukDegisim}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Al</button>
                        <button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Sat</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Seçili altın detayı */}
          <div style={{ maxWidth: 400 }}>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Spread Detayı — {{ gram: 'Gram Altın', ceyrek: 'Çeyrek', yarim: 'Yarım', cumhuriyet: 'Cumhuriyet', bilezik22: '22 Ayar' }[secilenAltin]}</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { l: 'Alış', v: `₺${seciliFiyat.alis.toLocaleString('tr-TR')}`, c: 'var(--profit)' },
                  { l: 'Satış', v: `₺${seciliFiyat.satis.toLocaleString('tr-TR')}`, c: 'var(--loss)' },
                  { l: 'Spread', v: `₺${spread.toLocaleString('tr-TR')} (%${spreadYuzde})`, c: 'var(--warning)' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{r.l}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {aktifTab === 'portfoy' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Altın Portföyü</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>Tür</th><th>Miktar</th><th>Alış Fiyatı</th><th>Güncel Fiyat</th><th>Maliyet</th><th>Güncel Değer</th><th>Kar/Zarar</th></tr>
            </thead>
            <tbody>
              {ALTIN_PORTFÖY.map((a, i) => {
                const maliyet = a.miktar * a.alisFiyati
                const guncelDeger = a.miktar * a.anlikFiyat
                const karZarar = guncelDeger - maliyet
                const karYuzde = ((karZarar / maliyet) * 100).toFixed(1)
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.renk }}></div>
                        <span style={{ fontWeight: 600 }}>{a.tur}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{a.miktar} {a.birim}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₺{a.alisFiyati.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>₺{a.anlikFiyat.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₺{maliyet.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{guncelDeger.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: karZarar >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                      {karZarar >= 0 ? '+' : ''}₺{karZarar.toLocaleString('tr-TR')} (%{karYuzde})
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'satin-al' && (
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Altın Alış/Satış Emri</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Altın Türü</label>
                <select className={styles.select} style={{ width: '100%' }}>
                  <option>Gram Altın</option><option>Çeyrek Altın</option><option>Yarım Altın</option><option>Cumhuriyet Altını</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Miktar (gram)</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" step="0.1" placeholder="Min: 0.5 gram" value={siparisMiktar} onChange={e => setSiparisMiktar(e.target.value)} />
              </div>
              {siparisMiktar && (
                <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Miktar</span><span style={{ fontFamily: 'var(--font-mono)' }}>{siparisMiktar} gram</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Alış Fiyatı</span><span style={{ fontFamily: 'var(--font-mono)' }}>₺{ALTIN_FIYATLARI.gram.satis.toLocaleString('tr-TR')}/gram</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>Toplam Tutar</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>₺{(parseFloat(siparisMiktar) * ALTIN_FIYATLARI.gram.satis).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span></div>
                </div>
              )}
              <button className="btn btn-primary" style={{ width: '100%' }}>Alış Emri Ver</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'teslimat' && (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Fiziksel Altın Teslimat Talebi</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Rafineri Seç</label>
                <select className={styles.select} style={{ width: '100%' }} value={secilenRafineri} onChange={e => setSecilenRafineri(e.target.value)}>
                  {RAFINERILER.map(r => <option key={r.ad}>{r.ad}</option>)}
                </select>
              </div>
              {(() => {
                const r = RAFINERILER.find(x => x.ad === secilenRafineri)!
                return (
                  <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div><span style={{ color: 'var(--text-dim)' }}>Sertifika: </span><strong>{r.sertifika}</strong></div>
                    <div><span style={{ color: 'var(--text-dim)' }}>Min: </span><strong>{r.minSiparis}</strong></div>
                    <div><span style={{ color: 'var(--text-dim)' }}>Teslimat: </span><strong>{r.teslimat}</strong></div>
                  </div>
                )
              })()}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Teslimat Miktarı</label>
                <select className={styles.select} style={{ width: '100%' }}>
                  <option>1 gram çubuk</option><option>5 gram çubuk</option><option>10 gram çubuk</option><option>20 gram çubuk</option><option>50 gram çubuk</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Teslimat Adresi</label>
                <input className={styles.input} style={{ width: '100%' }} placeholder="Teslimat adresi" value={teslimatAdresi} onChange={e => setTeslimatAdresi(e.target.value)} />
              </div>
              <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--warning)' }}>
                ⚠ Fiziksel teslimat sigortası ve kargo ücreti alınmaktadır. Teslimatta kimlik ibrazı zorunludur.
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Teslimat Talebi Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
