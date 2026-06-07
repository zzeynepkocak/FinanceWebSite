import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

/* ── Mock data ── */
const KATEGORILER = [
  { ad: 'Market & Gıda',    butce: 8000, harcanan: 6240, renk: '#00d4aa', icon: '🛒' },
  { ad: 'Faturalar',         butce: 5000, harcanan: 4820, renk: '#0066ff', icon: '⚡' },
  { ad: 'Ulaşım',            butce: 3000, harcanan: 2100, renk: '#f0b429', icon: '🚗' },
  { ad: 'Sağlık',            butce: 2000, harcanan: 850,  renk: '#e17055', icon: '🏥' },
  { ad: 'Eğlence',           butce: 2500, harcanan: 3200, renk: '#6c5ce7', icon: '🎬' },
  { ad: 'Giyim & Alışveriş', butce: 3000, harcanan: 1400, renk: '#fd79a8', icon: '👗' },
  { ad: 'Abonelikler',       butce: 1000, harcanan: 898,  renk: '#74b9ff', icon: '📺' },
  { ad: 'Eğitim',            butce: 1500, harcanan: 0,    renk: '#55efc4', icon: '📚' },
]

const AYLIK_TREND = [
  { ay: 'Oca', gelir: 45000, gider: 32000 },
  { ay: 'Şub', gelir: 45000, gider: 29500 },
  { ay: 'Mar', gelir: 48000, gider: 35000 },
  { ay: 'Nis', gelir: 45000, gider: 31000 },
  { ay: 'May', gelir: 52000, gider: 33000 },
  { ay: 'Haz', gelir: 45000, gider: 28000 },
]

const TASARRUF_HEDEFLERI = [
  { ad: 'Araba Fonu', hedef: 150000, birikim: 87000, renk: '#0066ff', ikon: '🚗' },
  { ad: 'Tatil Fonu', hedef: 30000,  birikim: 18500, renk: '#00d4aa', ikon: '✈' },
  { ad: 'Acil Fon',   hedef: 50000,  birikim: 50000, renk: '#f0b429', ikon: '🆘' },
  { ad: 'Ev Fonu',    hedef: 500000, birikim: 62000, renk: '#6c5ce7', ikon: '🏠' },
]

const ABONELIKLER = [
  { ad: 'Netflix', tutar: 149, renk: '#e50914' },
  { ad: 'Spotify', tutar: 39,  renk: '#1db954' },
  { ad: 'ChatGPT', tutar: 219, renk: '#10a37f' },
  { ad: 'iCloud',  tutar: 49,  renk: '#0066ff' },
  { ad: 'YouTube', tutar: 99,  renk: '#ff0000' },
]

const NAKIT_AKIS = [
  { gun: '1', giris: 0, cikis: 500 },
  { gun: '5', giris: 45000, cikis: 1200 },
  { gun: '10', giris: 0, cikis: 4820 },
  { gun: '15', giris: 0, cikis: 2100 },
  { gun: '20', giris: 0, cikis: 3200 },
  { gun: '25', giris: 5000, cikis: 1800 },
  { gun: '30', giris: 0, cikis: 2400 },
]

const BORÇ_ODEME = [
  { ay: 'Haz', taksit: 2800, faiz: 420, anapara: 2380 },
  { ay: 'Tem', taksit: 2800, faiz: 398, anapara: 2402 },
  { ay: 'Ağu', taksit: 2800, faiz: 374, anapara: 2426 },
  { ay: 'Eyl', taksit: 2800, faiz: 349, anapara: 2451 },
  { ay: 'Eki', taksit: 2800, faiz: 323, anapara: 2477 },
  { ay: 'Kas', taksit: 2800, faiz: 296, anapara: 2504 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem 0.85rem', fontSize: '0.78rem' }}>
      <div style={{ color: 'var(--text-dim)', marginBottom: '0.35rem' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, fontFamily: 'var(--font-mono)' }}>
          {p.name}: ₺{Number(p.value).toLocaleString('tr-TR')}
        </div>
      ))}
    </div>
  )
}

export function ButcePage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('genel')
  const toplamButce = KATEGORILER.reduce((s, k) => s + k.butce, 0)
  const toplamHarcanan = KATEGORILER.reduce((s, k) => s + k.harcanan, 0)
  const tasarruf = 52000 - toplamHarcanan > 0 ? 52000 - toplamHarcanan : 0

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bütçe & Tasarruf Planlama</h1>
          <p className={styles.pageSub}>Mayıs 2026 — Kalan 1 gün</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Yeni bütçe kategorisi eklendi', 'success')}>+ Bütçe Kategorisi Ekle</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Özet kartları */}
      <div className={styles.metricsRow}>
        {[
          { label: 'Aylık Gelir', value: '₺52.000', change: '+15.6%', up: true },
          { label: 'Toplam Bütçe', value: `₺${toplamButce.toLocaleString('tr-TR')}`, change: 'Belirlendi', up: true },
          { label: 'Harcanan', value: `₺${toplamHarcanan.toLocaleString('tr-TR')}`, change: `${((toplamHarcanan/toplamButce)*100).toFixed(0)}% kullanıldı`, up: toplamHarcanan <= toplamButce },
          { label: 'Kalan Tasarruf', value: `₺${tasarruf.toLocaleString('tr-TR')}`, change: 'Bu ay', up: true },
        ].map(m => (
          <div key={m.label} className={styles.metricCard}>
            <span className={styles.metricLabel}>{m.label}</span>
            <span className={styles.metricValue} style={{ fontSize: '1.2rem' }}>{m.value}</span>
            <span className={`${styles.metricChange} ${m.up ? styles.up : styles.down}`}>{m.change}</span>
          </div>
        ))}
      </div>

      <div className={styles.tabs}>
        {['genel', 'kategoriler', 'tasarruf', 'abonelikler', 'borc', 'aile'].map(t => (
          <button key={t} className={`${styles.tab} ${aktifTab === t ? styles.tabActive : ''}`} onClick={() => setAktifTab(t)}>
            {{ genel: 'Genel', kategoriler: 'Kategoriler', tasarruf: 'Tasarruf Hedefleri', abonelikler: 'Abonelikler', borc: 'Borç Planlayıcı', aile: 'Aile Bütçesi' }[t]}
          </button>
        ))}
      </div>

      {/* ── Genel ── */}
      {aktifTab === 'genel' && (
        <div className={styles.grid2}>
          {/* Gelir-Gider Trend */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Gelir – Gider Trendi (6 Ay)</span></div>
            <div className={styles.cardBody}>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={AYLIK_TREND}>
                  <defs>
                    <linearGradient id="gelirG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="giderG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff4757" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="ay" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="gelir" stroke="#00d4aa" strokeWidth={2} fill="url(#gelirG)" name="Gelir"/>
                  <Area type="monotone" dataKey="gider" stroke="#ff4757" strokeWidth={2} fill="url(#giderG)" name="Gider"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Nakit Akışı 30 Gün */}
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Bu Ay Nakit Akışı</span></div>
            <div className={styles.cardBody}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={NAKIT_AKIS}>
                  <XAxis dataKey="gun" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="giris" name="Giriş" fill="#00d4aa" radius={[3,3,0,0]} />
                  <Bar dataKey="cikis" name="Çıkış" fill="#ff4757" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Kategoriler ── */}
      {aktifTab === 'kategoriler' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Kategori Bazlı Bütçe Kullanımı</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--profit)' }}>■ Bütçe içinde</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--loss)' }}>■ Bütçe aşıldı</span>
            </div>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {KATEGORILER.map(k => {
              const pct = Math.min((k.harcanan / k.butce) * 100, 100)
              const asim = k.harcanan > k.butce
              const kalan = k.butce - k.harcanan
              return (
                <div key={k.ad}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{k.icon} {k.ad}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: asim ? 'var(--loss)' : 'var(--text)' }}>
                      ₺{k.harcanan.toLocaleString('tr-TR')} / ₺{k.butce.toLocaleString('tr-TR')}
                      {asim && <span style={{ color: 'var(--loss)', marginLeft: '0.4rem', fontSize: '0.72rem' }}>
                        ▲ ₺{(k.harcanan - k.butce).toLocaleString('tr-TR')} aşım
                      </span>}
                      {!asim && <span style={{ color: 'var(--text-dim)', marginLeft: '0.4rem', fontSize: '0.72rem' }}>
                        ₺{kalan.toLocaleString('tr-TR')} kaldı
                      </span>}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${pct}%`, background: asim ? 'var(--loss)' : k.renk }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Tasarruf Hedefleri ── */}
      {aktifTab === 'tasarruf' && (
        <div className={styles.grid2}>
          {TASARRUF_HEDEFLERI.map(h => {
            const pct = Math.min((h.birikim / h.hedef) * 100, 100)
            const kalan = h.hedef - h.birikim
            const tamamlandi = h.birikim >= h.hedef
            return (
              <div key={h.ad} className={styles.sectionCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{h.ikon} {h.ad}</span>
                  {tamamlandi && <span style={{ fontSize: '0.72rem', color: 'var(--profit)', fontWeight: 700 }}>✓ Tamamlandı!</span>}
                </div>
                <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Birikim</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: h.renk }}>₺{h.birikim.toLocaleString('tr-TR')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Hedef</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>₺{h.hedef.toLocaleString('tr-TR')}</span>
                  </div>
                  <div>
                    <div className={styles.progressBar} style={{ height: 10 }}>
                      <div className={styles.progressFill} style={{ width: `${pct}%`, background: h.renk }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                      <span>{pct.toFixed(0)}%</span>
                      {!tamamlandi && <span>Kalan: ₺{kalan.toLocaleString('tr-TR')}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>Para Ekle</button>
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>Otomatik Birikim</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Abonelikler ── */}
      {aktifTab === 'abonelikler' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Sabit Giderler & Abonelik Takibi</span>
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--loss)', fontWeight: 600 }}>
              Aylık: ₺{ABONELIKLER.reduce((s, a) => s + a.tutar, 0).toLocaleString('tr-TR')}
            </span>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {ABONELIKLER.map(a => (
              <div key={a.ad} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.renk }}></div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 500 }}>{a.ad}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₺{a.tutar}/ay</span>
                  <button className="btn btn-danger" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}>İptal</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Borç Planlayıcısı ── */}
      {aktifTab === 'borc' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Borç Ödeme Planlayıcısı — Kartopu Yöntemi</span></div>
          <div className={styles.cardBody}>
            <div className={styles.alertCard} style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.25)' }}>
              <span>💡</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Kartopu yönteminde en küçük borçtan başlayarak sırayla kapatılır. Her kapatılan borcun taksiti bir sonrakine eklenir.
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BORÇ_ODEME}>
                <XAxis dataKey="ay" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="anapara" name="Anapara" fill="#00d4aa" radius={[0,0,0,0]} stackId="a"/>
                <Bar dataKey="faiz" name="Faiz" fill="#ff4757" radius={[3,3,0,0]} stackId="a"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Aile Bütçesi ── */}
      {aktifTab === 'aile' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Aile / Ortak Hesap Bütçe Paylaşımı</span>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>+ Üye Davet Et</button>
          </div>
          <div className={styles.cardBody}>
            {[
              { ad: 'Ahmet Yılmaz', rol: 'Hesap Sahibi', harcama: 18400, limit: 30000, avatar: 'AY' },
              { ad: 'Fatma Yılmaz', rol: 'Ortak Hesap', harcama: 9800, limit: 15000, avatar: 'FY' },
              { ad: 'Ali Yılmaz',   rol: 'Çocuk Hesabı', harcama: 840, limit: 2000, avatar: 'AL' },
            ].map(u => (
              <div key={u.ad} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent)', display: 'grid', placeItems: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                  {u.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{u.ad}</span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      ₺{u.harcama.toLocaleString('tr-TR')} / ₺{u.limit.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${(u.harcama/u.limit)*100}%` }}></div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{u.rol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
