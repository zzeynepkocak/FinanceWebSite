import { useState } from 'react'
import styles from './SharedPage.module.css'

const AKTIF_IPOLAR = [
  { id: 1, sirket: 'TechVadi Yazılım A.Ş.', sektor: 'Teknoloji', halkaArzFiyati: 48.00, lotBuyuklugu: 100, toplamLot: 2500000, basvuruSon: '2026-06-05', borsaYer: 'BIST', islamiUyumlu: false, durum: 'Aktif' },
  { id: 2, sirket: 'Güneş Enerji Yatırımları A.Ş.', sektor: 'Enerji', halkaArzFiyati: 22.50, lotBuyuklugu: 100, toplamLot: 5000000, basvuruSon: '2026-06-10', borsaYer: 'BIST', islamiUyumlu: true, durum: 'Aktif' },
  { id: 3, sirket: 'Anadolu Tarım Teknolojileri', sektor: 'Tarım-Teknoloji', halkaArzFiyati: 15.80, lotBuyuklugu: 100, toplamLot: 8000000, basvuruSon: '2026-06-15', borsaYer: 'BIST', islamiUyumlu: true, durum: 'Aktif' },
]

const YAKLASAN_IPOLAR = [
  { id: 4, sirket: 'Mega Lojistik A.Ş.', sektor: 'Lojistik', tahminiArzTarihi: 'Temmuz 2026', tahminiDeger: '₺1.2Bn', islamiUyumlu: false },
  { id: 5, sirket: 'BioTurk İlaç', sektor: 'Sağlık', tahminiArzTarihi: 'Ağustos 2026', tahminiDeger: '₺3.8Bn', islamiUyumlu: false },
  { id: 6, sirket: 'Katılım Fintech A.Ş.', sektor: 'Fintech', tahminiArzTarihi: 'Eylül 2026', tahminiDeger: '₺680M', islamiUyumlu: true },
]

const SONUCLAR = [
  { sirket: 'DijitalBank A.Ş.', basvuruMiktari: 50000, tahsisMiktari: 2400, oran: '%4.8', sonuc: 'Kısmi Tahsis' },
  { sirket: 'GreenPower Enerji', basvuruMiktari: 100000, tahsisMiktari: 100000, oran: '%100', sonuc: 'Tam Tahsis' },
]

export function IPOPage() {
  const [aktifTab, setAktifTab] = useState('aktif')
  const [islamiFiltre, setIslamiFiltre] = useState(false)
  const [basvuruFormu, setBasvuruFormu] = useState<number | null>(null)
  const [basvuruTutar, setBasvuruTutar] = useState('')
  const [basvuruLot, setBasvuruLot] = useState('')

  const aktifIPOlar = AKTIF_IPOLAR.filter(i => !islamiFiltre || i.islamiUyumlu)
  const yakIpolar = YAKLASAN_IPOLAR.filter(i => !islamiFiltre || i.islamiUyumlu)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Halka Arz (IPO) & Ön Satış Yönetimi</h1>
          <p className={styles.pageSub}>Aktif ve yaklaşan halka arzlar, başvuru ve tahsis sonuçları</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Yalnızca Faiz İçermeyen</span>
          <label className={styles.switch}>
            <input type="checkbox" checked={islamiFiltre} onChange={() => setIslamiFiltre(f => !f)} />
            <span className={styles.slider} />
          </label>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aktif Halka Arz</span>
          <span className={styles.metricValue}>{AKTIF_IPOLAR.length}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>başvuru açık</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Yaklaşan Arz</span>
          <span className={styles.metricValue}>{YAKLASAN_IPOLAR.length}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>izleme listesi</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Başvurulan</span>
          <span className={styles.metricValue}>2</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>sonuç bekleniyor</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Tahsis</span>
          <span className={styles.metricValue}>₺102.400</span>
          <span className={`${styles.metricChange} ${styles.up}`}>2 halka arz</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'aktif', l: 'Aktif Arzlar' },
          { k: 'yaklasan', l: 'Yaklaşan Arzlar' },
          { k: 'sonuclar', l: 'Tahsis Sonuçları' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'aktif' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {aktifIPOlar.map(ipo => (
            <div key={ipo.id} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.cardTitle}>{ipo.sirket}</span>
                    {ipo.islamiUyumlu && <span style={{ padding: '0.12rem 0.4rem', borderRadius: 100, fontSize: '0.62rem', fontWeight: 700, background: 'rgba(0,212,170,0.1)', color: 'var(--profit)', border: '1px solid rgba(0,212,170,0.3)' }}>Faiz İçermez</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{ipo.sektor} · {ipo.borsaYer}</div>
                </div>
                <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(0,212,170,0.1)', color: 'var(--profit)', border: '1px solid rgba(0,212,170,0.3)' }}>Aktif</span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  {[
                    { l: 'Arz Fiyatı', v: `₺${ipo.halkaArzFiyati.toFixed(2)}` },
                    { l: 'Lot Büyüklüğü', v: `${ipo.lotBuyuklugu} adet` },
                    { l: 'Toplam Lot', v: ipo.toplamLot.toLocaleString('tr-TR') },
                    { l: 'Başvuru Son', v: ipo.basvuruSon },
                  ].map(item => (
                    <div key={item.l}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.l}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '0.2rem' }}>{item.v}</div>
                    </div>
                  ))}
                </div>
                {basvuruFormu === ipo.id ? (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Başvuru Formu</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input className={styles.input} placeholder="Lot adedi" value={basvuruLot} onChange={e => setBasvuruLot(e.target.value)} style={{ flex: 1 }} />
                      <input className={styles.input} placeholder="Tutar (₺)" value={basvuruTutar} onChange={e => setBasvuruTutar(e.target.value)} style={{ flex: 1 }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>Başvuru Yap</button>
                      <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => setBasvuruFormu(null)}>İptal</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => setBasvuruFormu(ipo.id)}>Başvur</button>
                    <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>İzharname PDF</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'yaklasan' && (
        <div className={styles.grid2}>
          {yakIpolar.map(ipo => (
            <div key={ipo.id} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.cardTitle}>{ipo.sirket}</span>
                    {ipo.islamiUyumlu && <span style={{ padding: '0.12rem 0.4rem', borderRadius: 100, fontSize: '0.62rem', fontWeight: 700, background: 'rgba(0,212,170,0.1)', color: 'var(--profit)', border: '1px solid rgba(0,212,170,0.3)' }}>Faiz İçermez</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{ipo.sektor}</div>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Tahmini Arz</span>
                  <span style={{ fontWeight: 600 }}>{ipo.tahminiArzTarihi}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Tahmini Değer</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>{ipo.tahminiDeger}</span>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>İzleme Listesine Ekle</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'sonuclar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {SONUCLAR.map((s, i) => (
            <div key={i} className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{s.sirket}</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {[
                  { l: 'Başvurulan Tutar', v: `₺${s.basvuruMiktari.toLocaleString('tr-TR')}` },
                  { l: 'Tahsis Tutar', v: `₺${s.tahsisMiktari.toLocaleString('tr-TR')}` },
                  { l: 'Tahsis Oranı', v: s.oran },
                  { l: 'Sonuç', v: s.sonuc },
                ].map(item => (
                  <div key={item.l}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.l}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: '0.2rem', color: item.l === 'Sonuç' ? (s.sonuc === 'Tam Tahsis' ? 'var(--profit)' : 'var(--warning)') : 'var(--text)' }}>{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
