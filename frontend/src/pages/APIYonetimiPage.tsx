import { useState } from 'react'
import styles from './SharedPage.module.css'

const IZINLER = [
  { grup: 'Hesap Bilgileri', izinler: [
    { key: 'accounts:read', ad: 'Hesap Okuma', aciklama: 'Bakiye ve hesap bilgisi', aktif: true },
    { key: 'accounts:write', ad: 'Hesap Yazma', aciklama: 'Hesap ayar değişikliği', aktif: false },
    { key: 'transactions:read', ad: 'İşlem Geçmişi', aciklama: 'Tüm işlemleri listele', aktif: true },
  ]},
  { grup: 'Ödemeler', izinler: [
    { key: 'payments:initiate', ad: 'Ödeme Başlatma', aciklama: 'Transfer ve ödeme emri', aktif: false },
    { key: 'payments:read', ad: 'Ödeme Okuma', aciklama: 'Ödeme durumu sorgulama', aktif: true },
  ]},
  { grup: 'Yatırım', izinler: [
    { key: 'investments:read', ad: 'Portföy Okuma', aciklama: 'Portföy ve fiyat bilgisi', aktif: true },
    { key: 'investments:trade', ad: 'Alım/Satım', aciklama: 'Borsa emirleri', aktif: false },
    { key: 'investments:kyc', ad: 'KYC Sorgu', aciklama: 'Kimlik doğrulama', aktif: false },
  ]},
]

const WEBHOOK_LOGLAR = [
  { id: 'WH-001', url: 'https://api.yourapp.com/hooks/payment', olay: 'payment.completed', durum: 200, zaman: '14:22:08', yanit: '{"ok":true}' },
  { id: 'WH-002', url: 'https://api.yourapp.com/hooks/kyc', olay: 'kyc.approved', durum: 200, zaman: '13:58:44', yanit: '{"ok":true}' },
  { id: 'WH-003', url: 'https://api.yourapp.com/hooks/payment', olay: 'payment.failed', durum: 500, zaman: '13:12:19', yanit: '{"error":"timeout"}' },
  { id: 'WH-004', url: 'https://api.yourapp.com/hooks/account', olay: 'account.updated', durum: 200, zaman: '12:41:07', yanit: '{"ok":true}' },
  { id: 'WH-005', url: 'https://api.yourapp.com/hooks/payment', olay: 'payment.pending', durum: 404, zaman: '11:34:52', yanit: '{"error":"not found"}' },
]

export function APIYonetimiPage() {
  const [ortam, setOrtam] = useState<'sandbox' | 'live'>('sandbox')
  const [izinler, setIzinler] = useState<Record<string, boolean>>(
    Object.fromEntries(IZINLER.flatMap(g => g.izinler).map(i => [i.key, i.aktif]))
  )
  const [ipListesi, setIpListesi] = useState(['192.168.1.1', '10.0.0.0/24', '185.100.50.42'])
  const [yeniIp, setYeniIp] = useState('')
  const [apiKey] = useState('sk_sandbox_8f2a1b4c9d3e7f6g5h2i1j0k')
  const [gizlenmiş, setGizlenmiş] = useState(true)
  const [aktifTab, setAktifTab] = useState('genel')

  const RATE_LIMITLER = [
    { endpoint: 'GET /accounts', limit: '100 istek/dk', kullanim: 42, renk: 'var(--profit)' },
    { endpoint: 'POST /payments', limit: '10 istek/dk', kullanim: 7, renk: 'var(--warning)' },
    { endpoint: 'GET /transactions', limit: '200 istek/dk', kullanim: 88, renk: 'var(--warning)' },
    { endpoint: 'POST /investments/trade', limit: '5 istek/dk', kullanim: 1, renk: 'var(--profit)' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>API & Geliştirici Yönetimi</h1>
          <p className={styles.pageSub}>API anahtarları, izinler ve webhook yönetimi</p>
        </div>
        {/* Sandbox / Live toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.2rem', gap: '0.15rem' }}>
          {(['sandbox', 'live'] as const).map(t => (
            <button key={t} onClick={() => setOrtam(t)} style={{ padding: '0.4rem 1rem', borderRadius: 'calc(var(--radius) - 3px)', border: `1px solid ${ortam === t ? (t === 'live' ? 'rgba(255,71,87,0.3)' : 'var(--border)') : 'transparent'}`, background: ortam === t ? (t === 'live' ? 'rgba(255,71,87,0.1)' : 'var(--bg-surface)') : 'transparent', color: ortam === t ? (t === 'live' ? 'var(--loss)' : 'var(--text)') : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: ortam === t ? 700 : 400 }}>
              {t === 'sandbox' ? '🧪 Sandbox' : '🔴 Live'}
            </button>
          ))}
        </div>
      </div>

      {ortam === 'live' && (
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: 'var(--radius)', fontSize: '0.82rem', color: 'var(--loss)' }}>
          ⚠ <strong>Canlı ortamdasınız.</strong> Yapılan değişiklikler gerçek kullanıcıları etkiler.
        </div>
      )}

      <div className={styles.tabs}>
        {[
          { k: 'genel', l: 'API Anahtarı' },
          { k: 'izinler', l: 'İzinler' },
          { k: 'ip', l: 'IP Beyaz Liste' },
          { k: 'webhook', l: 'Webhook Logları' },
          { k: 'rate', l: 'Rate Limiting' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'genel' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>API Anahtarları</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ortam === 'sandbox' ? 'Sandbox' : 'Live'} Gizli Anahtar</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
                    {gizlenmiş ? apiKey.replace(/sk_(sandbox|live)_/, 'sk_' + ortam + '_').replace(/[a-z0-9]/g, '•') : apiKey.replace(/sk_(sandbox|live)_/, 'sk_' + ortam + '_')}
                  </code>
                  <button className="btn btn-secondary" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }} onClick={() => setGizlenmiş(g => !g)}>
                    {gizlenmiş ? 'Göster' : 'Gizle'}
                  </button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.72rem' }}>Kopyala</button>
                </div>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Anahtar Rotasyonu</div>
                  <div className={styles.settingDesc}>90 günde bir otomatik rotasyon</div>
                </div>
                <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Yeni Anahtar Üret</button>
            </div>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>API Kullanım Özeti</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { l: 'Bugün İstek', v: '14.821' },
                { l: 'Bu Ay İstek', v: '482.044' },
                { l: 'Hata Oranı', v: '%0.12', c: 'var(--profit)' },
                { l: 'Ortalama Yanıt', v: '48ms', c: 'var(--accent)' },
                { l: 'Plan', v: 'Business Tier', c: 'var(--accent)' },
                { l: 'Kota Kullanımı', v: '%48.2 / 1M', c: 'var(--warning)' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.35rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{r.l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: r.c || 'var(--text)' }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'izinler' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>API İzin Kapsamları (Scopes)</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {IZINLER.map((grup, gi) => (
              <div key={gi}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>{grup.grup}</div>
                {grup.izinler.map((izin, ii) => (
                  <div key={ii} className={styles.settingRow}>
                    <div className={styles.settingInfo}>
                      <div className={styles.settingLabel}><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent)' }}>{izin.key}</code> — {izin.ad}</div>
                      <div className={styles.settingDesc}>{izin.aciklama}</div>
                    </div>
                    <label className={styles.switch}>
                      <input type="checkbox" checked={izinler[izin.key]} onChange={e => setIzinler(p => ({ ...p, [izin.key]: e.target.checked }))} />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start', minWidth: 160 }}>İzinleri Kaydet</button>
          </div>
        </div>
      )}

      {aktifTab === 'ip' && (
        <div style={{ maxWidth: 520 }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>IP Beyaz Listesi</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {ipListesi.map((ip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <code style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{ip}</code>
                  <button onClick={() => setIpListesi(prev => prev.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--loss)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input className={styles.input} style={{ flex: 1 }} placeholder="Yeni IP veya CIDR (örn: 10.0.0.0/24)" value={yeniIp} onChange={e => setYeniIp(e.target.value)} />
                <button className="btn btn-primary" onClick={() => { if (yeniIp.trim()) { setIpListesi(prev => [...prev, yeniIp.trim()]); setYeniIp('') } }}>Ekle</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'webhook' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Webhook Olay Günlüğü</span></div>
          <table className={styles.table}>
            <thead>
              <tr><th>ID</th><th>URL</th><th>Olay</th><th>HTTP</th><th>Yanıt</th><th>Zaman</th><th></th></tr>
            </thead>
            <tbody>
              {WEBHOOK_LOGLAR.map((w, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{w.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.url}</td>
                  <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>{w.olay}</code></td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: w.durum === 200 ? 'var(--profit)' : 'var(--loss)' }}>{w.durum}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)' }}>{w.yanit}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{w.zaman}</td>
                  <td><button className="btn btn-secondary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>Yeniden Gönder</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aktifTab === 'rate' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Rate Limiting — Endpoint Bazlı</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {RATE_LIMITLER.map((r, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>{r.endpoint}</code>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Limit: <strong style={{ color: 'var(--text)' }}>{r.limit}</strong> — Kullanım: <strong style={{ color: r.renk }}>{r.kullanim}%</strong></span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${r.kullanim}%`, background: r.renk }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
