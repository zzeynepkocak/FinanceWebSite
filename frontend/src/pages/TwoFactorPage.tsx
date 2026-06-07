import { useState } from 'react'
import { publicFetch, apiFetch } from '../api/client'
import styles from './TwoFactorPage.module.css'

interface SetupData {
  secret: string
  qrCodeDataUri: string
  message: string
}

type Step = 'intro' | 'setup' | 'verify' | 'success'

const isMockMode = import.meta.env.VITE_MOCK_AUTH === 'true'

/* ── Mock TOTP secret (base32) ─────────────────────────────────────── */
const MOCK_SECRET = 'JBSWY3DPEHPK3PXP'

function buildMockSetupData(): SetupData {
  const issuer  = 'FinansPortali'
  const account = 'kullanici@toyota-finans.com.tr'
  const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${MOCK_SECRET}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
  // QR kodu Google Charts API ile üret (geliştirme ortamı)
  const qrUrl   = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(otpauth)}&choe=UTF-8`
  return {
    secret:        MOCK_SECRET,
    qrCodeDataUri: qrUrl,
    message:       'Bu demo ortamı için geçerli bir TOTP QR kodudur. Herhangi bir 6 haneli kod ile doğrulayabilirsiniz.',
  }
}

export function TwoFactorPage() {
  const [step, setStep]           = useState<Step>('intro')
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [code, setCode]           = useState('')
  const [error, setError]         = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [copied, setCopied]       = useState(false)

  /* ── Setup ── */
  async function handleSetup() {
    setLoading(true); setError(null)
    try {
      if (isMockMode) {
        // Mock mod: backend'e gitmeden yerel veri üret
        await new Promise(r => setTimeout(r, 400))
        setSetupData(buildMockSetupData())
      } else {
        const data = await publicFetch<SetupData>('/api/v1/auth/2fa/setup', { method: 'POST' })
        setSetupData(data)
      }
      setStep('setup')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '2FA kurulumu başlatılamadı')
    } finally {
      setLoading(false)
    }
  }

  /* ── Verify ── */
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!setupData || !code.trim()) { setError('Lütfen 6 haneli kodu giriniz'); return }
    setLoading(true); setError(null)
    try {
      if (isMockMode) {
        // Mock mod: herhangi bir 6 haneli kod geçerli
        await new Promise(r => setTimeout(r, 600))
        setStep('success')
      } else {
        await apiFetch<{ valid: boolean }>('/api/v1/auth/2fa/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: setupData.secret, code: code.trim() }),
        })
        setStep('success')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Kod doğrulanamadı. Lütfen tekrar deneyin.')
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  function copySecret() {
    if (!setupData) return
    navigator.clipboard.writeText(setupData.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCodeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(v)
    if (error) setError(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* ── Intro ── */}
        {step === 'intro' && (
          <div className={styles.section}>
            <div className={styles.iconWrap}>
              <span className={styles.icon}>🔐</span>
            </div>
            <h1 className={styles.title}>İki Faktörlü Doğrulama</h1>
            <p className={styles.desc}>
              Hesabınızı korumak için TOTP tabanlı iki faktörlü doğrulamayı etkinleştirin.
              Google Authenticator, Authy veya Microsoft Authenticator uygulamalarıyla çalışır.
            </p>

            <div className={styles.featureList}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span>Her girişte 6 haneli tek kullanımlık kod</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span>30 saniyede bir yenilenen güvenli kod</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span>Kimlik avı saldırılarına karşı koruma</span>
              </div>
            </div>

            {isMockMode && (
              <div className={styles.infoBox}>
                <span className={styles.infoIcon}>🧪</span>
                <span>Mock mod aktif — backend olmadan çalışır. Doğrulama adımında herhangi bir 6 haneli kod kabul edilir.</span>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.primaryBtn} onClick={handleSetup} disabled={loading}>
              {loading ? 'Başlatılıyor...' : '2FA Kurulumunu Başlat'}
            </button>
          </div>
        )}

        {/* ── Setup — QR + secret ── */}
        {step === 'setup' && setupData && (
          <div className={styles.section}>
            <h1 className={styles.title}>QR Kodu Tarayın</h1>
            <p className={styles.desc}>
              Authenticator uygulamanızı açın ve aşağıdaki QR kodu tarayın.
            </p>

            <div className={styles.qrWrap}>
              <img
                src={setupData.qrCodeDataUri}
                alt="2FA QR Kodu"
                className={styles.qrImg}
                onError={e => {
                  // QR yüklenemezse placeholder göster
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>

            <div className={styles.secretBox}>
              <span className={styles.secretLabel}>Manuel giriş için secret:</span>
              <div className={styles.secretRow}>
                <code className={styles.secretCode}>{setupData.secret}</code>
                <button className={styles.copyBtn} onClick={copySecret}>
                  {copied ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.infoIcon}>ℹ️</span>
              <span>{setupData.message}</span>
            </div>

            <button className={styles.primaryBtn} onClick={() => setStep('verify')}>
              Devam Et — Kodu Doğrula
            </button>
          </div>
        )}

        {/* ── Verify ── */}
        {step === 'verify' && (
          <div className={styles.section}>
            <h1 className={styles.title}>Kodu Doğrulayın</h1>
            <p className={styles.desc}>
              {isMockMode
                ? 'Mock mod: herhangi bir 6 haneli kodu girin (ör: 123456)'
                : 'Authenticator uygulamanızda görünen 6 haneli kodu girin.'}
            </p>

            <form onSubmit={handleVerify} className={styles.verifyForm}>
              <div className={styles.codeInputWrap}>
                <input
                  className={`${styles.codeInput} ${error ? styles.codeInputError : ''}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000000"
                  value={code}
                  onChange={handleCodeInput}
                  maxLength={6}
                  autoFocus
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.verifyActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => { setStep('setup'); setCode(''); setError(null) }}
                >
                  ← Geri
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={loading || code.length < 6}
                >
                  {loading ? 'Doğrulanıyor...' : 'Doğrula'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Success ── */}
        {step === 'success' && (
          <div className={styles.section}>
            <div className={styles.iconWrap}>
              <span className={styles.iconSuccess}>✅</span>
            </div>
            <h1 className={styles.title}>2FA Aktif!</h1>
            <p className={styles.desc}>
              İki faktörlü doğrulama başarıyla kuruldu ve doğrulandı.
              Artık hesabınız ekstra güvence altında.
            </p>

            <div className={styles.successBox}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span>Secret güvenli şekilde kaydedildi</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span>TOTP doğrulaması tamamlandı</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <span>Hesabınız artık korumalı</span>
              </div>
            </div>

            <button
              className={styles.secondaryBtn}
              onClick={() => { setStep('intro'); setSetupData(null); setCode('') }}
            >
              Yeniden Kur
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
