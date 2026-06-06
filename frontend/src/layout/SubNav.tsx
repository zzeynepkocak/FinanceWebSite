import { NavLink } from 'react-router-dom'
import { paths } from '../routes/paths'
import styles from './SubNav.module.css'

const tabs = [
  { to: paths.home,      label: 'Dashboard'   },
  { to: paths.piyasa,    label: 'Piyasalar'   },
  { to: paths.analiz,    label: 'Analiz'      },
  { to: paths.portfoyum, label: 'Portföy'     },
  { to: paths.haberler,  label: 'Haberler'    },
  { to: paths.tickets,   label: 'Destek'      },
  { to: paths.twoFactor, label: '2FA Güvenlik'},
]

export function SubNav() {
  return (
    <>
      <div className={styles.bar}>
        {tabs.map(({ to, label }) => (
          <NavLink
            key={label}
            to={to}
            end={to === paths.home}
            className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
          >
            {label}
          </NavLink>
        ))}
      </div>
      <div className={styles.banner}>
        <span className={styles.bannerText}>
          Toyota &amp; 32Bit Finans Portali — Canlı piyasa verileri, analiz ve portföy yönetimi
        </span>
        <span className={styles.bannerArrow}> &gt;</span>
      </div>
    </>
  )
}
