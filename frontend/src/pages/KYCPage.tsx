import { useState } from 'react'
import styles from './SharedPage.module.css'

type Adim = {
  no: number; baslik: string; aciklama: string; ikon: string;
}

const ADIMLAR: Adim[] = [
  { no: 1, baslik: 'Kimlik Türü Seç', aciklama: 'TC Kimlik, Pasaport veya İkamet İzni', ikon: '🪪' },
  { no: 2, baslik: 'NFC Çip Okuma', aciklama: 'Kimliğinizi telefonunuza yaklaştırın', ikon: '📱' },
  { no: 3, baslik: 'Selfie / Canlılık Testi', aciklama: 'Yüzünüzü kameraya gösterin', ikon: '🤳' },
  { no: 4, baslik: 'e-Devlet PDF Yükleme', aciklama: 'e-Devlet\'ten nüfus kayıt örneği', ikon: '📄' },
  { no: 5, baslik: 'İnceleme', aciklama: 'Belgeleriniz kontrol ediliyor', ikon: '🔍' },
]

type KimlikTipi = 'tc' | 'pasaport' | 'ikamet' | ''

export function KYCPage() {
  const [mevcutAdim, setMevcutAdim] = useState(1)
  const [kimlikTipi, setKimlikTipi] = useState<KimlikTipi>('')
  const [nfcOkudu, setNfcOkudu] = useState(false)
  const [selfieOkudu, setSelfieOkudu] = useState(false)
  const [pdfYuklendi, setPdfYuklendi] = useState(false)
  const [nfcLoading, setNfcLoading] = useState(false)
  const [selfieLoading, setSelfieLoading] = useState(false)
  const [tamamlandi, setTamamlandi] = useState(false)

  const handleNFC = () => {
    setNfcLoading(true)
    setTimeout(() => { setNfcLoading(false); setNfcOkudu(true) }, 2500)
  }

  const handleSelfie = () => {
    setSelfieLoading(true)
    setTimeout(() => { setSelfieLoading(false); setSelfieOkudu(true) }, 2000)
  }

  const ileriGit = () => {
    if (mevcutAdim < ADIMLAR.length) setMevcutAdim(m => m + 1)
    else setTamamlandi(true)
  }

  const adimTamamMi = () => {
    if (mevcutAdim === 1) return kimlikTipi !== ''
    if (mevcutAdim === 2) return nfcOkudu
    if (mevcutAdim === 3) return selfieOkudu
    if (mevcutAdim === 4) return pdfYuklendi
    return true
  }

  if (tamamlandi) {
    return (
      <div className={styles.page}>
        <div style={{ maxWidth: 480, margin: '2rem auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '4rem' }}>✅</div>
          <h1 className={styles.pageTitle}>KYC Doğrulaması Tamamlandı</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Kimlik doğrulamanız başarıyla tamamlandı. Hesabınız artık tam yetkilidir.</p>
          <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius)', fontSize: '0.82rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Kimlik Türü</span><span>{{ tc: 'TC Kimlik Kartı', pasaport: 'Pasaport', ikamet: 'İkamet İzni' }[kimlikTipi as string] || ''}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>NFC Okuma</span><span style={{ color: 'var(--profit)' }}>✓ Başarılı</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Canlılık Testi</span><span style={{ color: 'var(--profit)' }}>✓ Başarılı</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>e-Devlet PDF</span><span style={{ color: 'var(--profit)' }}>✓ Doğrulandı</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Doğrulama Tarihi</span><span style={{ fontFamily: 'var(--font-mono)' }}>29.05.2026 14:32</span></div>
          </div>
          <button className="btn btn-primary" onClick={() => { setTamamlandi(false); setMevcutAdim(1); setKimlikTipi(''); setNfcOkudu(false); setSelfieOkudu(false); setPdfYuklendi(false) }}>
            Yeniden Doğrula
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>KYC & Kimlik Doğrulama</h1>
          <p className={styles.pageSub}>Adım {mevcutAdim} / {ADIMLAR.length} — {ADIMLAR[mevcutAdim - 1].baslik}</p>
        </div>
      </div>

      {/* Adım göstergesi */}
      <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
        {ADIMLAR.map((adim, i) => (
          <div key={adim.no} style={{ display: 'flex', alignItems: 'center', flex: i < ADIMLAR.length - 1 ? 1 : 'unset' }}>
            <div
              style={{ width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, border: `2px solid ${adim.no < mevcutAdim ? 'var(--profit)' : adim.no === mevcutAdim ? 'var(--accent)' : 'var(--border)'}`, background: adim.no < mevcutAdim ? 'rgba(0,212,170,0.1)' : adim.no === mevcutAdim ? 'var(--accent-dim)' : 'var(--bg-card)', color: adim.no < mevcutAdim ? 'var(--profit)' : adim.no === mevcutAdim ? 'var(--accent)' : 'var(--text-dim)', cursor: adim.no < mevcutAdim ? 'pointer' : 'default', transition: 'all 0.2s' }}
              onClick={() => adim.no < mevcutAdim && setMevcutAdim(adim.no)}
              title={adim.baslik}
            >
              {adim.no < mevcutAdim ? '✓' : adim.no}
            </div>
            {i < ADIMLAR.length - 1 && (
              <div style={{ flex: 1, height: 2, background: adim.no < mevcutAdim ? 'var(--profit)' : 'var(--border)', margin: '0 4px', transition: 'background 0.3s' }}></div>
            )}
          </div>
        ))}
      </div>

      {/* İlerleme çubuğu */}
      <div className={styles.progressBar} style={{ height: 4 }}>
        <div className={styles.progressFill} style={{ width: `${((mevcutAdim - 1) / (ADIMLAR.length - 1)) * 100}%` }}></div>
      </div>

      {/* Adım içerikleri */}
      <div style={{ maxWidth: 520, margin: '0 auto', width: '100%' }}>

        {/* Adım 1: Kimlik Türü */}
        {mevcutAdim === 1 && (
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>🪪 Kimlik Türü Seçin</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { k: 'tc' as KimlikTipi, l: 'TC Kimlik Kartı', a: 'NFC çipli T.C. Kimlik Kartı', ikon: '🪪' },
                { k: 'pasaport' as KimlikTipi, l: 'Pasaport', a: 'Biyometrik pasaport', ikon: '📘' },
                { k: 'ikamet' as KimlikTipi, l: 'Yabancı Kimlik (İkamet İzni)', a: 'Geçici veya süresiz ikamet', ikon: '🌍' },
              ].map(opt => (
                <div
                  key={opt.k}
                  onClick={() => setKimlikTipi(opt.k)}
                  style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', border: `2px solid ${kimlikTipi === opt.k ? 'var(--accent)' : 'var(--border)'}`, background: kimlikTipi === opt.k ? 'var(--accent-dim)' : 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', transition: 'all 0.15s' }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{opt.ikon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: kimlikTipi === opt.k ? 'var(--accent)' : 'var(--text)' }}>{opt.l}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{opt.a}</div>
                  </div>
                  {kimlikTipi === opt.k && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontWeight: 700 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adım 2: NFC */}
        {mevcutAdim === 2 && (
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>📱 NFC Çip Okuma</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '2rem 1rem' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', border: `3px solid ${nfcOkudu ? 'var(--profit)' : nfcLoading ? 'var(--accent)' : 'var(--border)'}`, display: 'grid', placeItems: 'center', fontSize: '2.5rem', background: nfcOkudu ? 'rgba(0,212,170,0.1)' : 'var(--bg-card)', animation: nfcLoading ? 'pulse 1s infinite' : 'none', transition: 'all 0.3s' }}>
                {nfcOkudu ? '✅' : nfcLoading ? '⟳' : '📱'}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{nfcOkudu ? 'NFC Okuma Başarılı!' : nfcLoading ? 'Kimlik okunuyor...' : 'Kimliği Telefonunuza Yaklaştırın'}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {nfcOkudu ? 'Kimlik bilgileri başarıyla okundu.' : 'TC Kimlik Kartınızı telefonun arka yüzüne (NFC alanına) yaklaştırın'}
                </div>
              </div>
              {nfcOkudu && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius-sm)', width: '100%', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Ad Soyad</span><span>Ahmet YILMAZ</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>TC No</span><span style={{ fontFamily: 'var(--font-mono)' }}>123 *** *** 90</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)' }}>Doğum Tarihi</span><span>15.03.1994</span></div>
                </div>
              )}
              {!nfcOkudu && (
                <button className="btn btn-primary" style={{ minWidth: 200 }} onClick={handleNFC} disabled={nfcLoading}>
                  {nfcLoading ? 'Okunuyor...' : 'NFC Taramayı Başlat'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Adım 3: Selfie */}
        {mevcutAdim === 3 && (
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>🤳 Selfie / Canlılık Testi</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '2rem 1rem' }}>
              <div style={{ width: 140, height: 140, borderRadius: '50%', border: `3px solid ${selfieOkudu ? 'var(--profit)' : 'var(--border)'}`, display: 'grid', placeItems: 'center', fontSize: '3rem', background: 'var(--bg-card)', overflow: 'hidden' }}>
                {selfieOkudu ? '✅' : selfieLoading ? '⟳' : '😐'}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{selfieOkudu ? 'Canlılık Testi Başarılı!' : 'Kameraya Bakın'}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {selfieOkudu ? 'Yüzünüz kimlik bilgilerinizle eşleşiyor.' : 'Başınızı hafifçe sola ve sağa çevirerek canlılık testini tamamlayın'}
                </div>
              </div>
              {!selfieOkudu && (
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  <span>← Sola bak</span><span>→ Sağa bak</span><span>↑ Göz kırp</span>
                </div>
              )}
              {!selfieOkudu && (
                <button className="btn btn-primary" style={{ minWidth: 200 }} onClick={handleSelfie} disabled={selfieLoading}>
                  {selfieLoading ? 'Analiz ediliyor...' : 'Kamerayı Başlat'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Adım 4: e-Devlet */}
        {mevcutAdim === 4 && (
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>📄 e-Devlet Belgesi Yükle</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                <strong>Adım 1:</strong> e-Devlet'e giriş yapın<br />
                <strong>Adım 2:</strong> "Nüfus Kayıt Örneği" veya "Adres Teyit Belgesi" indirin<br />
                <strong>Adım 3:</strong> PDF'i aşağıya yükleyin
              </div>
              <div
                onClick={() => setPdfYuklendi(true)}
                style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: pdfYuklendi ? 'rgba(0,212,170,0.04)' : 'var(--bg-card)', borderColor: pdfYuklendi ? 'var(--accent)' : 'var(--border)', transition: 'all 0.2s' }}
              >
                {pdfYuklendi ? (
                  <><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div><div style={{ color: 'var(--profit)', fontWeight: 600 }}>nufus_kayit_ornegi.pdf</div><div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>84 KB — e-Devlet imzalı</div></>
                ) : (
                  <><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div><div style={{ fontWeight: 600 }}>PDF Yükle</div><div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>e-Devlet imzalı PDF gereklidir</div></>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Adım 5: İnceleme */}
        {mevcutAdim === 5 && (
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>🔍 Belge İnceleme</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { etiket: 'Kimlik Türü', deger: { tc: 'TC Kimlik', pasaport: 'Pasaport', ikamet: 'İkamet İzni' }[kimlikTipi as string] || '', durum: true },
                { etiket: 'NFC Çip Okuma', deger: nfcOkudu ? 'Başarılı' : 'Tamamlanmadı', durum: nfcOkudu },
                { etiket: 'Canlılık Testi', deger: selfieOkudu ? 'Başarılı' : 'Tamamlanmadı', durum: selfieOkudu },
                { etiket: 'e-Devlet PDF', deger: pdfYuklendi ? 'Yüklendi' : 'Yüklenmedi', durum: pdfYuklendi },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{r.etiket}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: r.durum ? 'var(--profit)' : 'var(--loss)' }}>{r.deger}</span>
                    <span>{r.durum ? '✓' : '✗'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigasyon butonları */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => setMevcutAdim(m => Math.max(1, m - 1))} disabled={mevcutAdim === 1}>Geri</button>
          <button className="btn btn-primary" onClick={ileriGit} disabled={!adimTamamMi()}>
            {mevcutAdim === ADIMLAR.length ? 'Doğrulamayı Tamamla' : 'İleri'}
          </button>
        </div>
      </div>
    </div>
  )
}
