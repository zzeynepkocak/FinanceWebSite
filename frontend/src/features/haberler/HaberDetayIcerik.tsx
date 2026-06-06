import styles from './HaberDetayIcerik.module.css'

type Props = { body: string }

export function HaberDetayIcerik({ body }: Props) {
  return (
    <div className={styles.icerik}>
      <hr className={styles.hr} />
      <p>{body}</p>
    </div>
  )
}
