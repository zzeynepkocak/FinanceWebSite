import styles from './LoginLogo.module.css'

export function LoginLogo() {
  return (
    <div className={styles.logo}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>{`
          @keyframes orbit1 {
            from { transform: rotate(0deg) translateX(13px) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(13px) rotate(-360deg); }
          }
          @keyframes orbit2 {
            from { transform: rotate(120deg) translateX(10px) rotate(-120deg); }
            to   { transform: rotate(480deg) translateX(10px) rotate(-480deg); }
          }
          @keyframes orbit3 {
            from { transform: rotate(240deg) translateX(7px) rotate(-240deg); }
            to   { transform: rotate(600deg) translateX(7px) rotate(-600deg); }
          }
          @keyframes pulse {
            0%,100% { opacity:0.85; }
            50%      { opacity:1; }
          }
          .o1 { animation: orbit1 3s linear infinite; transform-origin: 20px 20px; }
          .o2 { animation: orbit2 5s linear infinite; transform-origin: 20px 20px; }
          .o3 { animation: orbit3 7s linear infinite; transform-origin: 20px 20px; }
          .core { animation: pulse 2s ease-in-out infinite; }
        `}</style>
        <ellipse cx="20" cy="20" rx="14" ry="5.5" stroke="rgba(91,141,238,0.3)" strokeWidth="1" fill="none" transform="rotate(-25 20 20)"/>
        <ellipse cx="20" cy="20" rx="11" ry="4"   stroke="rgba(91,141,238,0.2)" strokeWidth="1" fill="none" transform="rotate(45 20 20)"/>
        <ellipse cx="20" cy="20" rx="8"  ry="3"   stroke="rgba(91,141,238,0.15)" strokeWidth="1" fill="none" transform="rotate(10 20 20)"/>
        <circle className="o1" cx="20" cy="20" r="2"   fill="#5b8dee"/>
        <circle className="o2" cx="20" cy="20" r="1.5" fill="#a0b8f0" opacity="0.8"/>
        <circle className="o3" cx="20" cy="20" r="1.2" fill="#5b8dee" opacity="0.6"/>
        <circle className="core" cx="20" cy="20" r="4.5" fill="#1a2a4a"/>
        <circle cx="20" cy="20" r="2.5" fill="#5b8dee"/>
        <circle cx="20" cy="20" r="1.2" fill="white" opacity="0.95"/>
      </svg>
      <span>Finans Portalı</span>
    </div>
  )
}
