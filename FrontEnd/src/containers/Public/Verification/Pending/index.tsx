import React from 'react'

import { ClockCircleOutlined } from '@ant-design/icons'
import { Button, Result, Typography } from 'antd'
import { config } from 'config'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from '../styles.module.scss'

const Pending: React.FC = () => {
  const { t } = useTranslation(['global', 'verification'])

  return (
    <Result
      className={styles.result}
      title={t('verification:pending')}
      icon={<ClockCircleOutlined />}
      subTitle={
        <>
          <Typography.Paragraph>
            {t('verification:pendingText')}
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
        <Link to="/">
          <Button type="default" size="large">
            {t('global:back')}
          </Button>
        </Link>
      }
    />
  )
}

export default Pending
