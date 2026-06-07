import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const TAHVILLER = [
  { id: 1, isim: 'TÜFE\'ye Endeksli Devlet Tahvili', kod: 'TR-DT-2028', tip: 'Devlet', faiz: 4.5, gercekFaiz: true, vade: '2028-03-15', kupon: 'Yılda 2x', nominal: 1000, getiri: 48.2, paraBirimi: 'TRY' },
  { id: 2, isim: 'Sabit Faizli Devlet Tahvili', kod: 'TR-DT-2027', tip: 'Devlet', faiz: 42.5, gercekFaiz: false, vade: '2027-09-20', kupon: 'Yılda 2x', nominal: 1000, getiri: 42.5, paraBirimi: 'TRY' },
  { id: 3, isim: 'Türkiye Eurobond 2030', kod: 'TR-EB-2030', tip: 'Eurobond', faiz: 5.75, gercekFaiz: false, vade: '2030-06-01', kupon: 'Yılda 2x', nominal: 1000, getiri: 5.9, paraBirimi: 'USD' },
  { id: 4, isim: 'İş Bankası Bono', kod: 'ISCTR-2026', tip: 'Özel Sektör', faiz: 44.8, gercekFaiz: false, vade: '2026-12-10', kupon: 'Yılda 4x', nominal: 100, getiri: 44.8, paraBirimi: 'TRY' },
  { id: 5, isim: 'Koç Holding Tahvil', kod: 'KCHOL-2027', tip: 'Özel Sektör', faiz: 43.2, gercekFaiz: false, vade: '2027-04-30', kupon: 'Yılda 2x', nominal: 1000, getiri: 43.5, paraBirimi: 'TRY' },
]

const KUPON_TAKVIMI = [
  { tarih: '2026-06-15', tahvil: 'TÜFE\'ye Endeksli DT', tutar: 48.20, durum: 'Bekleniyor' },
  { tarih: '2026-09-20', tahvil: 'Sabit Faizli DT', tutar: 212.50, durum: 'Bekleniyor' },
  { tarih: '2026-10-01', tahvil: 'Eurobond 2030', tutar: 28.75, paraBirimi: 'USD', durum: 'Bekleniyor' },
  { tarih: '2026-03-20', tahvil: 'Sabit Faizli DT', tutar: 212.50, durum: 'Ödendi' },
  { tarih: '2026-04-01', tahvil: 'Eurobond 2030', tutar: 28.75, paraBirimi: 'USD', durum: 'Ödendi' },
]

export function TahvilPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('liste')
  const [filtreTip, setFiltreTip] = useState('Tümü')
  const [hesapNominal, setHesapNominal] = useState('10000')
  const [hesapFaiz, setHesapFaiz] = useState('42.5')
  const [hesapVade, setHesapVade] = useState('2')
  const [itfaBasvuru, setItfaBasvuru] = useState<number | null>(null)

  const gunHesapla = (vade: string) => {
    const fark = new Date(vade).getTime() - Date.now()
    return Math.max(0, Math.ceil(fark / 86400000))
  }

  const filtrelenmisTahviller = TAHVILLER.filter(t => filtreTip === 'Tümü' || t.tip === filtreTip)

  const hesapNominalNum = parseFloat(hesapNominal || '0')
  const hesapFaizNum = parseFloat(hesapFaiz || '0')
  const hesapVadeNum = parseFloat(hesapVade || '0')
  const yillikFaizGeliri = hesapNominalNum * (hesapFaizNum / 100)
  const toplamFaizGeliri = yillikFaizGeliri * hesapVadeNum
  const toplamDeger = hesapNominalNum + toplamFaizGeliri

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Tahvil & Sabit Getirili Menkul Kıymetler</h1>
          <p className={styles.pageSub}>Devlet tahvilleri, Eurobondlar ve özel sektör bonoları</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Tahvil alım emri iletildi ve işleme alındı', 'success')}>+ Tahvil Al</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Portföy Değeri</span>
          <span className={styles.metricValue}>₺184.200</span>
          <span className={`${styles.metricChange} ${styles.up}`}>5 tahvil</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Ort. Getiri</span>
          <span className={styles.metricValue}>%42.8</span>
          <span className={`${styles.metricChange} ${styles.up}`}>yıllık</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Yaklaşan Kupon</span>
          <span className={styles.metricValue}>₺48,20</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>17 gün kaldı</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>En Yakın Vade</span>
          <span className={styles.metricValue}>{gunHesapla('2026-12-10')} gün</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>ISCTR-2026</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'liste', l: 'Tahvil Listesi' },
          { k: 'kupon', l: 'Kupon Takvimi' },
          { k: 'hesapla', l: 'Tahvil Hesaplayıcı' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'liste' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['Tümü', 'Devlet', 'Eurobond', 'Özel Sektör'].map(t => (
              <button key={t} className={`${styles.filterTag} ${filtreTip === t ? styles.filterTagActive : ''}`} onClick={() => setFiltreTip(t)}>{t}</button>
            ))}
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tahvil</th>
                  <th>Kod</th>
                  <th>Tip</th>
                  <th>Getiri</th>
                  <th>Vade Tarihi</th>
                  <th>Kalan Gün</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtrelenmisTahviller.map(t => {
                  const kalan = gunHesapla(t.vade)
                  return (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{t.isim}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{t.paraBirimi} · Nominal: {t.paraBirimi === 'USD' ? '$' : '₺'}{t.nominal}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{t.kod}</td>
                      <td><span style={{ padding: '0.18rem 0.45rem', borderRadius: 100, fontSize: '0.67rem', fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>{t.tip}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 700 }}>%{t.getiri}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{t.vade}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: kalan <= 180 ? 'var(--warning)' : 'var(--text)' }}>{kalan}</span>
                          <div className={styles.progressBar} style={{ width: 48, height: 4 }}>
                            <div className={styles.progressFill} style={{ width: `${Math.min(100, (kalan / 730) * 100)}%`, background: kalan <= 180 ? 'var(--warning)' : 'var(--accent)' }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ fontSize: '0.68rem', padding: '0.25rem 0.5rem' }} onClick={() => setItfaBasvuru(t.id === itfaBasvuru ? null : t.id)}>
                          {itfaBasvuru === t.id ? 'İptal' : 'Erken İtfa'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aktifTab === 'kupon' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {KUPON_TAKVIMI.sort((a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime()).map((k, i) => (
            <div key={i} className={styles.sectionCard}>
              <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ minWidth: 80, textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{new Date(k.tarih).toLocaleString('tr-TR', { month: 'short' })}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.2rem' }}>{new Date(k.tarih).getDate()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{k.tahvil}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>Kupon Ödemesi</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--profit)' }}>
                    {k.paraBirimi === 'USD' ? '$' : '₺'}{k.tutar.toFixed(2)}
                  </div>
                  <span style={{ padding: '0.15rem 0.4rem', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, background: k.durum === 'Ödendi' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: k.durum === 'Ödendi' ? 'var(--profit)' : 'var(--warning)', border: '1px solid transparent' }}>{k.durum}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'hesapla' && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Tahvil Getiri Hesaplayıcı</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Nominal Değer (₺)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} value={hesapNominal} onChange={e => setHesapNominal(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Yıllık Kupon Oranı (%)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} value={hesapFaiz} onChange={e => setHesapFaiz(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Vade (Yıl)</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} value={hesapVade} onChange={e => setHesapVade(e.target.value)} />
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {[
                  { l: 'Yıllık Kupon Geliri', v: `₺${yillikFaizGeliri.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}` },
                  { l: `${hesapVade} Yıl Toplam Faiz`, v: `₺${toplamFaizGeliri.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}` },
                  { l: 'Vade Sonu Toplam Değer', v: `₺${toplamDeger.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}` },
                ].map(item => (
                  <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{item.l}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: item.l.includes('Toplam Değer') ? 700 : 400, color: item.l.includes('Toplam Değer') ? 'var(--accent)' : 'var(--text)', fontSize: item.l.includes('Toplam Değer') ? '0.95rem' : '0.82rem' }}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
