import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/KeycloakProvider'
import { paths } from '../routes/paths'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [otp, setOtp] = useState(false)
  const registeredSuccess = new URLSearchParams(location.search).get('registered') === '1'

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(paths.home, { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  const [loggingIn, setLoggingIn] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError(null)
    try {
      await login(username, password)
      // Navigasyon, isAuthenticated true olunca yukarıdaki useEffect tarafından yapılır
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Giriş başarısız. Lütfen tekrar deneyin.')
      setLoggingIn(false)
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Yükleniyor…</div>
  }

  return (
    <div className={styles.wrapper}>
      {/* Left panel */}
      <div className={styles.panel}>
        <div className={styles.panelGlow} />

        <div className={styles.panelLogo}>
          <div className={styles.logoMark}>F</div>
          <span className={styles.logoText}>FinansPortalı</span>
        </div>

        <div>
          <h1 className={styles.panelHeadline}>
            Finansal zekâyı<br /><span>tek ekrana</span> taşı.
          </h1>
          <p className={styles.panelSub}>
            Toyota & 32Bit iş birliğiyle geliştirilen kurumsal finans portalına
            hoş geldiniz. Piyasaları, portföyü ve analizleri gerçek zamanlı yönetin.
          </p>
        </div>

        <div className={styles.panelStats}>
          {[
            { val: '13.915', label: 'BIST 100' },
            { val: '38,42',  label: 'USD/TRY' },
            { val: '+0.28%', label: 'Günlük' },
            { val: '2.847',  label: 'Altın/gr' },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className={styles.formSide}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Hesabınıza giriş yapın</h2>
          <p className={styles.cardSub}>Kurumsal finans portalına giriş yapın</p>

          {registeredSuccess && (
            <div style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid var(--profit)', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.82rem', color: 'var(--profit)', fontWeight: 500, marginBottom: '1rem' }}>
              ✓ Hesabınız oluşturuldu! Şimdi giriş yapabilirsiniz.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {loginError && (
              <div style={{ background: 'rgba(255,71,87,0.12)', border: '1px solid #ff4757', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.82rem', color: '#ff4757', fontWeight: 500, marginBottom: '1rem' }}>
                ✕ {loginError}
              </div>
            )}
            <div className={styles.field}>
              <label htmlFor="username">Kullanıcı adı / E-posta</label>
              <input
                id="username"
                type="text"
                placeholder="kullanici@sirket.com.tr"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.options}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Beni hatırla
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={otp}
                  onChange={(e) => setOtp(e.target.checked)}
                />
                İki faktörlü doğrulama (2FA)
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loggingIn}>
              {loggingIn ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </button>
          </form>

          <p className={styles.forgot}>
            <a href="#sifremi-unuttum">Şifremi unuttum</a>
          </p>

          <div className={styles.kayitLink}>
            Hesabınız yok mu?{' '}
            <button
              type="button"
              className={styles.kayitBtn}
              onClick={() => navigate(paths.kayit)}
            >
              Ücretsiz Kayıt Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
