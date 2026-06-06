import styles from './PiyasaBolumKartlari.module.css'

type DataCard = { badge: string; label: string; value: string; positive: boolean }

function Section({
  badge,
  title,
  cards,
}: {
  badge: string
  title: string
  cards: DataCard[]
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.badge}>{badge}</span>
        {title}
      </h2>
      <div className={styles.cardGrid}>
        {cards.map((c) => (
          <div key={c.badge + c.label} className={styles.dataCard}>
            <span className={styles.dataBadge}>{c.badge}</span>
            <span className={styles.dataLabel}>{c.label}</span>
            <span className={c.positive ? styles.positive : styles.negative}>
              {c.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

const devletTahvilleri: DataCard[] = [
  { badge: 'US', label: 'ABD 10Y 4,23%', value: '+0,02', positive: true },
  { badge: 'DE', label: 'Almanya 10Y 2,42%', value: '-0,01', positive: false },
  { badge: 'TR', label: 'Türkiye 10Y 27,40%', value: '+0,08', positive: true },
  { badge: 'UK', label: 'İngiltere 10Y 4,08%', value: '-0,02', positive: false },
]

const kurumsalTahviller: DataCard[] = [
  { badge: 'AAA', label: 'IG 5Y 5,12%', value: '+0,03', positive: true },
  { badge: 'BB', label: 'HY 5Y 7,84%', value: '-0,04', positive: false },
  { badge: 'EU', label: 'EU Corp 3,88%', value: '+0,01', positive: true },
  { badge: 'EM', label: 'EM Corp 6,42%', value: '-0,02', positive: false },
]

const byf: DataCard[] = [
  { badge: 'SPY', label: 'SPY 512,4', value: '+0,52%', positive: true },
  { badge: 'QQQ', label: 'QQQ 441,6', value: '-0,08%', positive: false },
  { badge: 'DXY', label: 'DXY 105,2', value: '+0,10%', positive: true },
  { badge: 'GLD', label: 'GLD 212,3', value: '-0,22%', positive: false },
]

const ekonomi: DataCard[] = [
  { badge: 'CPI', label: 'ABD CPI % 3,2', value: '-0,1', positive: false },
  { badge: 'GDP', label: 'ABD GDP % 1,8', value: '+0,2', positive: true },
  { badge: 'PMI', label: 'PMI 49,6', value: '-0.4', positive: false },
  { badge: 'UN', label: 'İşsizlik % 4,0', value: '+0,1', positive: true },
]

export function PiyasaBolumKartlari() {
  return (
    <div className={styles.wrapper}>
      <Section badge="DT" title="Devlet tahvilleri" cards={devletTahvilleri} />
      <Section badge="KT" title="Kurumsal tahviller" cards={kurumsalTahviller} />
      <Section badge="BYF" title="BYF" cards={byf} />
      <Section badge="EKO" title="Ekonomi" cards={ekonomi} />
    </div>
  )
}
