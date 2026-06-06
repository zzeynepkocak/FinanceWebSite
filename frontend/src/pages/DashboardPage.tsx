import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/KeycloakProvider'
import { paths } from '../routes/paths'
import styles from './DashboardPage.module.css'

/* ── Mock data ── */
const METRICS = [
  { label: 'Toplam Varlık', value: '₺2.847.340', maskedValue: '₺ ••••••', change: '+3.42%', up: true, spark: [42, 44, 41, 47, 50, 48, 55, 53, 58, 62, 60, 65] },
  { label: 'Günlük K/Z', value: '+₺94.280', maskedValue: '+₺ •••••', change: '+3.42%', up: true, spark: [30, 32, 28, 35, 38, 36, 40, 38, 42, 45, 44, 47] },
  { label: 'USD/TRY', value: '38,42', maskedValue: '38,42', change: '+0.15%', up: true, spark: [36, 37, 36.5, 37.2, 37.8, 38, 38.1, 38.3, 38.2, 38.4, 38.5, 38.42] },
  { label: 'BIST 100', value: '13.915', maskedValue: '13.915', change: '+0.28%', up: true, spark: [130, 135, 132, 138, 140, 137, 142, 139, 141, 138, 140, 139] },
]

const MARKETS = [
  { sym: 'GARAN', name: 'Garanti BBVA', price: '98,40', chg: '+2.15%', up: true },
  { sym: 'THYAO', name: 'Türk Hava Yolları', price: '287,50', chg: '-0.85%', up: false },
  { sym: 'ASELS', name: 'Aselsan', price: '44,30', chg: '+0.90%', up: true },
  { sym: 'AKBNK', name: 'Akbank', price: '52,80', chg: '+1.45%', up: true },
  { sym: 'KCHOL', name: 'Koç Holding', price: '125,40', chg: '+0.95%', up: true },
  { sym: 'BTC',   name: 'Bitcoin', price: '65.200', chg: '+4.20%', up: true },
]

const PORTFOLIO = [
  { label: 'Hisseler', pct: 52, color: '#0066ff' },
  { label: 'Döviz',    pct: 20, color: '#00d4aa' },
  { label: 'Kripto',   pct: 16, color: '#6c5ce7' },
  { label: 'Tahvil',   pct: 12, color: '#f0b429' },
]

const NEWS = [
  { title: 'TCMB faiz kararı beklentileri artıyor', time: '14:22', tag: 'Makro' },
  { title: 'BIST 100 rekor kırma çabasında', time: '13:45', tag: 'Borsa' },
  { title: 'Dolar/TL 38,50 direncini test ediyor', time: '12:08', tag: 'Döviz' },
  { title: 'THY 3. çeyrek kâr açıklaması bugün', time: '11:30', tag: 'Şirket' },
]

const SON_ISLEMLER = [
  { aciklama: 'GARAN Alış', tutar: +50000, zaman: '14:22', tip: 'Alış' },
  { aciklama: 'Elektrik Faturası', tutar: -820, zaman: '13:10', tip: 'Ödeme' },
  { aciklama: 'Bitcoin Alış', tutar: +25000, zaman: '09:30', tip: 'Kripto' },
  { aciklama: 'Netflix Abonelik', tutar: -299, zaman: 'Dün', tip: 'Abonelik' },
]

const GELECEK_ODEMELER = [
  { aciklama: 'Akbank Kredi Taksit', tarih: '05 Haz', tutar: 2800, renk: '#e17055' },
  { aciklama: 'Dogalgaz Faturası', tarih: '10 Haz', tutar: 1240, renk: '#f0b429' },
  { aciklama: 'BES Aylık Katkı', tarih: '15 Haz', tutar: 1000, renk: '#6c5ce7' },
  { aciklama: 'Konut Sigortası', tarih: '20 Haz', tutar: 3500, renk: '#0066ff' },
]

/* ── Sparkline SVG ── */
function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const w = 120, h = 36
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  const color = up ? 'var(--profit)' : 'var(--loss)'
  const ptsArr = pts.split(' ')
  const last = ptsArr[ptsArr.length - 1]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${up})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={last.split(',')[0]} cy={last.split(',')[1]} r="2.5" fill={color} />
    </svg>
  )
}

/* ── Mini Donut ── */
function Donut({ data }: { data: typeof PORTFOLIO }) {
  let offset = 0
  const segments = data.map(({ pct, color }) => {
    const d = (pct / 100) * 100
    const seg = { d, color, offset }
    offset += d
    return seg
  })
  return (
    <svg viewBox="0 0 36 36" width="110" height="110" className={styles.donutSvg}>
      {segments.map((s, i) => (
        <circle key={i} cx="18" cy="18" r="15.9" fill="none" stroke={s.color} strokeWidth="3.2"
          strokeDasharray={`${s.d} ${100 - s.d}`} strokeDashoffset={-s.offset}
          transform="rotate(-90 18 18)" />
      ))}
      <text x="18" y="18" textAnchor="middle" dominantBaseline="middle"
        fill="var(--text)" fontSize="5" fontFamily="var(--font-mono)">100%</text>
    </svg>
  )
}

/* ── Finansal Sağlık Skoru ── */
function HealthScore({ score }: { score: number }) {
  const r = 40, cx = 50, cy = 55, sw = 8
  const circ = 2 * Math.PI * r
  const pct = score / 100
  const color = score >= 80 ? 'var(--profit)' : score >= 60 ? '#f0b429' : 'var(--loss)'
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 100 70" width={120} height={84}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="var(--border)" strokeWidth={sw} strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${pct * circ / 2} ${circ}`} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="800"
          fill={color} fontFamily="var(--font-mono)">{score}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="var(--text-dim)" fontFamily="var(--font-body)">Finansal Skor</text>
      </svg>
      <div style={{ fontSize: '0.72rem', color, fontWeight: 600 }}>
        {score >= 80 ? 'Mükemmel' : score >= 60 ? 'İyi' : 'Geliştirilebilir'}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════ */

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [hidden, setHidden] = useState(false)
  const [transferModal, setTransferModal] = useState(false)
  const [transferIban, setTransferIban] = useState('')
  const [transferTutar, setTransferTutar] = useState('')
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [transferError, setTransferError] = useState('')
  const now = new Date().toLocaleString('tr-TR', {
    day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
  })

  const handleTransfer = () => {
    setTransferError('')
    if (!transferIban.trim()) { setTransferError('Lütfen IBAN giriniz'); return }
    if (!transferTutar || Number(transferTutar) <= 0) { setTransferError('Geçerli bir tutar giriniz'); return }
    setTransferSuccess(true)
    setTimeout(() => {
      setTransferModal(false)
      setTransferSuccess(false)
      setTransferIban('')
      setTransferTutar('')
    }, 2000)
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            Hoş geldin, <span>{user?.firstName ?? 'Kullanıcı'}</span> 👋
          </h1>
          <p className={styles.pageSub}>{now} — <span style={{ color: 'var(--profit)' }}>● Piyasa Açık</span></p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => setTransferModal(true)}>
            ↔ Transfer
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '0.78rem' }} onClick={() => navigate(paths.islemGecmisi)}>
            📋 İşlemler
          </button>
          <button className="btn btn-primary" style={{ fontSize: '0.78rem' }} onClick={() => navigate(paths.piyasa)}>
            📈 Piyasaları İncele
          </button>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className={styles.metricsRow}>
        {METRICS.map((m) => (
          <div key={m.label} className={styles.metricCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className={styles.metricLabel}>{m.label}</span>
              {m.label === 'Toplam Varlık' && (
                <button
                  onClick={() => setHidden(!hidden)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.85rem', padding: 0 }}
                  title={hidden ? 'Göster' : 'Gizle'}
                >
                  {hidden ? '👁' : '🙈'}
                </button>
              )}
            </div>
            <span className={styles.metricValue}>{hidden ? m.maskedValue : m.value}</span>
            <span className={`${styles.metricChange} ${m.up ? styles.up : styles.down}`}>
              {m.up ? '▲' : '▼'} {m.change}
            </span>
            <div className={styles.metricSpark}>
              <Sparkline data={m.spark} up={m.up} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Hızlı Aksiyonlar ── */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
        {[
          { icon: '↑', label: 'Para Gönder', path: paths.islemGecmisi, color: '#0066ff' },
          { icon: '↓', label: 'Para Al', path: paths.islemGecmisi, color: '#00d4aa' },
          { icon: '↔', label: 'Transfer', path: paths.islemGecmisi, color: '#6c5ce7' },
          { icon: '🛒', label: 'Al/Sat', path: paths.piyasa, color: '#f0b429' },
          { icon: '💳', label: 'Kartlarım', path: paths.kartlarim, color: '#e17055' },
          { icon: '📊', label: 'Analiz', path: paths.analiz, color: '#74b9ff' },
          { icon: '🔐', label: '2FA', path: paths.twoFactor, color: '#fd79a8' },
          { icon: '⚙', label: 'Ayarlar', path: paths.ayarlar, color: 'var(--text-dim)' },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--text-muted)', transition: 'all 0.15s', minWidth: 70 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = a.color; (e.currentTarget as HTMLElement).style.color = a.color }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            <span style={{ fontSize: '1.2rem' }}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>

      {/* ── Row 2: Markets + Portfolio + Health Score ── */}
      <div className={styles.grid3}>
        {/* Markets mini table */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Piyasa Özeti</span>
            <button className={styles.cardAction} onClick={() => navigate(paths.piyasa)}>Tümü →</button>
          </div>
          <div className={styles.cardBody}>
            <table className={styles.miniTable}>
              <thead><tr><th>Sembol</th><th>Fiyat</th><th style={{ textAlign: 'right' }}>Değişim</th></tr></thead>
              <tbody>
                {MARKETS.map((r) => (
                  <tr key={r.sym}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{r.sym}</div>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-dim)' }}>{r.name}</div>
                    </td>
                    <td className={styles.tPrice}>{hidden ? '••••' : r.price}</td>
                    <td className={r.up ? styles.tUp : styles.tDown} style={{ textAlign: 'right' }}>
                      {r.up ? '▲' : '▼'} {r.chg}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio donut */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Varlık Dağılımı</span>
            <button className={styles.cardAction} onClick={() => navigate(paths.portfoyum)}>Detay →</button>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.donutWrap}>
              <Donut data={PORTFOLIO} />
              <div className={styles.donutLegend}>
                {PORTFOLIO.map((p) => (
                  <div key={p.label} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: p.color }} />
                    <span className={styles.legendLabel}>{p.label}</span>
                    <span className={styles.legendPct}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Finansal Sağlık</span>
            <button className={styles.cardAction} onClick={() => navigate(paths.stresTesti)}>Detay →</button>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <HealthScore score={74} />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Acil Fon', pct: 84, color: 'var(--profit)' },
                { label: 'Bütçe', pct: 72, color: '#f0b429' },
                { label: 'Sigorta', pct: 55, color: 'var(--loss)' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{s.label}</span>
                    <span style={{ color: s.color, fontFamily: 'var(--font-mono)' }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 100 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: P/L + Son İşlemler + Gelecek Ödemeler ── */}
      <div className={styles.grid3}>
        {/* P/L */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Kâr / Zarar Özeti</span></div>
          <div className={styles.cardBody}>
            <div className={styles.plGrid}>
              {[
                { label: 'Günlük K/Z', value: hidden ? '+₺ •••' : '+₺94.280', cls: 'up' },
                { label: 'Haftalık K/Z', value: hidden ? '+₺ •••' : '+₺218.450', cls: 'up' },
                { label: 'Aylık K/Z', value: hidden ? '+₺ •••' : '+₺384.720', cls: 'up' },
                { label: 'Yıllık K/Z', value: hidden ? '+₺ ••••' : '+₺1.24M', cls: 'up' },
              ].map((i) => (
                <div key={i.label} className={styles.plItem}>
                  <div className={styles.plItemLabel}>{i.label}</div>
                  <div className={`${styles.plItemValue} ${styles[i.cls]}`}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Son İşlemler */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Son İşlemler</span>
            <button className={styles.cardAction} onClick={() => navigate(paths.islemGecmisi)}>Tümü →</button>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SON_ISLEMLER.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: i < SON_ISLEMLER.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t.aciklama}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{t.zaman} · {t.tip}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.84rem', color: t.tutar > 0 ? 'var(--profit)' : 'var(--loss)' }}>
                  {t.tutar > 0 ? '+' : ''}{hidden ? '•••' : `₺${Math.abs(t.tutar).toLocaleString('tr-TR')}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gelecek Ödemeler */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Gelecek Ödemeler</span>
            <button className={styles.cardAction} onClick={() => navigate(paths.faturaVergi)}>Tümü →</button>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {GELECEK_ODEMELER.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: o.renk, flexShrink: 0 }}></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.aciklama}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{o.tarih}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--loss)', flexShrink: 0 }}>
                  {hidden ? '•••' : `-₺${o.tutar.toLocaleString('tr-TR')}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Haberler + Nakit Akış Özet ── */}
      <div className={styles.grid2}>
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Son Haberler</span>
            <button className={styles.cardAction} onClick={() => navigate(paths.haberler)}>Tümü →</button>
          </div>
          <div className={styles.cardBody}>
            {NEWS.map((n, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.65rem 0', borderBottom: i < NEWS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-neutral">{n.tag}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{n.time}</span>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.4 }}>{n.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nakit Akış Özet */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Nakit Akışı Özeti — Mayıs 2026</span>
            <button className={styles.cardAction} onClick={() => navigate(paths.nakitAkisi)}>Detay →</button>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, padding: '0.85rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Toplam Giriş</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--profit)' }}>{hidden ? '₺ ••••••' : '+₺52.000'}</div>
              </div>
              <div style={{ flex: 1, padding: '0.85rem', background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.15)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>Toplam Çıkış</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--loss)' }}>{hidden ? '₺ ••••••' : '-₺33.420'}</div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Net Nakit Akışı</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>{hidden ? '+₺ •••' : '+₺18.580'}</span>
              </div>
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ width: '64%', height: '100%', background: 'var(--profit)', borderRadius: 100 }}></div>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>Gelirin %35.7'si tasarruf edildi</div>
            </div>
            {[
              { label: 'Maaş', tutar: '+₺45.000', color: 'var(--profit)' },
              { label: 'Freelance Gelir', tutar: '+₺7.000', color: 'var(--profit)' },
              { label: 'Fatura & Abonelik', tutar: '-₺6.840', color: 'var(--loss)' },
              { label: 'Market & Gıda', tutar: '-₺6.240', color: 'var(--loss)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.3rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.color }}>{hidden ? '•••' : r.tutar}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Transfer Modal ── */}
      {transferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', width: 360, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Hızlı Transfer</h3>
              <button onClick={() => setTransferModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '1.2rem' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {transferSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--profit)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                  <div style={{ fontWeight: 700 }}>Transfer başarıyla gönderildi!</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>₺{Number(transferTutar).toLocaleString('tr-TR')}</div>
                </div>
              ) : (
                <>
                  {transferError && (
                    <div style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid var(--loss)', borderRadius: 6, padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: 'var(--loss)' }}>
                      {transferError}
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>Kaynak Hesap</label>
                    <select style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.82rem', outline: 'none' }}>
                      <option>Garanti TL Hesabı — ₺84.320</option>
                      <option>Yapı Kredi Hesabı — ₺12.500</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>Hedef / IBAN</label>
                    <input value={transferIban} onChange={e => setTransferIban(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} placeholder="TR00 0000 0000 0000 0000 00" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>Tutar (₺)</label>
                    <input type="number" value={transferTutar} onChange={e => setTransferTutar(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-mono)', fontWeight: 700 }} placeholder="0.00" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setTransferModal(false)}>İptal</button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleTransfer}>Transfer Yap</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
