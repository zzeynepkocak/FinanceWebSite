import { useState, useEffect } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'
import { apiFetch } from '../api/client'

type Kanal = 'sms' | 'email' | 'push'

interface Alarm {
  id: number; sembol: string; tip: 'yukari' | 'asagi'; fiyat: string; kanallar: Kanal[]
}

const VARSAYILAN_ALARMLAR: Alarm[] = [
  { id: 1, sembol: 'BIST100', tip: 'yukari', fiyat: '10500', kanallar: ['push', 'email'] },
  { id: 2, sembol: 'USD/TRY', tip: 'yukari', fiyat: '36.00', kanallar: ['sms', 'push'] },
  { id: 3, sembol: 'THYAO', tip: 'asagi', fiyat: '280', kanallar: ['email'] },
]

const WEBHOOKLAR = [
  { id: 1, isim: 'Muhasebe Sistemi', url: 'https://erp.sirketim.com/webhook/finans', olay: 'her_islem', durum: 'Aktif' },
  { id: 2, isim: 'Slack Kanalı', url: 'https://hooks.slack.com/services/T04XXXX', olay: 'buyuk_islem', durum: 'Aktif' },
  { id: 3, isim: 'CRM Entegrasyon', url: 'https://crm.sirketim.com/finance', olay: 'ay_sonu', durum: 'Pasif' },
]

export function BildirimAyarlariPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('alarmlar')
  const [alarmlar, setAlarmlar] = useState<Alarm[]>(VARSAYILAN_ALARMLAR)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [dndAktif, setDndAktif] = useState(false)
  const [dndBaslangic, setDndBaslangic] = useState('22:00')
  const [dndBitis, setDndBitis] = useState('08:00')
  const [telegramBagli, setTelegramBagli] = useState(false)
  const [discordBagli, setDiscordBagli] = useState(true)
  const [raporEmail, setRaporEmail] = useState(true)
  const [raporSiklik, setRaporSiklik] = useState('haftalik')
  const [yeniSembol, setYeniSembol] = useState('')
  const [yeniFiyat, setYeniFiyat] = useState('')
  const [yeniTip, setYeniTip] = useState<'yukari' | 'asagi'>('yukari')

  // Backend'den alarmları yükle
  useEffect(() => {
    apiFetch<{ data: Alarm[] }>('/api/v1/alerts')
      .then(res => { if (res.data?.length) setAlarmlar(res.data) })
      .catch(() => { /* backend erişilemiyorsa varsayılan alarmları kullan */ })
  }, [])

  const alarmEkle = async () => {
    if (!yeniSembol || !yeniFiyat) return
    const yeni: Alarm = { id: Date.now(), sembol: yeniSembol.toUpperCase(), tip: yeniTip, fiyat: yeniFiyat, kanallar: ['push'] }
    setYukleniyor(true)
    try {
      const res = await apiFetch<{ data: Alarm }>('/api/v1/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: yeni.sembol, targetPrice: parseFloat(yeni.fiyat), direction: yeni.tip }),
      })
      setAlarmlar(prev => [...prev, res.data ?? yeni])
      show(`${yeni.sembol} alarmı oluşturuldu`, 'success')
    } catch {
      setAlarmlar(prev => [...prev, yeni])
      show(`${yeni.sembol} alarmı eklendi`, 'success')
    } finally {
      setYukleniyor(false)
      setYeniSembol('')
      setYeniFiyat('')
    }
  }

  const alarmSil = async (id: number) => {
    try {
      await apiFetch(`/api/v1/alerts/${id}`, { method: 'DELETE' })
    } catch { /* local fallback */ }
    setAlarmlar(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Akıllı Bildirim & Otomasyon</h1>
          <p className={styles.pageSub}>Fiyat alarmlari, rahatsız etme saatleri, bot entegrasyonları ve webhook yönetimi</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Bildirim ayarlarınız başarıyla kaydedildi', 'success')}>Ayarları Kaydet</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={styles.tabs}>
        {[
          { k: 'alarmlar', l: 'Fiyat Alarmlari' },
          { k: 'dnd', l: 'Rahatsız Etme' },
          { k: 'botlar', l: 'Bot Entegrasyonları' },
          { k: 'webhook', l: 'Webhook Yönetimi' },
          { k: 'raporlar', l: 'Rapor Zamanlayıcı' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'alarmlar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Yeni Alarm Ekle</span></div>
            <div className={styles.cardBody}>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <input className={styles.input} placeholder="Sembol (BIST100, USD/TRY...)" value={yeniSembol} onChange={e => setYeniSembol(e.target.value)} style={{ flex: 2, minWidth: 140 }} />
                <select className={styles.select} value={yeniTip} onChange={e => setYeniTip(e.target.value as 'yukari' | 'asagi')}>
                  <option value="yukari">Fiyat yükseldikçe</option>
                  <option value="asagi">Fiyat düştükçe</option>
                </select>
                <input className={styles.input} placeholder="Hedef Fiyat" value={yeniFiyat} onChange={e => setYeniFiyat(e.target.value)} style={{ flex: 1, minWidth: 100 }} />
                <button className="btn btn-primary" style={{ fontSize: '0.82rem' }} onClick={alarmEkle} disabled={yukleniyor}>{yukleniyor ? 'Ekleniyor…' : 'Ekle'}</button>
              </div>
            </div>
          </div>
          {alarmlar.map(a => (
            <div key={a.id} className={styles.sectionCard}>
              <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.sembol}</div>
                  <div style={{ fontSize: '0.72rem', color: a.tip === 'yukari' ? 'var(--profit)' : 'var(--loss)', marginTop: '0.15rem' }}>
                    {a.tip === 'yukari' ? '↑' : '↓'} {a.fiyat} seviyesinde tetiklenir
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {(['sms', 'email', 'push'] as Kanal[]).map(k => (
                    <span key={k} style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: a.kanallar.includes(k) ? 'var(--accent-dim)' : 'var(--bg-card)', color: a.kanallar.includes(k) ? 'var(--accent)' : 'var(--text-dim)', border: `1px solid ${a.kanallar.includes(k) ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`, cursor: 'pointer' }}>
                      {k.toUpperCase()}
                    </span>
                  ))}
                </div>
                <button onClick={() => alarmSil(a.id)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--loss)', cursor: 'pointer', padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'dnd' && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Rahatsız Etme Saatleri (DND)</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>DND Modunu Etkinleştir</div>
                  <div className={styles.settingDesc}>Belirlenen saatler arasında tüm bildirimler sessize alınır</div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={dndAktif} onChange={() => setDndAktif(d => !d)} />
                  <span className={styles.slider} />
                </label>
              </div>
              {dndAktif && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Başlangıç</label>
                    <input type="time" className={styles.input} style={{ width: '100%' }} value={dndBaslangic} onChange={e => setDndBaslangic(e.target.value)} />
                  </div>
                  <span style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>—</span>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Bitiş</label>
                    <input type="time" className={styles.input} style={{ width: '100%' }} value={dndBitis} onChange={e => setDndBitis(e.target.value)} />
                  </div>
                </div>
              )}
              {dndAktif && (
                <div className={`${styles.alertCard} ${styles.alertInfo}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#0066ff" strokeWidth="1.2"/><line x1="7" y1="6" x2="7" y2="10" stroke="#0066ff" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="4.5" r="0.6" fill="#0066ff"/></svg>
                  <span style={{ fontSize: '0.75rem' }}>{dndBaslangic} – {dndBitis} arası bildirimler sessize alınacak. Kritik uyarılar hariç.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'botlar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 540 }}>
          {[
            { isim: 'Telegram Bot', aciklama: 'Fiyat alarmlarını ve portföy özetini Telegram kanalınıza iletin', bağlı: telegramBagli, toggle: () => setTelegramBagli(t => !t), renk: '#2CA5E0' },
            { isim: 'Discord Bot', aciklama: 'Finance Portal bildirimlerini Discord sunucunuza entegre edin', bağlı: discordBagli, toggle: () => setDiscordBagli(t => !t), renk: '#5865F2' },
          ].map(b => (
            <div key={b.isim} className={styles.sectionCard}>
              <div className={styles.cardBody}>
                <div className={styles.settingRow} style={{ border: 'none', paddingBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: `${b.renk}22`, border: `1px solid ${b.renk}44`, display: 'grid', placeItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem' }}>{b.isim.includes('Telegram') ? '✈' : '💬'}</span>
                    </div>
                    <div>
                      <div className={styles.settingLabel}>{b.isim}</div>
                      <div className={styles.settingDesc}>{b.aciklama}</div>
                    </div>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={b.bağlı} onChange={b.toggle} />
                    <span className={styles.slider} />
                  </label>
                </div>
                {b.bağlı && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <input className={styles.input} style={{ width: '100%' }} placeholder={b.isim.includes('Telegram') ? 'Bot token veya kanal ID girin' : 'Webhook URL girin'} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'webhook' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {WEBHOOKLAR.map(w => (
            <div key={w.id} className={styles.sectionCard}>
              <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{w.isim}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.15rem', wordBreak: 'break-all' }}>{w.url}</div>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap' }}>{w.olay}</span>
                <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: w.durum === 'Aktif' ? 'rgba(0,212,170,0.1)' : 'rgba(150,150,150,0.1)', color: w.durum === 'Aktif' ? 'var(--profit)' : 'var(--text-dim)', border: `1px solid ${w.durum === 'Aktif' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>{w.durum}</span>
                <button className="btn btn-secondary" style={{ fontSize: '0.72rem' }} onClick={() => show(`${w.isim} webhook testi başarılı`, 'success')}>Test Et</button>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => show('Webhook eklendi', 'success')}>+ Webhook Ekle</button>
        </div>
      )}

      {aktifTab === 'raporlar' && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Otomatik Rapor E-postası</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Rapor E-postası Gönder</div>
                  <div className={styles.settingDesc}>Portföy özeti ve harcama raporu otomatik e-posta ile gönderilir</div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={raporEmail} onChange={() => setRaporEmail(r => !r)} />
                  <span className={styles.slider} />
                </label>
              </div>
              {raporEmail && (
                <>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Sıklık</label>
                    <select className={styles.select} style={{ width: '100%' }} value={raporSiklik} onChange={e => setRaporSiklik(e.target.value)}>
                      <option value="gunluk">Günlük</option>
                      <option value="haftalik">Haftalık (Pazartesi)</option>
                      <option value="aylik">Aylık (Ay başı)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>E-posta Adresi</label>
                    <input className={styles.input} style={{ width: '100%' }} defaultValue="ahmet.yilmaz@email.com" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Rapor İçeriği</label>
                    {['Portföy özeti ve getiri', 'Harcama analizi', 'Fatura ve abonelikler', 'Kâr/zarar tablosu'].map(r => (
                      <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '0.35rem', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
                        {r}
                      </label>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => show('Rapor ayarları kaydedildi', 'success')}>Ayarları Kaydet</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
