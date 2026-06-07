import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/KeycloakProvider'
import { paths } from '../routes/paths'
import styles from './LandingPage.module.css'

/* ── Ticker tape verileri ── */
const TICKER = [
  { s: 'BIST 100', v: '13.915', c: '+0.28%', up: true },
  { s: 'USD/TRY', v: '38,42', c: '+0.15%', up: true },
  { s: 'EUR/TRY', v: '41,85', c: '-0.08%', up: false },
  { s: 'Altın/gr', v: '2.847', c: '+1.24%', up: true },
  { s: 'BTC/USD', v: '65.200', c: '+4.20%', up: true },
  { s: 'ETH/USD', v: '3.480', c: '+2.80%', up: true },
  { s: 'GARAN', v: '98,40', c: '+2.15%', up: true },
  { s: 'THYAO', v: '287,50', c: '-0.85%', up: false },
  { s: 'ASELS', v: '44,30', c: '+0.90%', up: true },
  { s: 'Gümüş/oz', v: '31,42', c: '+0.62%', up: true },
  { s: 'AKBNK', v: '52,80', c: '+1.45%', up: true },
  { s: 'Petrol/WTI', v: '78,50', c: '-0.33%', up: false },
]

/* ── Özellik listesi ── */
const FEATURES = [
  {
    icon: '📊',
    title: 'Gerçek Zamanlı Piyasa',
    desc: 'BIST 100, forex, kripto ve emtia verilerini canlı takip edin. Teknik analiz araçlarıyla bilinçli kararlar alın.',
    renk: '#0066ff',
  },
  {
    icon: '💼',
    title: 'Portföy Yönetimi',
    desc: 'Hisse, döviz, kripto ve altın varlıklarınızı tek platformda yönetin. Otomatik kar/zarar takibi.',
    renk: '#00d4aa',
  },
  {
    icon: '🔐',
    title: 'Kurumsal Güvenlik',
    desc: 'Keycloak SSO, 2FA TOTP ve KYC kimlik doğrulama ile bankacılık seviyesinde güvenlik.',
    renk: '#6c5ce7',
  },
  {
    icon: '🤖',
    title: 'Yapay Zeka Koçu',
    desc: 'AI destekli bütçe koçu, harcama anomali tespiti ve kişiselleştirilmiş yatırım önerileri.',
    renk: '#f0b429',
  },
  {
    icon: '📈',
    title: 'Vadeli & Kaldıraçlı',
    desc: '1x–100x kaldıraç ile vadeli işlemler, emir defterleri ve derinlik grafikleri.',
    renk: '#e17055',
  },
  {
    icon: '🏦',
    title: 'Açık Bankacılık',
    desc: 'PSD2 ile tüm banka hesaplarınızı tek noktada birleştirin. Otomatik senkronizasyon.',
    renk: '#fd79a8',
  },
  {
    icon: '💎',
    title: 'Kripto & DeFi',
    desc: 'MetaMask bağlantısı, token swap, staking havuzları ve NFT galerisi.',
    renk: '#55efc4',
  },
  {
    icon: '🏠',
    title: 'Gayrimenkul & GYO',
    desc: 'Fraksiyonel gayrimenkul yatırımı, kira geliri takibi ve bölgesel fiyat analizi.',
    renk: '#74b9ff',
  },
]

/* ── İstatistikler ── */
const STATS = [
  { val: '50+', label: 'Finans Modülü', icon: '🧩' },
  { val: '₺2.8M', label: 'Yönetilen Varlık', icon: '💰' },
  { val: '99.9%', label: 'Uptime SLA', icon: '⚡' },
  { val: '256-bit', label: 'SSL Şifreleme', icon: '🔒' },
]

/* ── Müşteri yorumları ── */
const YORUMLAR = [
  {
    ad: 'Mehmet Yılmaz',
    unvan: 'CFO, Teknopark A.Ş.',
    yorum: 'Tüm kurumsal finansal operasyonlarımızı FinansPortalı üzerinden yürütüyoruz. Hazine yönetimi ve açık bankacılık entegrasyonu mükemmel çalışıyor.',
    avatar: 'MY',
    puan: 5,
  },
  {
    ad: 'Ayşe Kara',
    unvan: 'Bireysel Yatırımcı',
    yorum: 'Borsa, kripto ve altın portföyümü tek ekrandan yönetmek inanılmaz kolaylık. Yapay zeka önerileri gerçekten işe yarıyor.',
    avatar: 'AK',
    puan: 5,
  },
  {
    ad: 'Can Demir',
    unvan: 'KOBİ Sahibi',
    yorum: 'Muhasebe ve tedarikçi yönetiminden KOSGEB teşvik takibine kadar her şey burada. Bordro toplu ödeme modülü özellikle çok zaman kazandırıyor.',
    avatar: 'CD',
    puan: 5,
  },
]

/* ── Planlar ── */
const PLANLAR = [
  {
    ad: 'Bireysel',
    fiyat: 'Ücretsiz',
    altyazi: 'Sonsuza kadar',
    renk: '#00d4aa',
    ozellikler: [
      '5 portföy varlığı',
      'Temel piyasa verileri',
      'İşlem geçmişi',
      'Mobil uygulama',
      '1 banka bağlantısı',
    ],
    popular: false,
  },
  {
    ad: 'Premium',
    fiyat: '₺299',
    altyazi: 'aylık',
    renk: '#0066ff',
    ozellikler: [
      'Sınırsız varlık',
      'Gerçek zamanlı veriler',
      'Tüm 50 modül',
      'AI Koç & analizler',
      'Sınırsız banka bağlantısı',
      'Vadeli & kaldıraçlı işlemler',
      '7/24 öncelikli destek',
    ],
    popular: true,
  },
  {
    ad: 'Kurumsal',
    fiyat: 'Özel',
    altyazi: 'fiyatlandırma',
    renk: '#6c5ce7',
    ozellikler: [
      'Premium\'ın tamamı',
      'Çoklu şirket yönetimi',
      'Özel API entegrasyonu',
      'Hazine & cash pooling',
      'SLA garantisi',
      'Dedicated account manager',
    ],
    popular: false,
  },
]

/* ── Sparkline mini SVG ── */
function MiniChart({ up }: { up: boolean }) {
  const data = up
    ? [40, 38, 42, 45, 44, 48, 52, 50, 55, 58, 56, 62]
    : [60, 58, 55, 52, 54, 50, 48, 46, 49, 44, 42, 40]
  const w = 80, h = 28
  const min = Math.min(...data), max = Math.max(...data)
  const r = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / r) * (h - 4) - 2}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
      <polyline points={pts} fill="none" stroke={up ? '#00d4aa' : '#ff4757'} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/* ════════════════════════════════════════════ */

export function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  const [menuAcik, setMenuAcik] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Zaten giriş yapılmışsa doğrudan panele yönlendir
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(paths.home, { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.page}>

      {/* ══ Canlı Ticker Tape ══ */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className={styles.tickerItem}>
              <span className={styles.tickerSym}>{t.s}</span>
              <span className={styles.tickerVal}>{t.v}</span>
              <span className={styles.tickerChg} style={{ color: t.up ? '#00d4aa' : '#ff4757' }}>
                {t.up ? '▲' : '▼'} {t.c}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ Navbar ══ */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          {/* Logo */}
          <div className={styles.navLogo} onClick={() => navigate(paths.landing)}>
            <div className={styles.logoMark}>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 2h3v3H2zM7 2h3v3H7zM2 7h3v3H2zM7 7h3v3H7z" />
              </svg>
            </div>
            <span className={styles.logoText}>FinansPortalı</span>
            <span className={styles.logoBadge}>by Toyota & 32Bit</span>
          </div>

          {/* Masaüstü linkler */}
          <div className={styles.navLinks}>
            {[
              { label: 'Özellikler', href: '#ozellikler' },
              { label: 'Modüller', href: '#moduller' },
              { label: 'Fiyatlar', href: '#fiyatlar' },
              { label: 'Hakkında', href: '#hakkinda' },
            ].map(l => (
              <a key={l.label} href={l.href} className={styles.navLink}>{l.label}</a>
            ))}
          </div>

          {/* CTA butonları */}
          <div className={styles.navActions}>
            <button className={styles.navBtnSecondary} onClick={() => navigate(paths.giris)}>
              Giriş Yap
            </button>
            <button className={styles.navBtnPrimary} onClick={() => navigate(paths.kayit)}>
              Ücretsiz Başla
            </button>
          </div>

          {/* Mobil menü */}
          <button className={styles.menuBtn} onClick={() => setMenuAcik(!menuAcik)}>
            <span /><span /><span />
          </button>
        </div>

        {menuAcik && (
          <div className={styles.mobileMenu}>
            {['Özellikler', 'Modüller', 'Fiyatlar', 'Hakkında'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className={styles.mobileLink} onClick={() => setMenuAcik(false)}>{l}</a>
            ))}
            <div style={{ display: 'flex', gap: '0.65rem', padding: '0.5rem 1.5rem 1rem' }}>
              <button className={styles.navBtnSecondary} style={{ flex: 1 }} onClick={() => navigate(paths.giris)}>Giriş Yap</button>
              <button className={styles.navBtnPrimary} style={{ flex: 1 }} onClick={() => navigate(paths.kayit)}>Kayıt Ol</button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ Hero Section ══ */}
      <section className={styles.hero}>
        {/* Arkaplan grid & glow */}
        <div className={styles.heroBg}>
          <div className={styles.glow1} />
          <div className={styles.glow2} />
          <div className={styles.grid} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Kurumsal Fintech Platformu
          </div>

          <h1 className={styles.heroTitle}>
            Finansal zekânızı<br />
            <span className={styles.heroAccent}>tek ekrana</span> taşıyın
          </h1>

          <p className={styles.heroDesc}>
            Hisse senedi, döviz, kripto, altın, sigorta, emeklilik ve daha 50+ modül —
            Toyota & 32Bit iş birliğiyle geliştirilen Türkiye'nin en kapsamlı kurumsal finans portalı.
          </p>

          <div className={styles.heroCta}>
            <button className={styles.ctaPrimary} onClick={() => navigate(paths.kayit)}>
              Ücretsiz Başla
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate(paths.giris)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Demo İzle
            </button>
          </div>

          <div className={styles.heroTrust}>
            <span className={styles.heroTrustLabel}>Güvenen şirketler:</span>
            {['Toyota TR', 'Garanti BBVA', 'Koç Holding', 'Sabancı', 'Aselsan'].map(c => (
              <span key={c} className={styles.heroTrustItem}>{c}</span>
            ))}
          </div>
        </div>

        {/* Hero mockup — dashboard önizleme */}
        <div className={styles.heroMockup}>
          <div className={styles.mockupBar}>
            <span className={styles.mockupDot} style={{ background: '#ff5f57' }} />
            <span className={styles.mockupDot} style={{ background: '#febc2e' }} />
            <span className={styles.mockupDot} style={{ background: '#28c840' }} />
            <span className={styles.mockupUrl}>panel.finansportali.com.tr</span>
          </div>
          <div className={styles.mockupBody}>
            {/* Mini metric cards */}
            <div className={styles.mockupMetrics}>
              {[
                { l: 'Portföy', v: '₺2.847.340', c: '+3.42%', up: true },
                { l: 'Günlük K/Z', v: '+₺94.280', c: '+3.42%', up: true },
                { l: 'USD/TRY', v: '38,42', c: '+0.15%', up: true },
                { l: 'BIST 100', v: '13.915', c: '+0.28%', up: true },
              ].map(m => (
                <div key={m.l} className={styles.mockupCard}>
                  <div className={styles.mockupCardLabel}>{m.l}</div>
                  <div className={styles.mockupCardVal}>{m.v}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 9, color: m.up ? '#00d4aa' : '#ff4757', fontWeight: 700 }}>{m.c}</span>
                    <MiniChart up={m.up} />
                  </div>
                </div>
              ))}
            </div>
            {/* Mini market tablosu */}
            <div className={styles.mockupTable}>
              <div className={styles.mockupTableHead}>
                <span>Sembol</span><span>Fiyat</span><span>Değişim</span>
              </div>
              {TICKER.slice(0, 6).map(t => (
                <div key={t.s} className={styles.mockupTableRow}>
                  <span style={{ fontWeight: 700, color: '#f5f0e8' }}>{t.s}</span>
                  <span style={{ fontFamily: 'monospace', color: '#f5f0e8' }}>{t.v}</span>
                  <span style={{ color: t.up ? '#00d4aa' : '#ff4757', fontWeight: 700 }}>
                    {t.up ? '▲' : '▼'} {t.c}
                  </span>
                </div>
              ))}
            </div>
            {/* Quick actions */}
            <div className={styles.mockupActions}>
              {['Transfer', 'Al/Sat', 'Analiz', 'Kartlar'].map(a => (
                <div key={a} className={styles.mockupAction}>{a}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ İstatistikler ══ */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statVal}>{s.val}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Özellikler ══ */}
      <section id="ozellikler" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>Özellikler</span>
            <h2 className={styles.sectionTitle}>Her finansal ihtiyacınız<br /><span>tek platformda</span></h2>
            <p className={styles.sectionDesc}>
              Bireysel yatırımcıdan kurumsal CFO'ya, kripto meraklısından gayrimenkul yatırımcısına — herkes için.
            </p>
          </div>

          <div className={styles.featuresGrid} id="moduller">
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: `${f.renk}18`, color: f.renk }}>
                  {f.icon}
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                <div className={styles.featureArrow} style={{ color: f.renk }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 50 Modül Banner ══ */}
      <section className={styles.modulBanner}>
        <div className={styles.modulBannerInner}>
          <div className={styles.modulBannerLeft}>
            <span className={styles.modulBannerNum}>50+</span>
            <div>
              <div className={styles.modulBannerTitle}>Finans Modülü</div>
              <div className={styles.modulBannerSub}>Dashboard'dan AML Uyumluluğu'na kadar</div>
            </div>
          </div>
          <div className={styles.modulTags}>
            {[
              'Piyasalar', 'Portföy', 'İşlem Geçmişi', 'Vadeli İşlemler', 'Kripto & DeFi',
              'Kart Yönetimi', 'Bütçe & Tasarruf', 'Fatura & Vergi', 'Kredi Skoru', 'Sigorta',
              'BES & Emeklilik', 'Gayrimenkul', 'Açık Bankacılık', 'KYC', 'Admin Paneli',
              'AML & Uyumluluk', 'Borç Takip', 'Altın & Madenler', 'Emtia', 'GYO',
              'Girişim Sermayesi', 'IPO', 'Tahvil & Bono', 'DCA', 'Stres Testi',
              'Hazine', 'Arbitraj', 'Nakit Akışı', 'Çocuk Hesabı', 'API Yönetimi',
            ].map(m => (
              <span key={m} className={styles.modulTag}>{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Güvenlik Vurgusu ══ */}
      <section className={styles.section} style={{ background: 'var(--bg-soft, #0f0f1a)' }}>
        <div className={styles.sectionInner}>
          <div className={styles.securityRow}>
            <div className={styles.securityLeft}>
              <span className={styles.sectionTag}>Güvenlik</span>
              <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>
                Bankacılık seviyesinde<br /><span>güvenlik altyapısı</span>
              </h2>
              <p className={styles.sectionDesc} style={{ textAlign: 'left', maxWidth: 440 }}>
                Verileriniz 256-bit SSL şifreleme, Keycloak kurumsal SSO ve TOTP tabanlı iki faktörlü doğrulama ile korunur.
              </p>
              <div className={styles.securityList}>
                {[
                  { icon: '🔐', text: 'Keycloak 24 SSO — Kurumsal kimlik yönetimi' },
                  { icon: '📱', text: '2FA TOTP — Google Authenticator uyumlu' },
                  { icon: '🪪', text: 'KYC — NFC kimlik kartı + canlılık testi' },
                  { icon: '🛡', text: 'AML — Şüpheli işlem otomatik tespiti' },
                  { icon: '🌍', text: 'KVKK & GDPR — Tam uyumluluk' },
                  { icon: '📋', text: 'OpenTelemetry — Tam gözlemlenebilirlik' },
                ].map(s => (
                  <div key={s.text} className={styles.securityItem}>
                    <span className={styles.securityItemIcon}>{s.icon}</span>
                    <span>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.securityRight}>
              <div className={styles.securityVisual}>
                <div className={styles.svCircle1} />
                <div className={styles.svCircle2} />
                <div className={styles.svLock}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1.5" fill="#00d4aa" />
                  </svg>
                </div>
                <div className={styles.svBadges}>
                  {['SSL 256', 'SOC2', 'ISO27001', 'PCI DSS'].map(b => (
                    <div key={b} className={styles.svBadge}>{b}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Yorumlar ══ */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>Referanslar</span>
            <h2 className={styles.sectionTitle}>Kullanıcılar ne diyor?</h2>
          </div>
          <div className={styles.yorumlarGrid}>
            {YORUMLAR.map(y => (
              <div key={y.ad} className={styles.yorumCard}>
                <div className={styles.yorumPuan}>
                  {'★'.repeat(y.puan)}
                </div>
                <p className={styles.yorumText}>"{y.yorum}"</p>
                <div className={styles.yorumKisi}>
                  <div className={styles.yorumAvatar}>{y.avatar}</div>
                  <div>
                    <div className={styles.yorumAd}>{y.ad}</div>
                    <div className={styles.yorumUnvan}>{y.unvan}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Fiyatlandırma ══ */}
      <section id="fiyatlar" className={styles.section} style={{ background: 'var(--bg-soft, #0f0f1a)' }}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTag}>Fiyatlandırma</span>
            <h2 className={styles.sectionTitle}>Sizi destekleyen <span>bir plan</span> seçin</h2>
            <p className={styles.sectionDesc}>14 gün ücretsiz deneme — kredi kartı gerekmez.</p>
          </div>
          <div className={styles.planlarGrid}>
            {PLANLAR.map(p => (
              <div key={p.ad} className={`${styles.planCard} ${p.popular ? styles.planPopular : ''}`}>
                {p.popular && <div className={styles.planPopularBadge}>En Popüler</div>}
                <div className={styles.planAd}>{p.ad}</div>
                <div className={styles.planFiyat} style={{ color: p.renk }}>
                  {p.fiyat}
                  <span className={styles.planAltyazi}>/{p.altyazi}</span>
                </div>
                <div className={styles.planDivider} />
                <ul className={styles.planOzellikler}>
                  {p.ozellikler.map(o => (
                    <li key={o} className={styles.planOzellik}>
                      <span style={{ color: p.renk }}>✓</span> {o}
                    </li>
                  ))}
                </ul>
                <button
                  className={`${styles.planBtn} ${p.popular ? styles.planBtnPrimary : styles.planBtnSecondary}`}
                  style={p.popular ? { background: p.renk, color: '#000' } : {}}
                  onClick={() => navigate(paths.kayit)}
                >
                  {p.fiyat === 'Özel' ? 'Teklif Al' : 'Hemen Başla'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Son CTA ══ */}
      <section className={styles.ctaSection} id="hakkinda">
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Finansal geleceğinizi<br />bugün şekillendirin
          </h2>
          <p className={styles.ctaDesc}>
            50+ modül, gerçek zamanlı veriler ve yapay zeka desteğiyle finansal hedeflerinize ulaşın.
          </p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaPrimary} onClick={() => navigate(paths.kayit)}>
              Ücretsiz Hesap Oluştur
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate(paths.giris)}>
              Mevcut Hesabımla Giriş Yap
            </button>
          </div>
          <div className={styles.ctaTrust}>
            <span>🔒 256-bit SSL</span>
            <span>·</span>
            <span>🇹🇷 KVKK Uyumlu</span>
            <span>·</span>
            <span>⭐ 14 Gün Ücretsiz</span>
          </div>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <div className={styles.logoMark} style={{ width: 24, height: 24, fontSize: '0.75rem' }}>F</div>
            <span className={styles.logoText}>FinansPortalı</span>
          </div>
          <div className={styles.footerLinks}>
            {[
              { grup: 'Ürün', linkler: ['Özellikler', 'Fiyatlar', 'API Dokümantasyonu', 'Değişiklik Günlüğü'] },
              { grup: 'Şirket', linkler: ['Hakkımızda', 'Blog', 'Kariyer', 'Basın'] },
              { grup: 'Destek', linkler: ['Yardım Merkezi', 'İletişim', 'Durum', 'Güvenlik'] },
              { grup: 'Hukuki', linkler: ['Gizlilik', 'Kullanım Koşulları', 'KVKK', 'Çerezler'] },
            ].map(g => (
              <div key={g.grup} className={styles.footerGroup}>
                <div className={styles.footerGroupTitle}>{g.grup}</div>
                {g.linkler.map(l => <a key={l} href="#" className={styles.footerLink}>{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 FinansPortalı — Toyota & 32Bit iş birliği. Tüm hakları saklıdır.</span>
          <span style={{ color: 'var(--text-dim, rgba(245,240,232,0.25))' }}>v2.0 · Spring Boot 3.3.5 · React 18</span>
        </div>
      </footer>

    </div>
  )
}
