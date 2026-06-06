import styles from './HaberDetayMeta.module.css'

type Props = { source: string; date: string }

export function HaberDetayMeta({ source, date }: Props) {
  return (
    <p className={styles.meta}>
      {source} | {date}
    </p>
  )
}
