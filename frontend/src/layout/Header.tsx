import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/KeycloakProvider'
import { paths } from '../routes/paths'
import { SubNav } from './SubNav'
import styles from './Header.module.css'

const navItems = [
  { to: paths.home, label: 'Ürünler' },
  { to: paths.haberler, label: 'Topluluk' },
  { to: paths.piyasa, label: 'Piyasalar' },
  { to: paths.portfoyum, label: 'Portföy' },
  { to: paths.analiz, label: 'Aracı kurum' },
  { to: paths.home, label: 'Daha fazla' },
]

export function Header() {
  const { isAuthenticated, login, logout } = useAuth()

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon} />
            <NavLink to={paths.home} className={styles.logo}>
              NovaView
            </NavLink>
          </div>
          <div className={styles.search}>
            <span className={styles.searchPlaceholder}>Ara (Ctrl+K)</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map(({ to, label }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.right}>
          <button type="button" className={styles.lang}>TR</button>
          {isAuthenticated ? (
            <>
              <span className={styles.userLabel}>Kullanıcı</span>
              <button type="button" onClick={logout} className={styles.btnSecondary}>
                Çıkış
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => login()} className={styles.btnSecondary}>
                Giriş
              </button>
              <button type="button" onClick={() => login()} className={styles.btnPrimary}>
                Şimdi başlat
              </button>
            </>
          )}
        </div>
      </header>
      <SubNav />
    </>
  )
}
