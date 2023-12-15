import React from 'react'

import { Contacts } from 'models/contactUs'

import styles from './styles.module.scss'

interface Props {
  img: string
  title: string
  subtitle: string
}
const InfoCard: React.FC<Props> = ({ img, title, subtitle }) => {
  const subtitleType = (sub: string) => {
    if (sub === Contacts.Email) {
      return (
        <a href={`mailto:${Contacts.Email}`} className={styles.subtitle}>
          {Contacts.Email}
        </a>
      )
    }
    // if (sub === Contacts.Phone) {
    //   return (
    //     <a href={`tel:${Contacts.Phone}`} className={styles.subtitle}>
    //       {Contacts.Phone}
    //     </a>
    //   )
    // }
    return <span className={styles.subtitle}>{subtitle}</span>
  }
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={img} alt={title} />
      </div>
      <div className={styles.main}>
        <span className={styles.title}>{title}</span>
        <div>{subtitleType(subtitle)}</div>
      </div>
    </div>
  )
}

export default InfoCard
