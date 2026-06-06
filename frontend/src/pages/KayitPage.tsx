import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'
import styles from './KayitPage.module.css'

/* ── Adım tanımları ── */
const ADIMLAR = [
  { no: 1, baslik: 'Kişisel Bilgiler' },
  { no: 2, baslik: 'Hesap Bilgileri' },
  { no: 3, baslik: 'Güvenlik' },
  { no: 4, baslik: 'Onay' },
]

/* ── Şifre gücü hesaplama ── */
function sifreGucu(sifre: string): { puan: number; metin: string; renk: string } {
  let puan = 0
  if (sifre.length >= 8)    puan++
  if (/[A-Z]/.test(sifre)) puan++
  if (/[0-9]/.test(sifre)) puan++
  if (/[^A-Za-z0-9]/.test(sifre)) puan++
  const harita: Record<number, { metin: string; renk: string }> = {
    0: { metin: '', renk: 'transparent' },
    1: { metin: 'Zayıf', renk: '#ff4757' },
    2: { metin: 'Orta', renk: '#f0b429' },
    3: { metin: 'İyi', renk: '#0066ff' },
    4: { metin: 'Güçlü', renk: '#00d4aa' },
  }
  return { puan, ...harita[puan] }
}

export function KayitPage() {
  const navigate = useNavigate()
  const [adim, setAdim] = useState(1)

  /* Form state */
  const [form, setForm] = useState({
    ad: '',
    soyad: '',
    dogumTarihi: '',
    telefon: '',
    email: '',
    kullaniciAdi: '',
    sifre: '',
    sifreTekrar: '',
    hesapTipi: 'bireysel',
    sirketAdi: '',
    kvkk: false,
    kullanim: false,
    pazarlama: false,
  })

  const set = (key: string, val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const guc = sifreGucu(form.sifre)

  const ileri = (e: React.FormEvent) => {
    e.preventDefault()
    if (adim < 4) setAdim(a => a + 1)
    else {
      // Kayıt tamamlandı → giriş sayfasına yönlendir
      navigate(paths.giris)
    }
  }

  const geri = () => setAdim(a => Math.max(1, a - 1))

  return (
    <div className={styles.page}>
      {/* Sol panel */}
      <div className={styles.panel}>
        <div className={styles.panelGlow} />

        <div className={styles.panelLogo} onClick={() => navigate(paths.landing)}>
          <div className={styles.logoMark}>F</div>
          <span className={styles.logoText}>FinansPortalı</span>
        </div>

        <div className={styles.panelBody}>
          <h2 className={styles.panelTitle}>
            Türkiye'nin en kapsamlı<br />
            <span>finans platformuna</span> katılın
          </h2>
          <p className={styles.panelDesc}>
            50+ modül, gerçek zamanlı piyasa verileri ve yapay zeka destekli analiz
            araçlarıyla finansal hedeflerinize ulaşın.
          </p>

          {/* Adım göstergesi — sol panel */}
          <div className={styles.adimlar}>
            {ADIMLAR.map(a => (
              <div
                key={a.no}
                className={`${styles.adim} ${adim === a.no ? styles.adimAktif : ''} ${adim > a.no ? styles.adimTamam : ''}`}
              >
                <div className={styles.adimNo}>
                  {adim > a.no ? '✓' : a.no}
                </div>
                <div className={styles.adimBaslik}>{a.baslik}</div>
              </div>
            ))}
          </div>

          {/* Güven ikonları */}
          <div className={styles.guven}>
            <div className={styles.guvenItem}><span>🔐</span> Keycloak SSO</div>
            <div className={styles.guvenItem}><span>🛡</span> 256-bit SSL</div>
            <div className={styles.guvenItem}><span>🇹🇷</span> KVKK Uyumlu</div>
          </div>
        </div>
      </div>

      {/* Sağ — form */}
      <div className={styles.formSide}>
        <div className={styles.card}>
          {/* Adım başlığı */}
          <div className={styles.cardTop}>
            <div className={styles.adimIlerleme}>
              {ADIMLAR.map(a => (
                <div
                  key={a.no}
                  className={`${styles.ilerlemeNokt} ${adim >= a.no ? styles.ilerlemeAktif : ''}`}
                />
              ))}
            </div>
            <div className={styles.adimMetin}>{adim} / {ADIMLAR.length}</div>
          </div>

          <h2 className={styles.cardTitle}>{ADIMLAR[adim - 1].baslik}</h2>

          <form onSubmit={ileri}>

            {/* ══ Adım 1: Kişisel Bilgiler ══ */}
            {adim === 1 && (
              <div className={styles.alanlar}>
                <div className={styles.satirIki}>
                  <div className={styles.alan}>
                    <label>Ad</label>
                    <input
                      type="text"
                      placeholder="Adınız"
                      value={form.ad}
                      onChange={e => set('ad', e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.alan}>
                    <label>Soyad</label>
                    <input
                      type="text"
                      placeholder="Soyadınız"
                      value={form.soyad}
                      onChange={e => set('soyad', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.alan}>
                  <label>Doğum Tarihi</label>
                  <input
                    type="date"
                    value={form.dogumTarihi}
                    onChange={e => set('dogumTarihi', e.target.value)}
                    required
                  />
                </div>

                <div className={styles.alan}>
                  <label>Telefon Numarası</label>
                  <input
                    type="tel"
                    placeholder="+90 5XX XXX XX XX"
                    value={form.telefon}
                    onChange={e => set('telefon', e.target.value)}
                    required
                  />
                </div>

                <div className={styles.alan}>
                  <label>Hesap Tipi</label>
                  <div className={styles.hesapTipi}>
                    {[
                      { val: 'bireysel', label: '👤 Bireysel' },
                      { val: 'kurumsal', label: '🏢 Kurumsal' },
                    ].map(h => (
                      <button
                        key={h.val}
                        type="button"
                        className={`${styles.tipBtn} ${form.hesapTipi === h.val ? styles.tipBtnAktif : ''}`}
                        onClick={() => set('hesapTipi', h.val)}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {form.hesapTipi === 'kurumsal' && (
                  <div className={styles.alan}>
                    <label>Şirket Adı</label>
                    <input
                      type="text"
                      placeholder="Şirket unvanı"
                      value={form.sirketAdi}
                      onChange={e => set('sirketAdi', e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* ══ Adım 2: Hesap Bilgileri ══ */}
            {adim === 2 && (
              <div className={styles.alanlar}>
                <div className={styles.alan}>
                  <label>E-posta Adresi</label>
                  <input
                    type="email"
                    placeholder="ornek@sirket.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <span className={styles.alanIpucu}>Doğrulama e-postası gönderilecek</span>
                </div>

                <div className={styles.alan}>
                  <label>Kullanıcı Adı</label>
                  <input
                    type="text"
                    placeholder="kullanici_adi"
                    value={form.kullaniciAdi}
                    onChange={e => set('kullaniciAdi', e.target.value.toLowerCase().replace(/\s/g, '_'))}
                    required
                    autoComplete="username"
                  />
                  <span className={styles.alanIpucu}>Küçük harf, rakam ve alt çizgi kullanabilirsiniz</span>
                </div>
              </div>
            )}

            {/* ══ Adım 3: Güvenlik ══ */}
            {adim === 3 && (
              <div className={styles.alanlar}>
                <div className={styles.alan}>
                  <label>Şifre</label>
                  <input
                    type="password"
                    placeholder="En az 8 karakter"
                    value={form.sifre}
                    onChange={e => set('sifre', e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  {form.sifre.length > 0 && (
                    <div className={styles.sifreGuc}>
                      <div className={styles.sifreGucBar}>
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={styles.sifreGucSegment}
                            style={{ background: i <= guc.puan ? guc.renk : 'rgba(245,240,232,0.1)' }}
                          />
                        ))}
                      </div>
                      <span style={{ color: guc.renk, fontSize: '0.72rem', fontWeight: 700 }}>
                        {guc.metin}
                      </span>
                    </div>
                  )}
                  <div className={styles.sifreKurallar}>
                    {[
                      { kural: form.sifre.length >= 8, metin: 'En az 8 karakter' },
                      { kural: /[A-Z]/.test(form.sifre), metin: 'Büyük harf' },
                      { kural: /[0-9]/.test(form.sifre), metin: 'Rakam' },
                      { kural: /[^A-Za-z0-9]/.test(form.sifre), metin: 'Özel karakter' },
                    ].map(k => (
                      <div
                        key={k.metin}
                        className={styles.sifreKural}
                        style={{ color: k.kural ? '#00d4aa' : 'rgba(245,240,232,0.35)' }}
                      >
                        {k.kural ? '✓' : '○'} {k.metin}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.alan}>
                  <label>Şifre Tekrar</label>
                  <input
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    value={form.sifreTekrar}
                    onChange={e => set('sifreTekrar', e.target.value)}
                    required
                    autoComplete="new-password"
                    style={{
                      borderColor: form.sifreTekrar && form.sifre !== form.sifreTekrar
                        ? '#ff4757'
                        : form.sifreTekrar && form.sifre === form.sifreTekrar
                        ? '#00d4aa'
                        : undefined,
                    }}
                  />
                  {form.sifreTekrar && form.sifre !== form.sifreTekrar && (
                    <span className={styles.hata}>Şifreler eşleşmiyor</span>
                  )}
                </div>

                <div className={styles.twoFaInfo}>
                  <div className={styles.twoFaIcon}>📱</div>
                  <div>
                    <div className={styles.twoFaBaslik}>İki Faktörlü Doğrulama (2FA)</div>
                    <div className={styles.twoFaAciklama}>
                      Kayıt sonrası Google Authenticator veya benzeri bir uygulama ile 2FA kurabilirsiniz.
                      Hesap güvenliğiniz için şiddetle tavsiye edilir.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ Adım 4: Onay ══ */}
            {adim === 4 && (
              <div className={styles.alanlar}>
                {/* Özet */}
                <div className={styles.ozet}>
                  <div className={styles.ozetBaslik}>Kayıt Özeti</div>
                  <div className={styles.ozetSatir}>
                    <span className={styles.ozetEtiket}>Ad Soyad</span>
                    <span className={styles.ozetDeger}>{form.ad} {form.soyad}</span>
                  </div>
                  <div className={styles.ozetSatir}>
                    <span className={styles.ozetEtiket}>E-posta</span>
                    <span className={styles.ozetDeger}>{form.email}</span>
                  </div>
                  <div className={styles.ozetSatir}>
                    <span className={styles.ozetEtiket}>Kullanıcı Adı</span>
                    <span className={styles.ozetDeger}>@{form.kullaniciAdi}</span>
                  </div>
                  <div className={styles.ozetSatir}>
                    <span className={styles.ozetEtiket}>Hesap Tipi</span>
                    <span className={styles.ozetDeger}>{form.hesapTipi === 'bireysel' ? 'Bireysel' : 'Kurumsal'}</span>
                  </div>
                  {form.hesapTipi === 'kurumsal' && (
                    <div className={styles.ozetSatir}>
                      <span className={styles.ozetEtiket}>Şirket</span>
                      <span className={styles.ozetDeger}>{form.sirketAdi}</span>
                    </div>
                  )}
                </div>

                {/* Onay kutucukları */}
                <div className={styles.onaylar}>
                  <label className={styles.onayLabel}>
                    <input
                      type="checkbox"
                      checked={form.kvkk}
                      onChange={e => set('kvkk', e.target.checked)}
                      required
                    />
                    <span>
                      <a href="#kvkk" className={styles.link}>KVKK Aydınlatma Metni</a>'ni
                      okudum ve kabul ediyorum. <span className={styles.zorunlu}>*</span>
                    </span>
                  </label>
                  <label className={styles.onayLabel}>
                    <input
                      type="checkbox"
                      checked={form.kullanim}
                      onChange={e => set('kullanim', e.target.checked)}
                      required
                    />
                    <span>
                      <a href="#kullanim" className={styles.link}>Kullanım Koşulları</a>'nı
                      ve <a href="#gizlilik" className={styles.link}>Gizlilik Politikası</a>'nı
                      kabul ediyorum. <span className={styles.zorunlu}>*</span>
                    </span>
                  </label>
                  <label className={styles.onayLabel}>
                    <input
                      type="checkbox"
                      checked={form.pazarlama}
                      onChange={e => set('pazarlama', e.target.checked)}
                    />
                    <span>Kampanya ve duyurulardan e-posta ile haberdar olmak istiyorum. (İsteğe bağlı)</span>
                  </label>
                </div>

                <div className={styles.sonBilgi}>
                  <span>🔒</span>
                  Hesabınız 256-bit SSL şifreleme ile korunmaktadır. Verileriniz asla
                  üçüncü taraflarla paylaşılmaz.
                </div>
              </div>
            )}

            {/* Butonlar */}
            <div className={styles.btnGrubu}>
              {adim > 1 && (
                <button type="button" className={styles.geriBtn} onClick={geri}>
                  ← Geri
                </button>
              )}
              <button
                type="submit"
                className={styles.ileriBtn}
                disabled={adim === 3 && (form.sifre !== form.sifreTekrar || form.sifre.length < 8)}
              >
                {adim === 4 ? 'Hesabı Oluştur →' : 'Devam Et →'}
              </button>
            </div>
          </form>

          <div className={styles.girisLink}>
            Zaten hesabınız var mı?{' '}
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => navigate(paths.giris)}
            >
              Giriş Yapın
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
