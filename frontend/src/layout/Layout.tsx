import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/KeycloakProvider'
import { paths } from '../routes/paths'
import styles from './Layout.module.css'

/* ─────────────────── NAV STRUCTURE ─────────────────── */
type NavItem = { to: string; label: string; icon: React.ReactNode }
type NavGroup = { section: string; items: NavItem[] }

function ico(d: string) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const NAV_GROUPS: NavGroup[] = [
  {
    section: 'Ana Menü',
    items: [
      { to: paths.dashboard,      label: 'Dashboard',          icon: ico('M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z') },
      { to: paths.piyasa,         label: 'Piyasalar',          icon: ico('M22 12l-4 0-3 9L9 3l-3 9-4 0') },
      { to: paths.piyasaTahmin,   label: 'Piyasa Tahminleri',  icon: ico('M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2') },
      { to: paths.analiz,         label: 'Analiz',             icon: ico('M6 20V14M12 20V4M18 20V10') },
      { to: paths.portfoyum,      label: 'Portföyüm',         icon: ico('M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z') },
      { to: paths.islemGecmisi,   label: 'İşlem Geçmişi',     icon: ico('M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11') },
      { to: paths.haberler,       label: 'Haberler',           icon: ico('M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0-2-2H8a2 2 0 0-2 2v16a2 2 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8V6Z') },
    ],
  },
  {
    section: 'Yatırım & Borsa',
    items: [
      { to: paths.portfoyOpt,     label: 'Portföy Optimizasyonu', icon: ico('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5') },
      { to: paths.vadeliIslemler, label: 'Vadeli İşlemler',     icon: ico('M13 2L3 14h9l-1 8 10-12h-9l1-8z') },
      { to: paths.gelismisEmir,   label: 'Gelişmiş Emirler',    icon: ico('M3 6h18M3 12h18M3 18h18') },
      { to: paths.ipo,            label: 'Halka Arz (IPO)',     icon: ico('M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6') },
      { to: paths.tahvil,         label: 'Tahvil & Bono',       icon: ico('M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z') },
      { to: paths.performans,     label: 'Performans Analitik', icon: ico('M18 20V10M12 20V4M6 20v-6') },
      { to: paths.arbitraj,       label: 'Arbitraj Monitörü',   icon: ico('M4 4h16v16H4zM9 9h6v6H9z') },
    ],
  },
  {
    section: 'Kripto & DeFi',
    items: [
      { to: paths.kripto,         label: 'Kripto Cüzdan',       icon: ico('M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2M23 12h-3a2 2 0 0 0 0 4h3v-4z') },
      { to: paths.kriptoIslem,    label: 'Kripto İşlemler',     icon: ico('M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v4l3 3') },
      { to: paths.dca,            label: 'Otomatik Yatırım (DCA)', icon: ico('M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3') },
      { to: paths.donanımCuzdan,  label: 'Donanım Cüzdan',      icon: ico('M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 12m-1 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0') },
    ],
  },
  {
    section: 'Ödeme & Kartlar',
    items: [
      { to: paths.kartlarim,      label: 'Kartlarım',           icon: ico('M1 4h22v16H1zM1 10h22') },
      { to: paths.sadakat,        label: 'Sadakat & Cashback',  icon: ico('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z') },
      { to: paths.acikBankacilik, label: 'Açık Bankacılık',    icon: ico('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10') },
      { to: paths.seyahat,        label: 'Seyahat Modu',        icon: ico('M12 2L2 19h20L12 2zM12 15v-4M12 19h.01') },
    ],
  },
  {
    section: 'Bütçe & Planlama',
    items: [
      { to: paths.butce,          label: 'Bütçe & Tasarruf',   icon: ico('M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM16 8h-6.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H8') },
      { to: paths.nakitAkisi,     label: 'Nakit Akışı',         icon: ico('M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6') },
      { to: paths.faturaVergi,    label: 'Fatura & Vergi',      icon: ico('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8') },
      { to: paths.borcAlacak,     label: 'Borç & Alacak',       icon: ico('M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2m2 4h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm7-5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z') },
      { to: paths.kredi,          label: 'Kredi & Skor',         icon: ico('M9 11l3 3 8-8M21 12c0 5-3.1 9.3-7.4 10.8a1 1 0 0 1-.6 0C8.1 21.3 5 17 5 12V5.8a1 1 0 0 1 .7-1L12 3l6.3 1.8a1 1 0 0 1 .7 1V12z') },
    ],
  },
  {
    section: 'Varlık & Yatırım',
    items: [
      { to: paths.altin,          label: 'Altın & Kıymetli Maden', icon: ico('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5') },
      { to: paths.gayrimenkul,    label: 'Gayrimenkul',          icon: ico('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z') },
      { to: paths.gyo,            label: 'GYO & Fraksiyonel',    icon: ico('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m6 0h-6') },
      { to: paths.emtia,          label: 'Emtia & Enerji',       icon: ico('M12 22V12M12 12L6 6M12 12l6-6M2 12h4M18 12h4') },
      { to: paths.girisim,        label: 'Girişim & Melek Yatırım', icon: ico('M22 12h-4l-3 9L9 3l-3 9H2') },
    ],
  },
  {
    section: 'Sigorta & Emeklilik',
    items: [
      { to: paths.sigorta,        label: 'Sigorta & Risk',       icon: ico('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') },
      { to: paths.bes,            label: 'BES & Emeklilik',      icon: ico('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75') },
      { to: paths.stresTesti,     label: 'Stres Testi & Check-Up', icon: ico('M22 12h-4l-3 9L9 3l-3 9H2') },
    ],
  },
  {
    section: 'Kurumsal & Finans',
    items: [
      { to: paths.kurumsal,       label: 'Kurumsal Finans',      icon: ico('M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4') },
      { to: paths.hazine,         label: 'Hazine & Nakit Pool',  icon: ico('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z') },
      { to: paths.eticaret,       label: 'E-Ticaret Finansmanı', icon: ico('M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0') },
      { to: paths.sendikasyon,    label: 'Sendikasyon & Büyük Kredi', icon: ico('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75') },
      { to: paths.tesvik,         label: 'Teşvik & Hibe',         icon: ico('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z') },
    ],
  },
  {
    section: 'Sosyal & Özel',
    items: [
      { to: paths.sosyalFinans,   label: 'Sosyal Finans',        icon: ico('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75') },
      { to: paths.bagis,          label: 'Bağış & Sosyal Sorumluluk', icon: ico('M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z') },
      { to: paths.cocukHesabi,    label: 'Çocuk Hesabı (Junior)',  icon: ico('M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01') },
      { to: paths.miras,          label: 'Miras & Varlık Devir', icon: ico('M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5') },
      { to: paths.egitimAI,       label: 'Eğitim & AI Koçu',     icon: ico('M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z') },
    ],
  },
  {
    section: 'Güvenlik & Ayarlar',
    items: [
      { to: paths.ayarlar,        label: 'Ayarlar',              icon: ico('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33A1.65 1.65 0 0 0 14 21v.09a2 2 0 0 1-4 0V21a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68A1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z') },
      { to: paths.kyc,            label: 'KYC & Kimlik',          icon: ico('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z') },
      { to: paths.twoFactor,      label: '2FA Güvenlik',          icon: ico('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') },
      { to: paths.bildirimAyarlari, label: 'Bildirim Ayarları',   icon: ico('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0') },
      { to: paths.apiYonetimi,    label: 'API & Geliştirici',     icon: ico('M16 18l6-6-6-6M8 6l-6 6 6 6') },
      { to: paths.widgetAyarlari, label: 'Widget & Tema Ayarları', icon: ico('M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4zM14 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z') },
    ],
  },
  {
    section: 'Destek & Uyumluluk',
    items: [
      { to: paths.tickets,        label: 'Müşteri Desteği',      icon: ico('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z') },
      { to: paths.aml,            label: 'AML & Uyumluluk',      icon: ico('M9 11l3 3 8-8M21 12c0 5-3.1 9.3-7.4 10.8a1 1 0 0 1-.6 0C8.1 21.3 5 17 5 12V5.8a1 1 0 0 1 .7-1L12 3l6.3 1.8a1 1 0 0 1 .7 1V12z') },
      { to: paths.admin,          label: 'Admin Paneli',          icon: ico('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 0-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1m6 0h-6') },
    ],
  },
]

/* ─────────────────── ORBITAL LOGO ─────────────────── */
function OrbitalLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>{`
        @keyframes _orbit1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes _orbit2 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes _orbit3 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes _corePulse {
          0%, 100% { opacity: 1; r: 2.5px; }
          50%       { opacity: 0.6; r: 2px; }
        }
        ._o1 { transform-origin: 14px 14px; animation: _orbit1 3.2s linear infinite; }
        ._o2 { transform-origin: 14px 14px; animation: _orbit2 2s linear infinite; }
        ._o3 { transform-origin: 14px 14px; animation: _orbit3 5s linear infinite; }
        ._core { animation: _corePulse 2.8s ease-in-out infinite; }
      `}</style>
      {/* Outer ring */}
      <circle cx="14" cy="14" r="11.5" stroke="rgba(91,141,238,0.15)" strokeWidth="0.75" />
      {/* Middle ring */}
      <circle cx="14" cy="14" r="7" stroke="rgba(91,141,238,0.22)" strokeWidth="0.75" />
      {/* Core */}
      <circle className="_core" cx="14" cy="14" r="2.5" fill="#5b8dee" />
      {/* Orbiting dot — outer ring */}
      <g className="_o1">
        <circle cx="25.5" cy="14" r="1.6" fill="#5b8dee" />
      </g>
      {/* Orbiting dot — middle ring */}
      <g className="_o2">
        <circle cx="21" cy="14" r="1.1" fill="#a78bfa" />
      </g>
      {/* Orbiting dot — outer ring, offset start */}
      <g className="_o3" style={{ transform: 'rotate(150deg)', transformOrigin: '14px 14px' }}>
        <circle cx="25.5" cy="14" r="1" fill="#4ade80" />
      </g>
    </svg>
  )
}

/* ─────────────────── SIDEBAR SECTION ─────────────────── */
function NavGroup({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const [open, setOpen] = useState(
    ['Ana Menü', 'Yatırım & Borsa', 'Bütçe & Planlama'].includes(group.section)
  )

  return (
    <div className={styles.navGroup}>
      <button className={styles.navSection} onClick={() => setOpen(!open)}>
        {group.section}
        {!collapsed && (
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>
      {open && group.items.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === paths.home}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
          title={collapsed ? label : undefined}
        >
          <span className={styles.navIcon}>{icon}</span>
          {!collapsed && <span className={styles.navLabel}>{label}</span>}
        </NavLink>
      ))}
    </div>
  )
}

/* ─────────────────── LAYOUT ─────────────────── */
export function Layout() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const handleLogout = () => {
    logout()
    navigate(paths.login, { replace: true })
  }

  const toggleDark = () => {
    setDarkMode(!darkMode)
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark')
  }

  return (
    <div className={`${styles.layout} ${sidebarCollapsed ? styles.layoutCollapsed : ''}`}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        {/* Logo */}
        <div className={styles.sidebarLogo}>
          <div className={styles.logoMark}>
            <OrbitalLogo />
          </div>
          {!sidebarCollapsed && <span className={styles.logoText}>FinansPortalı</span>}
          <button
            className={styles.collapseBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Genişlet' : 'Daralt'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed
                ? <polyline points="9 18 15 12 9 6" />
                : <polyline points="15 18 9 12 15 6" />
              }
            </svg>
          </button>
        </div>

        {/* Nav groups */}
        <nav className={styles.sidebarNav}>
          {NAV_GROUPS.map((g) => (
            <NavGroup key={g.section} group={g} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          {isAuthenticated && !sidebarCollapsed && (
            <div className={styles.userBlock} onClick={handleLogout} title="Çıkış yap">
              <div className={styles.avatar}>
                {user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` : 'U'}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {user ? `${user.firstName} ${user.lastName}` : 'Kullanıcı'}
                </div>
                <div className={styles.userRole}>Çıkış yap →</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <div className={styles.liveTag}>
            <span className={styles.liveDot} />
            Canlı
          </div>
          <div className={styles.topbarSearch} role="button" tabIndex={0}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Hisse, döviz, kripto, özellik ara…
          </div>
          <div className={styles.topbarRight}>
            {/* Dark mode */}
            <button className={styles.iconBtn} onClick={toggleDark} title="Tema Değiştir">
              {darkMode
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            {/* Notifications */}
            <button className={styles.iconBtn} title="Bildirimler" onClick={() => navigate(paths.bildirimAyarlari)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className={styles.notifBadge}>3</span>
            </button>
            {/* Settings */}
            <button className={styles.iconBtn} title="Ayarlar" onClick={() => navigate(paths.ayarlar)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
            {/* Profile */}
            <div className={styles.topbarAvatar} onClick={() => navigate(paths.ayarlar)} title="Profil">
              {user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` : 'U'}
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
