import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

const DESTEKLER = [
  { id: 1, ad: 'KOSGEB İşletme Geliştirme Desteği', kurum: 'KOSGEB', tur: 'Hibe', toplamBütce: 500000, harcanan: 320000, durum: 'Onaylı', bitis: '2026-12-31', vergeMuaf: 125000 },
  { id: 2, ad: 'TÜBİTAK 1507 KOBİ Ar-Ge Desteği', kurum: 'TÜBİTAK', tur: 'Ar-Ge Desteği', toplamBütce: 1200000, harcanan: 480000, durum: 'Devam Ediyor', bitis: '2027-06-30', vergeMuaf: 0 },
  { id: 3, ad: 'Sanayi ve Teknoloji Bakanlığı Yatırım Teşviki', kurum: 'Bakanlık', tur: 'Teşvik Belgesi', toplamBütce: 3000000, harcanan: 1850000, durum: 'Onaylı', bitis: '2028-01-01', vergeMuaf: 450000 },
  { id: 4, ad: 'KOSGEB Dijital Dönüşüm Desteği', kurum: 'KOSGEB', tur: 'Hibe', toplamBütce: 150000, harcanan: 0, durum: 'Başvuru Aşamasında', bitis: '2026-09-30', vergeMuaf: 0 },
]

const MILESTONES = [
  { ad: 'Proje Başlangıç Raporu', tarih: '2025-10-01', durum: 'Onaylandı' },
  { ad: '1. Ara Dönem Raporu', tarih: '2026-01-15', durum: 'Onaylandı' },
  { ad: '2. Ara Dönem Raporu', tarih: '2026-04-15', durum: 'Onaylandı' },
  { ad: '3. Ara Dönem Raporu', tarih: '2026-07-15', durum: 'Bekliyor' },
  { ad: 'Nihai Rapor & Kapanış', tarih: '2027-06-30', durum: 'Bekliyor' },
]

export function TesvikPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('destekler')
  const [secilenDestek, setSecilenDestek] = useState<number | null>(null)

  const toplamHibe = DESTEKLER.reduce((t, d) => t + d.toplamBütce, 0)
  const toplamHarcanan = DESTEKLER.reduce((t, d) => t + d.harcanan, 0)
  const toplamVergeMuaf = DESTEKLER.reduce((t, d) => t + d.vergeMuaf, 0)

  const durumRenk = (d: string) => {
    if (d === 'Onaylandı' || d === 'Onaylı') return { bg: 'rgba(0,212,170,0.1)', color: 'var(--profit)', border: 'rgba(0,212,170,0.3)' }
    if (d === 'Devam Ediyor' || d === 'Bekliyor') return { bg: 'rgba(240,180,41,0.1)', color: 'var(--warning)', border: 'rgba(240,180,41,0.3)' }
    return { bg: 'rgba(0,102,255,0.1)', color: '#0066ff', border: 'rgba(0,102,255,0.3)' }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Teşvik & Hibeler</h1>
          <p className={styles.pageSub}>KOSGEB, TÜBİTAK ve bakanlık destekleri ile proje bütçe takibi</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Teşvik başvurunuz sisteme kaydedildi', 'success')}>+ Yeni Başvuru</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Destek Bütçesi</span>
          <span className={styles.metricValue}>₺{(toplamHibe / 1000000).toFixed(1)}M</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>{DESTEKLER.length} proje</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Harcanan</span>
          <span className={styles.metricValue}>₺{(toplamHarcanan / 1000000).toFixed(2)}M</span>
          <span className={`${styles.metricChange} ${styles.up}`}>%{Math.round((toplamHarcanan / toplamHibe) * 100)} kullanıldı</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kalan Bütçe</span>
          <span className={styles.metricValue}>₺{((toplamHibe - toplamHarcanan) / 1000000).toFixed(2)}M</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>kullanılabilir</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Vergi Muafiyeti</span>
          <span className={styles.metricValue}>₺{(toplamVergeMuaf / 1000).toFixed(0)}K</span>
          <span className={`${styles.metricChange} ${styles.up}`}>tahakkuk eden</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'destekler', l: 'Destek Programları' },
          { k: 'milestones', l: 'Milestone Takibi' },
          { k: 'butce', l: 'Bütçe Harcamaları' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'destekler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {DESTEKLER.map(d => {
            const dr = durumRenk(d.durum)
            return (
              <div key={d.id} className={styles.sectionCard} style={{ cursor: 'pointer' }} onClick={() => setSecilenDestek(d.id === secilenDestek ? null : d.id)}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.cardTitle}>{d.ad}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{d.kurum} · {d.tur}</div>
                  </div>
                  <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: dr.bg, color: dr.color, border: `1px solid ${dr.border}` }}>{d.durum}</span>
                </div>
                <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Bütçe Kullanımı</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>₺{d.harcanan.toLocaleString('tr-TR')} / ₺{d.toplamBütce.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${Math.round((d.harcanan / d.toplamBütce) * 100)}%` }} />
                    </div>
                  </div>
                  {secilenDestek === d.id && (
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.25rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border)' }}>
                      {[
                        { l: 'Proje Bitiş', v: d.bitis },
                        { l: 'Kalan Bütçe', v: `₺${(d.toplamBütce - d.harcanan).toLocaleString('tr-TR')}` },
                        { l: 'Vergi Muafiyeti', v: d.vergeMuaf > 0 ? `₺${d.vergeMuaf.toLocaleString('tr-TR')}` : '—' },
                      ].map(item => (
                        <div key={item.l}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.l}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '0.15rem', color: item.l === 'Vergi Muafiyeti' ? 'var(--profit)' : 'var(--text)' }}>{item.v}</div>
                        </div>
                      ))}
                      <div style={{ marginLeft: 'auto' }}>
                        <button className="btn btn-secondary" style={{ fontSize: '0.72rem' }}>Rapor İndir</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {aktifTab === 'milestones' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>TÜBİTAK 1507 — Milestone & Onay Durumu</span></div>
          <div className={styles.cardBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {MILESTONES.map((m, i) => {
                const mr = durumRenk(m.durum)
                return (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: i < MILESTONES.length - 1 ? '1rem' : 0, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: mr.bg, border: `2px solid ${mr.color}`, display: 'grid', placeItems: 'center' }}>
                        {m.durum === 'Onaylandı' ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={mr.color} strokeWidth="1.5" strokeLinecap="round"/></svg>
                        ) : (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: mr.color }} />
                        )}
                      </div>
                      {i < MILESTONES.length - 1 && <div style={{ width: 2, height: 32, background: 'var(--border)', marginTop: 4 }} />}
                    </div>
                    <div style={{ flex: 1, paddingTop: '0.2rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.ad}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{m.tarih}</div>
                    </div>
                    <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: mr.bg, color: mr.color, border: `1px solid ${mr.color}33`, marginTop: '0.15rem' }}>{m.durum}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'butce' && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Program</th><th>Kurum</th><th>Toplam Bütçe</th><th>Harcanan</th><th>Kalan</th><th>Kullanım</th><th>Vergi Muafiyeti</th></tr>
            </thead>
            <tbody>
              {DESTEKLER.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{d.tur}</td>
                  <td style={{ fontSize: '0.78rem' }}>{d.kurum}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₺{d.toplamBütce.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>₺{d.harcanan.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: d.toplamBütce - d.harcanan > 0 ? 'var(--profit)' : 'var(--text-dim)' }}>₺{(d.toplamBütce - d.harcanan).toLocaleString('tr-TR')}</td>
                  <td style={{ minWidth: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div className={styles.progressBar} style={{ flex: 1 }}>
                        <div className={styles.progressFill} style={{ width: `${Math.round((d.harcanan / d.toplamBütce) * 100)}%` }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>%{Math.round((d.harcanan / d.toplamBütce) * 100)}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: d.vergeMuaf > 0 ? 'var(--profit)' : 'var(--text-dim)', fontWeight: d.vergeMuaf > 0 ? 700 : 400 }}>
                    {d.vergeMuaf > 0 ? `₺${d.vergeMuaf.toLocaleString('tr-TR')}` : '—'}
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
