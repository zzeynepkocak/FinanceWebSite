import type { ReactNode } from 'react'
import styles from './Card.module.css'

type Props = {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, action, children, className = '' }: Props) {
  return (
    <section className={`${styles.card} ${className}`}>
      {(title || action) && (
        <div className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </section>
  )
}
