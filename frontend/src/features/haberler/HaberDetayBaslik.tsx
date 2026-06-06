import styles from './HaberDetayBaslik.module.css'

type Props = { title: string }

export function HaberDetayBaslik({ title }: Props) {
  return <h1 className={styles.title}>{title}</h1>
}
