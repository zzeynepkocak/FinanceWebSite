import { useState } from 'react'
import styles from './SharedPage.module.css'

const METRIKLER = {
  sharpe: 1.84,
  sortino: 2.21,
  volatilite: 12.4,
  maxDrawdown: -8.7,
  alpha: 3.2,
  beta: 0.78,
  portfoyGetiri12ay: 28.4,
  bist100: 18.2,
  altin: 31.2,
  dolar: 22.8,
}

const KARSILASTIRMA = [
  { isim: 'Portföyünüz', getiri12ay: 28.4, getiri3ay: 8.2, getiri1ay: 2.1, renk: '#00d4aa', volatilite: 12.4, sharpe: 1.84 },
  { isim: 'BIST100', getiri12ay: 18.2, getiri3ay: 4.1, getiri1ay: 0.8, renk: '#0066ff', volatilite: 18.6, sharpe: 0.98 },
  { isim: 'Altın (TL)', getiri12ay: 31.2, getiri3ay: 9.8, getiri1ay: 2.4, renk: '#e5a800', volatilite: 14.2, sharpe: 2.20 },
  { isim: 'USD/TL', getiri12ay: 22.8, getiri3ay: 5.2, getiri1ay: 1.2, renk: '#00a651', volatilite: 9.8, sharpe: 2.33 },
  { isim: 'MSCI Turkey', getiri12ay: 15.4, getiri3ay: 3.4, getiri1ay: 0.5, renk: '#9945ff', volatilite: 20.1, sharpe: 0.77 },
]

// 12 aylık getiri serileri (indeks = 100 başlangıç)
const AYLAR = ['May 25', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara', 'Oca 26', 'Şub', 'Mar', 'Nis', 'May']
const GETIRI_SERISI = {
  portfoy: [100, 103, 108, 106, 112, 118, 115, 122, 128, 124, 131, 126, 128.4],
  bist100: [100, 101, 104, 102, 106, 110, 108, 112, 116, 113, 117, 115, 118.2],
  altin: [100, 104, 109, 107, 114, 120, 118, 125, 130, 127, 134, 128, 131.2],
}

const DRAWDOWN_SERISI = [0, -1.2, -2.1, -3.4, -1.8, -5.2, -8.7, -6.3, -3.1, -4.8, -2.2, -1.5, -0.8]

export function PerformansPage() {
  const [aktifTab, setAktifTab] = useState('ozet')

  const chartH = 180, chartW = 580, padL = 8, padR = 8, padT = 20, padB = 20

  const seriesPath = (data: number[], color: string) => {
    const minV = 95, maxV = 140
    const pts = data.map((v, i) => {
      const x = padL + (i / (data.length - 1)) * (chartW - padL - padR)
      const y = chartH - padB - ((v - minV) / (maxV - minV)) * (chartH - padT - padB)
      return `${x},${y}`
    })
    return <polyline key={color} points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  }

  const drawdownPath = () => {
    const minV = -10, maxV = 2
    const pts = DRAWDOWN_SERISI.map((v, i) => {
      const x = padL + (i / (DRAWDOWN_SERISI.length - 1)) * (chartW - padL - padR)
      const y = chartH - padB - ((v - minV) / (maxV - minV)) * (chartH - padT - padB)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
    const zeroY = chartH - padB - ((0 - minV) / (maxV - minV)) * (chartH - padT - padB)
    const areaClose = `L ${padL + (chartW - padL - padR)} ${zeroY} L ${padL} ${zeroY} Z`
    return { line: pts, area: `${pts} ${areaClose}`, zeroY }
  }

  const dd = drawdownPath()

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Performans Analitiği</h1>
          <p className={styles.pageSub}>Portföy performansı ve kıyaslama metrikleri</p>
        </div>
        <button className="btn btn-primary">Rapor İndir</button>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sharpe Oranı</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>{METRIKLER.sharpe}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>{'İyi (>1)'}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Volatilite</span>
          <span className={styles.metricValue}>%{METRIKLER.volatilite}</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>Yıllık</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Max Drawdown</span>
          <span className={styles.metricValue} style={{ color: 'var(--loss)' }}>%{METRIKLER.maxDrawdown}</span>
          <span className={`${styles.metricChange} ${styles.down}`}>En büyük düşüş</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>12 Ay Getiri</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>+%{METRIKLER.portfoyGetiri12ay}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>BIST100: +%{METRIKLER.bist100}</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'ozet', l: 'Genel Bakış' },
          { k: 'karsilastir', l: 'Kıyaslama' },
          { k: 'drawdown', l: 'Drawdown' },
          { k: 'risk', l: 'Risk Metrikleri' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'ozet' && (
        <>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>12 Aylık Getiri Karşılaştırması (İndeks = 100)</span></div>
            <div className={styles.cardBody}>
              <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
                {/* Gridlines */}
                {[100, 110, 120, 130].map(v => {
                  const y = chartH - padB - ((v - 95) / (140 - 95)) * (chartH - padT - padB)
                  return <line key={v} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                })}
                {seriesPath(GETIRI_SERISI.portfoy, '#00d4aa')}
                {seriesPath(GETIRI_SERISI.bist100, '#0066ff')}
                {seriesPath(GETIRI_SERISI.altin, '#e5a800')}
                {/* Legend */}
                {[['Portföy', '#00d4aa'], ['BIST100', '#0066ff'], ['Altın', '#e5a800']].map(([l, c], i) => (
                  <g key={i}>
                    <rect x={10 + i * 90} y={6} width={14} height={4} fill={c as string} rx={2} />
                    <text x={28 + i * 90} y={12} fill="var(--text-dim)" fontSize="10">{l}</text>
                  </g>
                ))}
                {/* X labels */}
                {AYLAR.filter((_, i) => i % 3 === 0).map((ay, idx) => (
                  <text key={idx} x={padL + (idx * 3 / (AYLAR.length - 1)) * (chartW - padL - padR)} y={chartH - 4} textAnchor="middle" fill="var(--text-dim)" fontSize="9">{ay}</text>
                ))}
              </svg>
            </div>
          </div>

          <div className={styles.grid4}>
            {[
              { l: 'Alpha', v: `+${METRIKLER.alpha}%`, ac: 'Piyasaya göre fazla getiri', c: 'var(--profit)' },
              { l: 'Beta', v: `${METRIKLER.beta}`, ac: 'Piyasa hassasiyeti (1=eşit)', c: 'var(--text)' },
              { l: 'Sortino Oranı', v: `${METRIKLER.sortino}`, ac: 'Aşağı yönlü risk düzeltmeli', c: 'var(--profit)' },
              { l: 'Bilgi Oranı', v: '0.92', ac: 'Aktif yönetim etkinliği', c: 'var(--accent)' },
            ].map((m, i) => (
              <div key={i} className={styles.metricCard}>
                <span className={styles.metricLabel}>{m.l}</span>
                <span className={styles.metricValue} style={{ color: m.c }}>{m.v}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{m.ac}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {aktifTab === 'karsilastir' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Kıyaslama Tablosu</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>Enstrüman</th><th>1 Aylık</th><th>3 Aylık</th><th>12 Aylık</th><th>Volatilite</th><th>Sharpe</th></tr>
            </thead>
            <tbody>
              {KARSILASTIRMA.map((k, i) => (
                <tr key={i} style={{ fontWeight: i === 0 ? 700 : 400 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: k.renk, flexShrink: 0 }}></div>
                      <span>{k.isim}</span>
                      {i === 0 && <span style={{ padding: '0.1rem 0.4rem', background: 'var(--accent-dim)', color: 'var(--accent)', borderRadius: 4, fontSize: '0.65rem', fontWeight: 700 }}>Sizin</span>}
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)' }}>+%{k.getiri1ay}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)' }}>+%{k.getiri3ay}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 700 }}>+%{k.getiri12ay}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>%{k.volatilite}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: k.sharpe > 1.5 ? 'var(--profit)' : k.sharpe > 1 ? 'var(--accent)' : 'var(--warning)', fontWeight: 600 }}>{k.sharpe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'drawdown' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Maksimum Drawdown Analizi</span></div>
          <div className={styles.cardBody}>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,71,87,0)" />
                  <stop offset="100%" stopColor="rgba(255,71,87,0.35)" />
                </linearGradient>
              </defs>
              {/* Zero line */}
              <line x1={padL} y1={dd.zeroY} x2={chartW - padR} y2={dd.zeroY} stroke="var(--border)" strokeWidth="1" />
              <text x={chartW - padR - 2} y={dd.zeroY - 4} textAnchor="end" fill="var(--text-dim)" fontSize="9">0%</text>
              {/* Max drawdown line */}
              {(() => {
                const minV = -10, maxV = 2
                const maxDDY = chartH - padB - ((-8.7 - minV) / (maxV - minV)) * (chartH - padT - padB)
                return <>
                  <line x1={padL} y1={maxDDY} x2={chartW - padR} y2={maxDDY} stroke="var(--loss)" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={padL + 4} y={maxDDY - 4} fill="var(--loss)" fontSize="9">Max DD: -8.7%</text>
                </>
              })()}
              <path d={dd.area} fill="url(#ddGrad)" />
              <path d={dd.line} fill="none" stroke="var(--loss)" strokeWidth="2" strokeLinejoin="round" />
              {AYLAR.filter((_, i) => i % 3 === 0).map((ay, idx) => (
                <text key={idx} x={padL + (idx * 3 / (AYLAR.length - 1)) * (chartW - padL - padR)} y={chartH - 4} textAnchor="middle" fill="var(--text-dim)" fontSize="9">{ay}</text>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { l: 'Max Drawdown', v: '-8.7%', c: 'var(--loss)' },
                { l: 'Drawdown Süresi', v: '47 gün', c: 'var(--warning)' },
                { l: 'Recovery Süresi', v: '28 gün', c: 'var(--profit)' },
                { l: 'Calmar Oranı', v: '3.26', c: 'var(--profit)' },
              ].map((r, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{r.l}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.c }}>{r.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'risk' && (
        <div className={styles.grid2}>
          {[
            { baslik: 'Risk-Getiri Metrikleri', metrikler: [
              { l: 'Sharpe Oranı', v: '1.84', ac: '>1 = iyi, >2 = mükemmel', c: 'var(--profit)' },
              { l: 'Sortino Oranı', v: '2.21', ac: 'Aşağı yönlü volatilite düzeltmeli', c: 'var(--profit)' },
              { l: 'Treynor Oranı', v: '0.364', ac: 'Beta başına fazla getiri', c: 'var(--accent)' },
              { l: 'Bilgi Oranı', v: '0.92', ac: 'Aktif yönetim değeri', c: 'var(--accent)' },
            ]},
            { baslik: 'Piyasa Riski', metrikler: [
              { l: 'Beta (BIST100)', v: '0.78', ac: 'Piyasadan %22 az hassas', c: 'var(--text)' },
              { l: 'Alpha (Yıllık)', v: '+3.2%', ac: 'Piyasa üzeri fazla getiri', c: 'var(--profit)' },
              { l: 'Korelasyon (BIST)', v: '0.62', ac: 'Orta korelasyon', c: 'var(--warning)' },
              { l: 'R² (Açıklama Gücü)', v: '%38.4', ac: 'Piyasa etkisi oranı', c: 'var(--text-dim)' },
            ]},
          ].map((grup, gi) => (
            <div key={gi} className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>{grup.baslik}</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {grup.metrikler.map((m, i) => (
                  <div key={i} style={{ padding: '0.65rem 0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{m.l}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{m.ac}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: m.c }}>{m.v}</span>
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
