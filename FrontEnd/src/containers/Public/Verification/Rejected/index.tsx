import React from 'react'

import { Button, Result, Space, Typography } from 'antd'
import { config } from 'config'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from '../styles.module.scss'

const Rejected: React.FC = () => {
  const { t } = useTranslation(['global', 'verification'])

  return (
    <Result
      className={styles.result}
      title={t('verification:rejected')}
      status="error"
      subTitle={
        <>
          <Typography.Paragraph>
            {t('verification:rejectedText')}
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary">
            {t('verification:help')}
            <br />
            <Typography.Link href={`mailto:${config.ADMIN_CONTACT}`}>
              {config.ADMIN_CONTACT}
            </Typography.Link>
          </Typography.Paragraph>
        </>
      }
      extra={
        <Space>
          <Link to="/">
            <Button type="default" size="large">
              {t('global:back')}
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button type="primary" size="large">
              {t('verification:reSubmit')}
            </Button>
          </Link>
        </Space>
      }
    />
  )
}

export default Rejected
