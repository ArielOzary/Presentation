import React from 'react'

import { useTranslation } from 'react-i18next'

import InfoCard from '../components/InfoCard'

import { Contacts } from 'models/contactUs'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'
import Address from 'assets/image/contactUs/address.svg'
import Email from 'assets/image/contactUs/email.svg'

// import Phone from 'assets/image/contactUs/phone.svg'

const ContactInfo: React.FC = () => {
  const { t } = useTranslation([
    'global',
    'createSupplier',
    'clientContactUs',
    'signUp',
  ])
  const data = [
    { img: Email, title: t('global:email'), subtitle: Contacts.Email },
    // {
    //   img: Phone,
    //   title: t('clientContactUs:phoneNum'),
    //   subtitle: Contacts.Phone,
    // },
    {
      img: Address,
      title: t('createSupplier:address'),
      subtitle: Contacts.Address,
    },
  ]
  return (
    <div className={styles.sidebar}>
      <div className={styles.main}>
        <DeliveryIcon className={styles.icon} />
        <span className={styles.title}>{t('clientContactUs:contactInfo')}</span>
        <span className={styles.subtitle}>
          {t('signUp:tellUsAboutYourCompany')}
        </span>
        <div className={styles.boxContacts}>
          {data.map(el => (
            <InfoCard
              key={el.title}
              title={el.title}
              img={el.img}
              subtitle={el.subtitle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
