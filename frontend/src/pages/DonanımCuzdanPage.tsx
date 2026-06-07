import { useState } from 'react'
import styles from './SharedPage.module.css'
import { useToast } from '../hooks/useToast'
import { Toast } from '../components/ui/Toast'

type Adim = {
  baslik: string
  aciklama: string
  ikon: string
  tamamlandi: boolean
}

const CIHAZLAR = [
  { isim: 'Ledger Nano X', model: 'Nano X', versiyon: 'v2.1.0', bagli: true, batarya: 72, desteklenen: 'BTC, ETH, SOL + 5500 coin' },
  { isim: 'Trezor Model T', model: 'Model T', versiyon: 'v2.6.0', bagli: false, batarya: null, desteklenen: 'BTC, ETH + 1800 coin' },
]

const ONAY_ADIMLARI: Adim[] = [
  { baslik: 'Cihazı Bilgisayara Bağlayın', aciklama: 'USB kablosuyla Ledger/Trezor\'u bağlayın ve PIN ile kilidi açın', ikon: '🔌', tamamlandi: true },
  { baslik: 'Uygulamayı Açın', aciklama: 'Cihazda Bitcoin veya ilgili ağ uygulamasını başlatın', ikon: '📱', tamamlandi: true },
  { baslik: 'İşlemi İnceleyin', aciklama: 'Alıcı adresini ve tutarı cihaz ekranında dikkatlice doğrulayın', ikon: '🔍', tamamlandi: false },
  { baslik: 'Onaylayın veya Reddedin', aciklama: 'Doğrulamayı yaptıktan sonra cihaz butonuna basarak onaylayın', ikon: '✅', tamamlandi: false },
]

const SEED_KELIMELER = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
]

export function DonanımCuzdanPage() {
  const { toast, show } = useToast()
  const [aktifTab, setAktifTab] = useState('cihazlar')
  const [baglaniyorId, setBaglaniyorId] = useState<string | null>(null)
  const [baglandiId, setBaglandiId] = useState<string | null>('Ledger Nano X')
  const [adimlar, setAdimlar] = useState(ONAY_ADIMLARI)
  const [qrGoster, setQrGoster] = useState(false)
  const [seedCevaplar, setSeedCevaplar] = useState<string[]>(new Array(24).fill(''))
  const [seedDogrulandi, setSeedDogrulandi] = useState(false)

  const adimTamamla = (i: number) => {
    setAdimlar(prev => prev.map((a, idx) => idx === i ? { ...a, tamamlandi: true } : a))
  }

  const baglan = (isim: string) => {
    setBaglaniyorId(isim)
    setTimeout(() => {
      setBaglaniyorId(null)
      setBaglandiId(isim)
    }, 2000)
  }

  const seedGuncelle = (i: number, val: string) => {
    setSeedCevaplar(prev => { const y = [...prev]; y[i] = val; return y })
  }

  const seedDogrula = () => {
    const dogru = seedCevaplar.slice(0, 6).every((c, i) => c.toLowerCase().trim() === SEED_KELIMELER[i])
    setSeedDogrulandi(dogru)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Donanım Cüzdanı & Cold Storage</h1>
          <p className={styles.pageSub}>Ledger/Trezor eşleştirme, air-gapped QR imzalama ve seed doğrulama</p>
        </div>
        <button className="btn btn-primary" onClick={() => show('Cihaz eşleştirme başlatıldı', 'success')}>+ Yeni Cihaz Ekle</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {baglandiId && (
        <div className={`${styles.alertCard} ${styles.alertSuccess}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--profit)" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="var(--profit)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--profit)' }}>{baglandiId} Bağlı ve Hazır</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Cihaz güvenli bağlantı üzerinden iletişim kuruyor. İşlem onay gerektiriyor.</div>
          </div>
        </div>
      )}

      <div className={styles.tabs}>
        {[
          { k: 'cihazlar', l: 'Cihazlar' },
          { k: 'onay', l: 'İşlem Onay Rehberi' },
          { k: 'qr', l: 'Air-Gapped QR İmzalama' },
          { k: 'seed', l: 'Seed Phrase Doğrulama' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'cihazlar' && (
        <div className={styles.grid2}>
          {CIHAZLAR.map(c => (
            <div key={c.isim} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: '1.3rem' }}>
                    🔐
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{c.isim}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Firmware {c.versiyon}</div>
                  </div>
                </div>
                <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: baglandiId === c.isim ? 'rgba(0,212,170,0.1)' : 'rgba(150,150,150,0.1)', color: baglandiId === c.isim ? 'var(--profit)' : 'var(--text-dim)', border: `1px solid ${baglandiId === c.isim ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
                  {baglandiId === c.isim ? 'Bağlı' : baglaniyorId === c.isim ? 'Bağlanıyor...' : 'Bağlı Değil'}
                </span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Desteklenen Coinler</span>
                  <span style={{ fontSize: '0.75rem' }}>{c.desteklenen}</span>
                </div>
                {c.batarya !== null && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Batarya</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: c.batarya < 30 ? 'var(--loss)' : 'var(--profit)' }}>%{c.batarya}</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${c.batarya}%`, background: c.batarya < 30 ? 'var(--loss)' : 'var(--accent)' }} />
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {baglandiId !== c.isim ? (
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => baglan(c.isim)} disabled={baglaniyorId !== null}>
                      {baglaniyorId === c.isim ? 'Bağlanıyor...' : 'Cihaza Bağlan'}
                    </button>
                  ) : (
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => setBaglandiId(null)}>Bağlantıyı Kes</button>
                  )}
                  <button className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>Güncelle</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'onay' && (
        <div style={{ maxWidth: 540, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className={`${styles.alertCard} ${styles.alertInfo}`} style={{ marginBottom: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#0066ff" strokeWidth="1.2"/><line x1="7" y1="6" x2="7" y2="10" stroke="#0066ff" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="4.5" r="0.6" fill="#0066ff"/></svg>
            <span style={{ fontSize: '0.78rem' }}>Donanım cüzdanınız, işlemleri bilgisayardan bağımsız olarak fiziksel onay gerektirir. Her işlemi cihaz ekranında doğrulayın.</span>
          </div>
          {adimlar.map((a, i) => (
            <div key={i} className={styles.sectionCard} style={{ border: `1px solid ${a.tamamlandi ? 'rgba(0,212,170,0.3)' : 'var(--border)'}` }}>
              <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: a.tamamlandi ? 'rgba(0,212,170,0.1)' : 'var(--bg-card)', border: `2px solid ${a.tamamlandi ? 'rgba(0,212,170,0.4)' : 'var(--border)'}`, display: 'grid', placeItems: 'center', fontSize: '1.4rem', flexShrink: 0, transition: 'all 0.3s' }}>
                  {a.tamamlandi ? '✅' : a.ikon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: a.tamamlandi ? 'var(--profit)' : 'var(--text)' }}>
                    {i + 1}. {a.baslik}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', lineHeight: 1.5 }}>{a.aciklama}</div>
                </div>
                {!a.tamamlandi && (
                  <button className="btn btn-secondary" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }} onClick={() => adimTamamla(i)}>
                    Tamamlandı
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'qr' && (
        <div style={{ maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={`${styles.alertCard} ${styles.alertWarn}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 12H1L7 1Z" stroke="var(--warning)" strokeWidth="1.2" fill="none"/><line x1="7" y1="5" x2="7" y2="8.5" stroke="var(--warning)" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="10" r="0.6" fill="var(--warning)"/></svg>
            <span style={{ fontSize: '0.78rem' }}>Air-Gapped QR imzalama, cüzdanınızın internete hiç bağlanmadan işlem imzalamasını sağlar. En yüksek güvenlik seviyesi.</span>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>İmzalanmamış İşlem QR Kodu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'center', textAlign: 'center' }}>
              {!qrGoster ? (
                <>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 340 }}>
                    Cihazınıza bağlanmadan imzalamak istediğiniz işlemi oluşturun. QR kodu gösterilecektir, cihazınızın kamerasıyla okutun.
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setQrGoster(true)}>QR Kodu Oluştur</button>
                </>
              ) : (
                <>
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <rect width="200" height="200" fill="var(--bg-card)" rx="8"/>
                    <rect x="16" y="16" width="60" height="60" rx="4" stroke="var(--text)" strokeWidth="3" fill="none"/>
                    <rect x="26" y="26" width="40" height="40" rx="2" fill="var(--text)"/>
                    <rect x="124" y="16" width="60" height="60" rx="4" stroke="var(--text)" strokeWidth="3" fill="none"/>
                    <rect x="134" y="26" width="40" height="40" rx="2" fill="var(--text)"/>
                    <rect x="16" y="124" width="60" height="60" rx="4" stroke="var(--text)" strokeWidth="3" fill="none"/>
                    <rect x="26" y="134" width="40" height="40" rx="2" fill="var(--text)"/>
                    {[0,1,2,3,4,5,6,7,8].map(n => (
                      <rect key={n} x={100 + (n % 3) * 14 - 14} y={100 + Math.floor(n / 3) * 14 - 14} width={10} height={10} fill={[0,2,3,5,6,8].includes(n) ? "var(--text)" : "transparent"} />
                    ))}
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(n => (
                      <rect key={n} x={90 + (n % 4) * 10} y={150 + Math.floor(n / 4) * 10} width={7} height={7} fill={[1,2,4,5,7,8,10].includes(n) ? "var(--text)" : "transparent"} />
                    ))}
                  </svg>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>İmzalanmamış İşlem</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', maxWidth: 300, lineHeight: 1.5 }}>
                    Bu QR'ı çevrimdışı cihazınıza okutun. İmzaladıktan sonra çıkan QR'ı buraya okutun.
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>İmzalı QR Okut</button>
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => setQrGoster(false)}>İptal</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'seed' && (
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Seed Phrase Doğrulama Sihirbazı</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className={`${styles.alertCard} ${styles.alertDanger}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 12H1L7 1Z" stroke="var(--loss)" strokeWidth="1.2" fill="none"/><line x1="7" y1="5" x2="7" y2="8.5" stroke="var(--loss)" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="10" r="0.6" fill="var(--loss)"/></svg>
                <span style={{ fontSize: '0.75rem', color: 'var(--loss)' }}>Seed phrase'inizi asla kimseyle paylaşmayın! Finance Portal dahil hiçbir uygulama seed phrase'inizi istemez.</span>
              </div>

              {!seedDogrulandi ? (
                <>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Doğrulama amacıyla seed phrase'inizin ilk 6 kelimesini girin:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {seedCevaplar.slice(0, 6).map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', minWidth: 18, fontFamily: 'var(--font-mono)' }}>{i + 1}.</span>
                        <input
                          className={styles.input}
                          style={{ flex: 1 }}
                          type="password"
                          placeholder={`Kelime ${i + 1}`}
                          value={c}
                          onChange={e => seedGuncelle(i, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={seedCevaplar.slice(0, 6).some(c => !c.trim())}
                    onClick={seedDogrula}
                  >
                    Doğrula
                  </button>
                </>
              ) : (
                <div className={`${styles.alertCard} ${styles.alertSuccess}`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="var(--profit)" strokeWidth="1.5"/><path d="M6 10l3 3 5-5" stroke="var(--profit)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--profit)' }}>Seed Phrase Doğrulandı!</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Cüzdanınız güvenli. Seed phrase'inizi güvenli bir yerde sakladığınızdan emin olun.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
