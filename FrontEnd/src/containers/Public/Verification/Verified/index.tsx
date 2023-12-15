import React from 'react'

import { Button, Result, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from '../styles.module.scss'

const Verified: React.FC = () => {
  const { t } = useTranslation('verification')

  return (
    <Result
      className={styles.result}
      title={t('verified')}
      status="success"
      subTitle={
        <Typography.Paragraph>{t('verifiedText')}</Typography.Paragraph>
      }
      extra={
        <Link to="/client">
          <Button type="default" size="large">
            {t('openDashboard')}
          </Button>
        </Link>
      }
    />
  )
}

export default Verified
