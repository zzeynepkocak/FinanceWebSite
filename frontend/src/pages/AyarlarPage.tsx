import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'
import { useAuth } from '../auth/KeycloakProvider'

const SESSIONS = [
  { id: 1, cihaz: 'Chrome / Windows 11', konum: 'İstanbul, TR', ip: '85.34.12.77', zaman: 'Şu an aktif', aktif: true },
  { id: 2, cihaz: 'Safari / iPhone 15', konum: 'İstanbul, TR', ip: '85.34.12.78', zaman: '2 saat önce', aktif: false },
  { id: 3, cihaz: 'Firefox / MacOS', konum: 'Ankara, TR', ip: '195.175.80.11', zaman: 'Dün 15:42', aktif: false },
]

const DILLER = ['Türkçe', 'English', 'Deutsch', 'Français', 'العربية']
const PARA_BIRIMLERI = ['TRY ₺', 'USD $', 'EUR €', 'GBP £', 'BTC ₿']

export function AyarlarPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast, show } = useToast()
  const [activeTab, setActiveTab] = useState('genel')
  const [sessions, setSessions] = useState(SESSIONS)
  const [notifications, setNotifications] = useState({
    email: true, sms: true, push: true, fiyatAlarm: true,
    haftalikRapor: true, aylikRapor: false, guvenik: true,
  })
  const [dil, setDil] = useState('Türkçe')
  const [paraBirimi, setParaBirimi] = useState('TRY ₺')
  const [gizliMod, setGizliMod] = useState(false)

  const kapatSession = (id: number) => setSessions(s => s.filter(x => x.id !== id))

  const TABS = [
    { id: 'genel', label: 'Genel' },
    { id: 'bildirim', label: 'Bildirimler' },
    { id: 'guvenlik', label: 'Güvenlik' },
    { id: 'oturumlar', label: 'Oturumlar' },
    { id: 'gizlilik', label: 'Gizlilik' },
    { id: 'api', label: 'API & İzinler' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Ayarlar</h1>
          <p className={styles.pageSub}>Hesap, güvenlik ve kişiselleştirme ayarları</p>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id} className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Genel Ayarlar ── */}
      {activeTab === 'genel' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Dil & Para Birimi</span></div>
            <div className={styles.cardBody}>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Arayüz Dili</div>
                  <div className={styles.settingDesc}>Uygulama dili seçimi</div>
                </div>
                <select className={styles.select} value={dil} onChange={e => setDil(e.target.value)}>
                  {DILLER.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Varsayılan Para Birimi</div>
                  <div className={styles.settingDesc}>Fiyat gösterim birimi</div>
                </div>
                <select className={styles.select} value={paraBirimi} onChange={e => setParaBirimi(e.target.value)}>
                  {PARA_BIRIMLERI.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>🙈 Gizli Mod</div>
                  <div className={styles.settingDesc}>Tüm bakiye ve tutarları gizler</div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={gizliMod} onChange={() => setGizliMod(!gizliMod)} />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Profil Bilgileri</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Ad Soyad', value: user ? `${user.firstName} ${user.lastName}`.trim() : '', type: 'text' },
                { label: 'E-Posta', value: user?.email ?? '', type: 'email' },
                { label: 'Telefon', value: '+90 555 123 4567', type: 'tel' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.3rem', display: 'block' }}>{f.label}</label>
                  <input className={styles.input} style={{ width: '100%', boxSizing: 'border-box' }} defaultValue={f.value} type={f.type} />
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: '0.25rem' }} onClick={() => show('Profil bilgileri güncellendi', 'success')}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bildirimler ── */}
      {activeTab === 'bildirim' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Bildirim Tercihleri</span></div>
          <div className={styles.cardBody}>
            {[
              { key: 'email' as const, label: '📧 E-Posta Bildirimleri', desc: 'İşlem onayları ve özetler' },
              { key: 'sms' as const, label: '📱 SMS Bildirimleri', desc: 'Kritik güvenlik uyarıları' },
              { key: 'push' as const, label: '🔔 Push Bildirimleri', desc: 'Uygulama anlık bildirimleri' },
              { key: 'fiyatAlarm' as const, label: '⚡ Fiyat Alarmları', desc: 'Hedef fiyata ulaşınca uyar' },
              { key: 'haftalikRapor' as const, label: '📊 Haftalık Rapor', desc: 'Her pazartesi özet e-posta' },
              { key: 'aylikRapor' as const, label: '📅 Aylık Rapor', desc: 'Ayın son günü detaylı analiz' },
              { key: 'guvenik' as const, label: '🔐 Güvenlik Uyarıları', desc: 'Şüpheli işlem bildirimleri' },
            ].map(({ key, label, desc }) => (
              <div key={key} className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>{label}</div>
                  <div className={styles.settingDesc}>{desc}</div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={notifications[key]} onChange={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} />
                  <span className={styles.slider}></span>
                </label>
              </div>
            ))}

            <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sessiz Saatler (DND)</div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Başlangıç:</span>
                <input type="time" className={styles.input} defaultValue="22:00" />
                <span style={{ color: 'var(--text-dim)' }}>Bitiş:</span>
                <input type="time" className={styles.input} defaultValue="08:00" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Güvenlik ── */}
      {activeTab === 'guvenlik' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Güvenlik Ayarları</span></div>
            <div className={styles.cardBody}>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>🔐 İki Faktörlü Doğrulama (2FA)</div>
                  <div className={styles.settingDesc}>TOTP tabanlı — Google Authenticator</div>
                </div>
                <button className="btn btn-primary" onClick={() => navigate(paths.twoFactor)} style={{ fontSize: '0.75rem' }}>Yönet</button>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>🔑 Şifre Değiştir</div>
                  <div className={styles.settingDesc}>Son değişiklik: 45 gün önce</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => show('Şifre değiştirme e-postası gönderildi', 'info')}>Değiştir</button>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>📋 KYC Durumu</div>
                  <div className={styles.settingDesc}>Kimlik doğrulama — Onaylandı ✓</div>
                </div>
                <span style={{ color: 'var(--profit)', fontSize: '0.78rem', fontWeight: 600 }}>✓ Doğrulandı</span>
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Hesap Gizlilik & İzinler</span></div>
            <div className={styles.cardBody}>
              {[
                { label: 'Portföyümü Herkese Göster', desc: 'Sosyal finans profili', checked: false },
                { label: 'İşlem Geçmişi Paylaşımı', desc: 'Analiz için anonim veri', checked: true },
                { label: 'Kişiselleştirilmiş Reklamlar', desc: 'Harcama bazlı teklifler', checked: false },
                { label: 'Üçüncü Taraf API Erişimi', desc: 'Bağlı uygulama izinleri', checked: true },
              ].map(({ label, desc, checked }) => (
                <div key={label} className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>{label}</div>
                    <div className={styles.settingDesc}>{desc}</div>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" defaultChecked={checked} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Aktif Oturumlar ── */}
      {activeTab === 'oturumlar' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Aktif Oturumlar & Cihaz Yönetimi</span>
            <button className="btn btn-danger" style={{ fontSize: '0.75rem' }} onClick={() => { setSessions(s => s.filter(x => x.aktif)); show('Tüm diğer oturumlar kapatıldı', 'success') }}>Tümünü Kapat</button>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sessions.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: `1px solid ${s.aktif ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {s.cihaz.includes('iPhone') || s.cihaz.includes('Safari') ? '📱' : '💻'}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{s.cihaz}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {s.konum} · {s.ip} · {s.zaman}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {s.aktif && <span style={{ fontSize: '0.68rem', color: 'var(--profit)', fontWeight: 600 }}>● Aktif</span>}
                  {!s.aktif && (
                    <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} onClick={() => kapatSession(s.id)}>
                      Kapat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Gizlilik ── */}
      {activeTab === 'gizlilik' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Gizlilik Yönetimi</span></div>
          <div className={styles.cardBody}>
            <div className={styles.alertCard} style={{ ...{ padding: '0.85rem 1rem', borderRadius: 'var(--radius)', border: '1px solid rgba(240,180,41,0.3)', background: 'rgba(240,180,41,0.06)', display: 'flex', gap: '0.75rem', marginBottom: '1rem' } }}>
              <span>⚠️</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                KVKK ve GDPR kapsamında verilerinizi yönetme haklarınızı kullanabilirsiniz.
              </span>
            </div>
            {[
              { label: 'Verileri İndir', desc: 'Tüm kişisel verilerinizin kopyasını alın (ZIP)', action: 'İndir', msg: 'Veri dışa aktarma talebiniz alındı, e-posta ile gönderilecek' },
              { label: 'Çerez Tercihleri', desc: 'Zorunlu olmayan çerezleri yönet', action: 'Yönet', msg: 'Çerez tercihleri kaydedildi' },
              { label: 'Veri Silme Talebi', desc: 'Hesabınızı ve verilerinizi kalıcı sil', action: 'Talep Et', msg: 'Silme talebiniz destek ekibine iletildi' },
            ].map(({ label, desc, action, msg }) => (
              <div key={label} className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>{label}</div>
                  <div className={styles.settingDesc}>{desc}</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => show(msg, 'info')}>{action}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── API Anahtarları ── */}
      {activeTab === 'api' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>API Anahtarı Yönetimi</span>
            <button className="btn btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => show('Yeni API anahtarı oluşturuldu', 'success')}>+ Yeni API Anahtarı</button>
          </div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { ad: 'Trading Bot v2', anahtar: 'sk_live_••••••••••••••ab3f', izin: ['Read', 'Trade'], olusturma: '2026-03-12', aktif: true },
              { ad: 'Dashboard Widget', anahtar: 'sk_live_••••••••••••••cc91', izin: ['Read'], olusturma: '2026-01-08', aktif: true },
            ].map(api => (
              <div key={api.ad} style={{ padding: '0.85rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{api.ad}</div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--profit)', fontWeight: 600 }}>● Aktif</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '0.35rem 0.65rem', borderRadius: 4, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {api.anahtar}
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.72rem' }} onClick={() => { navigator.clipboard.writeText(api.anahtar); show('API anahtarı kopyalandı', 'info') }}>📋 Kopyala</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {api.izin.map(i => <span key={i} className="badge badge-neutral">{i}</span>)}
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>Oluşturma: {api.olusturma}</span>
                  <button className="btn btn-danger" style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }} onClick={() => show('API anahtarı iptal edildi', 'warn')}>İptal Et</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
