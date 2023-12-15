import React, { useMemo } from 'react'

import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'

import { UserVerificationStatus } from 'models'

import styles from './styles.module.scss'

interface Props {
  status?: UserVerificationStatus
}

const Status: React.FC<Props> = ({ status }) => {
  const { t, i18n } = useTranslation(['clientsManagement'])

  const statusColor = useMemo(() => {
    switch (status) {
      case 0:
        return 'warning'
      case 2:
        return 'error'
      case 1:
        return 'success'
      default:
        return 'default'
    }
  }, [status])

  const statusTitle = useMemo(() => {
    switch (status) {
      case 0:
        return t('clientsManagement:statuses.pending')
      case 2:
        return t('clientsManagement:statuses.rejected')
      default:
        return t('clientsManagement:statuses.verified')
    }
  }, [status, i18n.language])

  return (
    <Tag className={styles.status} color={statusColor}>
      {statusTitle}
    </Tag>
  )
}

export default React.memo(Status)
