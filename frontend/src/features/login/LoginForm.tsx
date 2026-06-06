import { useState } from 'react'
import styles from './LoginForm.module.css'

type Props = { onLogin: () => void }

export function LoginForm({ onLogin }: Props) {
  const [remember, setRemember] = useState(false)
  const [otpEnabled, setOtpEnabled] = useState(false)

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        onLogin()
      }}
    >
      <div className={styles.field}>
        <label htmlFor="username">Kullanıcı adı / E-posta</label>
        <input id="username" type="text" placeholder="Kullanıcı adı veya e-posta" autoComplete="username" />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">Şifre</label>
        <input id="password" type="password" placeholder="Şifre" autoComplete="current-password" />
      </div>
      <div className={styles.options}>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Beni hatırla
        </label>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={otpEnabled} onChange={(e) => setOtpEnabled(e.target.checked)} />
          2FA (OTP) – gerekiyorsa alan
        </label>
      </div>
      <button type="submit" className={styles.submit}>
        Giriş Yap
      </button>
      <p className={styles.forgot}>
        <a href="#sifremi-unuttum">Şifremi unuttum</a>
      </p>
    </form>
  )
}
