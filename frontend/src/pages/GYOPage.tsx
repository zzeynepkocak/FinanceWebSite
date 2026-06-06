import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const MULKLER = [
  { id: 1, ad: 'İstanbul Kadıköy Rezidans', konum: 'Kadıköy, İstanbul', m2: 85, toplamPay: 10000, bedelMetrekare: 42000, kirGetirisi: 8.2, doluluk: 96, kiracıDurumu: 'Sözleşme aktif', renk: '#0066ff' },
  { id: 2, ad: 'Ankara Çankaya Ofis', konum: 'Çankaya, Ankara', m2: 120, toplamPay: 8000, bedelMetrekare: 28000, kirGetirisi: 6.8, doluluk: 100, kiracıDurumu: 'Sözleşme aktif', renk: '#00d4aa' },
  { id: 3, ad: 'İzmir Alsancak Dükkan', konum: 'Alsancak, İzmir', m2: 60, toplamPay: 6000, bedelMetrekare: 35000, kirGetirisi: 7.4, doluluk: 88, kiracıDurumu: 'Kısmi boşluk', renk: '#f0b429' },
]

const KIRA_DAGILIMLARI = [
  { ay: 'Şubat 2026', tutar: 12400, tarih: '2026-03-01', durum: 'Ödendi' },
  { ay: 'Mart 2026', tutar: 12650, tarih: '2026-04-01', durum: 'Ödendi' },
  { ay: 'Nisan 2026', tutar: 12650, tarih: '2026-05-01', durum: 'Ödendi' },
  { ay: 'Mayıs 2026', tutar: 12900, tarih: '2026-06-01', durum: 'Bekliyor' },
]

export function GYOPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('mulkler')
  const [secilenMulk, setSecilenMulk] = useState<number | null>(null)
  const [islemTip, setIslemTip] = useState<'al' | 'sat'>('al')
  const [payAdet, setPayAdet] = useState('10')

  const benimPaylari: Record<number, number> = { 1: 50, 2: 25, 3: 0 }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>GYO & Fraksiyonel Gayrimenkul</h1>
          <p className={styles.pageSub}>Paylı mülk yatırımı, kira getirisi ve ikincil piyasa</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('GYO portföyünüze eklendi', 'success')}>+ Portföyüme Ekle</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Yatırım</span>
          <span className={styles.metricValue}>₺3,75M</span>
          <span className={`${styles.metricChange} ${styles.up}`}>2 mülk portföyü</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aylık Kira Geliri</span>
          <span className={styles.metricValue}>₺12.900</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%2 geçen ay</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Ortalama Doluluk</span>
          <span className={styles.metricValue}>%98</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Çok iyi</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Yıllık Getiri</span>
          <span className={styles.metricValue}>%7.6</span>
          <span className={`${styles.metricChange} ${styles.up}`}>Kira bazlı</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'mulkler', l: 'Mülk Kartları' },
          { k: 'kira', l: 'Kira Dağılımı' },
          { k: 'ikincil', l: 'İkincil Piyasa' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'mulkler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {MULKLER.map(m => (
            <div key={m.id} className={styles.sectionCard}>
              <div className={styles.cardHeader} style={{ borderLeft: `3px solid ${m.renk}` }}>
                <div>
                  <div className={styles.cardTitle}>{m.ad}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{m.konum} · {m.m2} m²</div>
                </div>
                <span style={{ padding: '0.18rem 0.55rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 600, background: m.doluluk >= 95 ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: m.doluluk >= 95 ? 'var(--profit)' : 'var(--warning)', border: '1px solid transparent' }}>
                  %{m.doluluk} Dolu
                </span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { l: 'Metrekare Bedeli', v: `₺${m.bedelMetrekare.toLocaleString('tr-TR')}` },
                  { l: 'Toplam Pay', v: m.toplamPay.toLocaleString('tr-TR') },
                  { l: 'Pay Başı Değer', v: `₺${Math.round((m.m2 * m.bedelMetrekare) / m.toplamPay).toLocaleString('tr-TR')}` },
                  { l: 'Kira Getirisi', v: `%${m.kirGetirisi}` },
                  { l: 'Sahip Olduğunuz Pay', v: benimPaylari[m.id] > 0 ? `${benimPaylari[m.id]} pay` : '—' },
                  { l: 'Kiracı', v: m.kiracıDurumu },
                ].map(item => (
                  <div key={item.l}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.l}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '0.2rem', fontSize: '0.85rem' }}>{item.v}</div>
                  </div>
                ))}
                <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
                  <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>Yatırım Yap</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'kira' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={`${styles.alertCard} ${styles.alertInfo}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#0066ff" strokeWidth="1.2"/><line x1="7" y1="6" x2="7" y2="10" stroke="#0066ff" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="4.5" r="0.6" fill="#0066ff"/></svg>
            <span style={{ fontSize: '0.78rem' }}>Kira dağılımları her ayın 1. günü, toplam kira bedelinin sahip olduğunuz pay oranında hesabınıza aktarılır.</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Dönem</th><th>Toplam Kira</th><th>Aktarım Tarihi</th><th>Durum</th></tr>
              </thead>
              <tbody>
                {KIRA_DAGILIMLARI.map((k, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{k.ay}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{k.tutar.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{k.tarih}</td>
                    <td>
                      <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: k.durum === 'Ödendi' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', color: k.durum === 'Ödendi' ? 'var(--profit)' : 'var(--warning)', border: '1px solid transparent' }}>
                        {k.durum}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aktifTab === 'ikincil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Pay Al / Sat</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['al', 'sat'] as const).map(t => (
                  <button key={t} onClick={() => setIslemTip(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${islemTip === t ? (t === 'al' ? 'rgba(0,212,170,0.4)' : 'rgba(255,71,87,0.4)') : 'var(--border)'}`, background: islemTip === t ? (t === 'al' ? 'rgba(0,212,170,0.1)' : 'rgba(255,71,87,0.1)') : 'transparent', color: islemTip === t ? (t === 'al' ? 'var(--profit)' : 'var(--loss)') : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                    {t === 'al' ? 'Satın Al' : 'Sat'}
                  </button>
                ))}
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Mülk Seçin</label>
                <select className={styles.select} style={{ width: '100%' }} value={secilenMulk ?? ''} onChange={e => setSecilenMulk(Number(e.target.value))}>
                  <option value="">— Mülk Seçin —</option>
                  {MULKLER.map(m => <option key={m.id} value={m.id}>{m.ad}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Pay Adedi</label>
                <input type="number" className={styles.input} style={{ width: '100%' }} value={payAdet} onChange={e => setPayAdet(e.target.value)} min="1" />
              </div>
              {secilenMulk && (
                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Tahmini Tutar</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>
                    ₺{(parseInt(payAdet || '0') * Math.round((MULKLER.find(m => m.id === secilenMulk)?.m2 ?? 0) * (MULKLER.find(m => m.id === secilenMulk)?.bedelMetrekare ?? 0) / (MULKLER.find(m => m.id === secilenMulk)?.toplamPay ?? 1))).toLocaleString('tr-TR')}
                  </span>
                </div>
              )}
              <button className={islemTip === 'al' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ width: '100%', background: islemTip === 'sat' ? 'rgba(255,71,87,0.1)' : undefined, color: islemTip === 'sat' ? 'var(--loss)' : undefined, border: islemTip === 'sat' ? '1px solid rgba(255,71,87,0.4)' : undefined }}>
                {islemTip === 'al' ? 'Pay Satın Al' : 'Pay Sat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
