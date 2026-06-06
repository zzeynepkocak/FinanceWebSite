import { useState } from 'react'
import styles from './SharedPage.module.css'

const TEMALAR = [
  { ad: 'Teknoloji Odaklı', getiri: '+28.4%', risk: 'Yüksek', renk: '#6c5ce7', icon: '💻' },
  { ad: 'Dengeli Büyüme', getiri: '+18.2%', risk: 'Orta', renk: '#00d4aa', icon: '⚖' },
  { ad: 'Temettü Liderleri', getiri: '+12.5%', risk: 'Düşük', renk: '#f0b429', icon: '💰' },
  { ad: 'ESG / Yeşil', getiri: '+15.8%', risk: 'Orta', renk: '#55efc4', icon: '🌱' },
]

const TEMETU = [
  { tarih: '2026-06-15', sembol: 'GARAN', tutar: 1240, hisseBasina: 2.48 },
  { tarih: '2026-07-01', sembol: 'AKBNK', tutar: 840, hisseBasina: 1.68 },
  { tarih: '2026-07-15', sembol: 'KCHOL', tutar: 2100, hisseBasina: 4.20 },
]

export function PortfoyOptPage() {
  const [aktifTema, setAktifTema] = useState<number | null>(null)
  const [yenidenDengeleme, setYenidenDengeleme] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Portföy Optimizasyonu & Varlık Çeşitlendirme</h1>
          <p className={styles.pageSub}>Risk analizi, otomatik dengeleme ve tema yatırımları</p>
        </div>
        <button className="btn btn-primary" onClick={() => setYenidenDengeleme(true)}>Portföyü Dengele</button>
      </div>

      {yenidenDengeleme && (
        <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--text)' }}>
            🔄 Otomatik Yeniden Dengeleme: 3 varlık satış, 2 varlık alış önerildi
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>Onayla</button>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => setYenidenDengeleme(false)}>İptal</button>
          </div>
        </div>
      )}

      <div className={styles.grid2}>
        {/* Korelasyon Matrisi */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Risk Çarkı — Korelasyon Matrisi</span></div>
          <div className={styles.cardBody}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(5, 1fr)', gap: 2, fontSize: '0.68rem' }}>
              {['', 'Hisse', 'Tahvil', 'Döviz', 'Kripto', 'Altın'].map((h, i) => (
                <div key={i} style={{ padding: '0.4rem', fontWeight: 600, color: 'var(--text-dim)', textAlign: 'center' }}>{h}</div>
              ))}
              {[
                ['Hisse', 1.00, -0.32, 0.18, 0.42, -0.15],
                ['Tahvil', -0.32, 1.00, -0.08, -0.25, 0.31],
                ['Döviz', 0.18, -0.08, 1.00, 0.28, 0.55],
                ['Kripto', 0.42, -0.25, 0.28, 1.00, 0.12],
                ['Altın', -0.15, 0.31, 0.55, 0.12, 1.00],
              ].map(([label, ...vals]) => (
                <>
                  <div key={String(label)} style={{ padding: '0.4rem', fontWeight: 600, color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>{label}</div>
                  {(vals as number[]).map((v, j) => {
                    const abs = Math.abs(v)
                    const bg = v === 1 ? 'var(--accent)' : v > 0 ? `rgba(0,212,170,${abs * 0.7})` : `rgba(255,71,87,${abs * 0.7})`
                    return (
                      <div key={j} title={String(v)} style={{ padding: '0.5rem', textAlign: 'center', background: bg, borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: v === 1 ? '#000' : 'var(--text)' }}>
                        {v.toFixed(2)}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Enflasyon Erimesi */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Enflasyon Karşısında Varlık Değerleri</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Yıllık %43 enflasyon baz alınarak hesaplanmıştır.</p>
            {[
              { ad: 'Hisse Senetleri', nominal: 28.4, reel: -10.2, renk: '#0066ff' },
              { ad: 'Kripto Para', nominal: 45.2, reel: +1.5, renk: '#6c5ce7' },
              { ad: 'Altın', nominal: 52.1, reel: +6.4, renk: '#f0b429' },
              { ad: 'Tahvil (Devlet)', nominal: 38.5, reel: -3.2, renk: '#00d4aa' },
              { ad: 'Mevduat (TL)', nominal: 32.0, reel: -7.7, renk: 'var(--loss)' },
            ].map(a => (
              <div key={a.ad}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span>{a.ad}</span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>Nominal: +{a.nominal}%</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: a.reel > 0 ? 'var(--profit)' : 'var(--loss)' }}>
                      Reel: {a.reel > 0 ? '+' : ''}{a.reel}%
                    </span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${Math.min(a.nominal, 100)}%`, background: a.reel > 0 ? 'var(--profit)' : 'var(--loss)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temalar */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}><span className={styles.cardTitle}>Yatırım Temaları & Hazır Portföy Paketleri</span></div>
        <div className={styles.cardBody}>
          <div className={styles.grid4}>
            {TEMALAR.map((t, i) => (
              <div
                key={t.ad}
                onClick={() => setAktifTema(aktifTema === i ? null : i)}
                style={{ padding: '1.25rem', background: aktifTema === i ? `${t.renk}15` : 'var(--bg-card)', border: `1px solid ${aktifTema === i ? t.renk + '55' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: '0.3rem' }}>{t.ad}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: t.renk, marginBottom: '0.3rem' }}>{t.getiri}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Risk: {t.risk}</div>
                {aktifTema === i && (
                  <button className="btn btn-primary" style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.75rem' }}>Bu Paketi Seç</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temettü Takvimi */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}><span className={styles.cardTitle}>Temettü Takvimi & Gelir Tahmini</span></div>
        <div className={styles.cardBody}>
          <table className={styles.table}>
            <thead><tr><th>Ödeme Tarihi</th><th>Hisse</th><th>Tahmini Tutar</th><th>Hisse Başına</th></tr></thead>
            <tbody>
              {TEMETU.map(t => (
                <tr key={t.sembol}>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{t.tarih}</td>
                  <td style={{ fontWeight: 700 }}>{t.sembol}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 700 }}>+₺{t.tutar.toLocaleString('tr-TR')}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>₺{t.hisseBasina}</td>
                </tr>
              ))}
              <tr style={{ background: 'var(--bg-card)' }}>
                <td colSpan={2} style={{ fontWeight: 700 }}>Toplam Tahmini Temettü</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', fontSize: '0.95rem' }}>+₺{TEMETU.reduce((s, t) => s + t.tutar, 0).toLocaleString('tr-TR')}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
