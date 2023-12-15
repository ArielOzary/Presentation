import React, { useCallback } from 'react'

import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import ContactForm from './ContactForm'
import ContactInfo from './ContactInfo'

import { useContactStore } from 'stores/contactUs'

import styles from './styles.module.scss'

const ContactUs: React.FC = () => {
  const { t } = useTranslation(['clientContactUs'])
  const navigate = useNavigate()
  const { isSended, setIsSended } = useContactStore()

  const back = useCallback(() => {
    setIsSended(false)
    navigate('/client/dashboard/active')
  }, [])

  return (
    <div className={styles.container}>
      <ContactInfo />
      <div className={styles.forms}>
        {isSended ? (
          <>
            <span className={styles.backTitle}>
              {t('clientContactUs:thankYou')}
            </span>
            <span className={styles.subtitle}>
              {t('clientContactUs:wellBe')}
            </span>
            <Button
              onClick={back}
              size="large"
              type="primary"
              className={styles.buttonBack}
            >
              {t('clientContactUs:back')}
            </Button>
          </>
        ) : (
          <>
            <span className={styles.title}>{t('clientContactUs:get')}</span>
            <ContactForm />
          </>
        )}
      </div>
    </div>
  )
}

export default ContactUs
