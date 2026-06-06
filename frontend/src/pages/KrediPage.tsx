import { useState } from 'react'
import styles from './SharedPage.module.css'

const KREDI_KARTI_BASVURULARI = [
  { ad: 'Garanti Bonus Black', limit: 80000, faiz: '%2.49', renk: '#00a651', avantaj: 'Bonus puan, ücretsiz airport lounge' },
  { ad: 'Akbank Axess Platinum', limit: 60000, faiz: '%2.39', renk: '#e30613', avantaj: '%5 market cashback, sinema indirimi' },
  { ad: 'Yapı Kredi Worldcard Gold', limit: 50000, faiz: '%2.55', renk: '#0066cc', avantaj: 'World puan, ortak mağaza kampanyaları' },
  { ad: 'İş Bankası Maximum Platinum', limit: 75000, faiz: '%2.45', renk: '#003087', avantaj: 'Maximum puan, restoran indirimleri' },
]

const KREDI_ÜRÜNLERI = [
  { banka: 'Garanti BBVA', oran: '%3.29', vade: 60, maks: 500000, onay: '5 dak' },
  { banka: 'Akbank', oran: '%3.19', vade: 48, maks: 400000, onay: '10 dak' },
  { banka: 'Ziraat Bankası', oran: '%2.99', vade: 72, maks: 300000, onay: '1 gün' },
  { banka: 'VakıfBank', oran: '%3.09', vade: 60, maks: 350000, onay: '2 saat' },
  { banka: 'Halkbank', oran: '%2.89', vade: 60, maks: 250000, onay: '1 gün' },
]

const IYILESTIRME_IPUÇLARI = [
  { tip: 'Limit Kullanımı', aciklama: 'Kredi kartı limitinizin %30\'undan fazlasını kullanmayın.', etki: '+15 puan', renk: 'var(--profit)' },
  { tip: 'Ödeme Düzeni', aciklama: 'Son 12 aydır eksiksiz ödeme yaptınız.', etki: '+22 puan', renk: 'var(--profit)' },
  { tip: 'Kredi Çeşitliliği', aciklama: 'Farklı kredi türleri (ihtiyaç + konut) skorunuzu artırır.', etki: '+8 puan', renk: 'var(--accent)' },
  { tip: 'Yeni Başvurular', aciklama: 'Son 6 ayda 3 başvuru yapıldı. Daha az başvuru yapın.', etki: '-5 puan', renk: 'var(--loss)' },
]

export function KrediPage() {
  const [aktifTab, setAktifTab] = useState('skor')
  const [krediTutar, setKrediTutar] = useState('100000')
  const [krediVade, setKrediVade] = useState('36')
  const [krediOran, setKrediOran] = useState('3.29')

  const skorDeger = 748
  const skorMax = 1900
  const skorYuzdesi = ((skorDeger - 400) / (skorMax - 400)) * 100

  const hesaplaAylikOdeme = () => {
    const p = parseFloat(krediTutar) || 0
    const r = (parseFloat(krediOran) || 0) / 100
    const n = parseInt(krediVade) || 1
    if (p === 0 || r === 0) return { aylik: p / n, toplam: p, faizTopiam: 0 }
    const aylik = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return { aylik, toplam: aylik * n, faizTopiam: aylik * n - p }
  }
  const sim = hesaplaAylikOdeme()

  const skorRenk = skorDeger >= 700 ? 'var(--profit)' : skorDeger >= 550 ? 'var(--warning)' : 'var(--loss)'
  const skorEtiket = skorDeger >= 800 ? 'Mükemmel' : skorDeger >= 700 ? 'İyi' : skorDeger >= 550 ? 'Orta' : 'Zayıf'

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Kredi & Finansal Sağlık</h1>
          <p className={styles.pageSub}>Kredi skorunuz ve kredi ürünleri</p>
        </div>
        <button className="btn btn-primary">Kredi Başvurusu</button>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'skor', l: 'Kredi Skoru' },
          { k: 'simulasyon', l: 'Kredi Simülasyonu' },
          { k: 'kart', l: 'Kredi Kartı' },
          { k: 'karsilastir', l: 'Faiz Karşılaştırma' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'skor' && (
        <>
          <div className={styles.grid2}>
            {/* Skor Göstergesi */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Kredi Skoru (Findeks)</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 1rem' }}>
                {/* SVG Arc gauge */}
                <svg width="200" height="120" viewBox="0 0 200 120">
                  {/* Background arc */}
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--border)" strokeWidth="14" strokeLinecap="round" />
                  {/* Colored arc */}
                  <path
                    d={`M 20 100 A 80 80 0 0 1 180 100`}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${(skorYuzdesi / 100) * 251} 251`}
                    style={{ stroke: skorRenk, transition: 'stroke-dasharray 1s ease' }}
                  />
                  <text x="100" y="90" textAnchor="middle" fill={skorRenk} fontSize="32" fontWeight="700" fontFamily="var(--font-mono)">{skorDeger}</text>
                  <text x="100" y="108" textAnchor="middle" fill="var(--text-dim)" fontSize="11">{skorEtiket} • Max 1900</text>
                </svg>
                <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Önceki Ay</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>732</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Değişim</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>+16</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hedef</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>800+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* İyileştirme İpuçları */}
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>İyileştirme İpuçları</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {IYILESTIRME_IPUÇLARI.map((ip, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{ip.tip}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: ip.renk, fontWeight: 700 }}>{ip.etki}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{ip.aciklama}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.metricsRow}>
            <div className={styles.metricCard}><span className={styles.metricLabel}>Aktif Kredi</span><span className={styles.metricValue}>2</span><span className={`${styles.metricChange} ${styles.neutral}`}>ihtiyaç + konut</span></div>
            <div className={styles.metricCard}><span className={styles.metricLabel}>Limit Kullanımı</span><span className={styles.metricValue}>%24</span><span className={`${styles.metricChange} ${styles.up}`}>İdeal seviye</span></div>
            <div className={styles.metricCard}><span className={styles.metricLabel}>Gecikme Kaydı</span><span className={styles.metricValue} style={{ color: 'var(--profit)' }}>0</span><span className={`${styles.metricChange} ${styles.up}`}>Son 24 ay</span></div>
            <div className={styles.metricCard}><span className={styles.metricLabel}>Toplam Borç</span><span className={styles.metricValue}>₺142K</span><span className={`${styles.metricChange} ${styles.neutral}`}>Konut dahil</span></div>
          </div>
        </>
      )}

      {aktifTab === 'simulasyon' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Kredi Ödeme Simülasyonu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Kredi Tutarı</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" value={krediTutar} onChange={e => setKrediTutar(e.target.value)} placeholder="₺" />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Vade (Ay)</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['12', '24', '36', '48', '60'].map(v => (
                    <button key={v} onClick={() => setKrediVade(v)} style={{ flex: 1, padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${krediVade === v ? 'var(--accent)' : 'var(--border)'}`, background: krediVade === v ? 'var(--accent-dim)' : 'var(--bg-card)', color: krediVade === v ? 'var(--accent)' : 'var(--text)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: krediVade === v ? 700 : 400 }}>
                      {v} ay
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Aylık Faiz Oranı (%)</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" step="0.01" value={krediOran} onChange={e => setKrediOran(e.target.value)} />
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Simülasyon Sonucu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center', padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aylık Taksit</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>₺{sim.aylik.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { etiket: 'Kredi Tutarı', deger: `₺${parseFloat(krediTutar || '0').toLocaleString('tr-TR')}`, renk: 'var(--text)' },
                  { etiket: 'Toplam Ödenecek', deger: `₺${sim.toplam.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, renk: 'var(--text)' },
                  { etiket: 'Toplam Faiz', deger: `₺${sim.faizTopiam.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, renk: 'var(--loss)' },
                  { etiket: 'Faiz Maliyeti', deger: `%${((sim.faizTopiam / (parseFloat(krediTutar || '1'))) * 100).toFixed(1)}`, renk: 'var(--warning)' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.45rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{r.etiket}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.renk }}>{r.deger}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Kredi Başvurusu Yap</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'kart' && (
        <div className={styles.grid2}>
          {KREDI_KARTI_BASVURULARI.map((kart, i) => (
            <div key={i} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${kart.renk}22`, border: `1px solid ${kart.renk}44`, display: 'grid', placeItems: 'center', fontWeight: 700, color: kart.renk, fontSize: '0.72rem' }}>KK</div>
                  <span className={styles.cardTitle}>{kart.ad}</span>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Maks Limit</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem' }}>₺{kart.limit.toLocaleString('tr-TR')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Aylık Faiz</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--warning)', fontSize: '0.9rem' }}>{kart.faiz}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{kart.avantaj}</div>
                <button className="btn btn-primary" style={{ fontSize: '0.78rem' }}>Başvur</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'karsilastir' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>İhtiyaç Kredisi Faiz Karşılaştırması</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>Banka</th><th>Aylık Faiz</th><th>Max Vade</th><th>Max Tutar</th><th>Onay Süresi</th><th></th></tr>
            </thead>
            <tbody>
              {KREDI_ÜRÜNLERI.sort((a, b) => parseFloat(a.oran.replace('%', '')) - parseFloat(b.oran.replace('%', ''))).map((k, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {i === 0 && <span style={{ padding: '0.1rem 0.4rem', background: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700 }}>En Ucuz</span>}
                      {k.banka}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: i === 0 ? 'var(--profit)' : 'var(--text)', fontWeight: i === 0 ? 700 : 400 }}>{k.oran}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{k.vade} ay</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>₺{k.maks.toLocaleString('tr-TR')}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{k.onay}</td>
                  <td><button className="btn btn-secondary" style={{ fontSize: '0.72rem' }}>Başvur</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
