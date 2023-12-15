import React, { useCallback, useEffect, useMemo } from 'react'

import { Alert, Card, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

import LocaleSelector from 'components/LocaleSelector'

import Pending from './Pending'
import Rejected from './Rejected'
import Verified from './Verified'

import { useGetVerificationStatus } from 'fetchers'
import { UserVerificationStatus } from 'models'

import { useQueryString } from 'utils/hooks/useQueryString'

import styles from './styles.module.scss'

const Verification: React.FC = () => {
  const navigate = useNavigate()
  const { queryParams } = useQueryString()
  const subQueryParam = useMemo(() => queryParams.get('sub'), [queryParams])

  const {
    data: status,
    isLoading,
    error,
  } = useGetVerificationStatus(subQueryParam || '', {
    enabled: Boolean(subQueryParam),
  })

  const handleCloseError = useCallback(() => {
    navigate('/')
  }, [])

  useEffect(() => {
    if (!subQueryParam) {
      navigate('/')
    }
  }, [subQueryParam])

  return (
    <div className={styles.wrapper}>
      <div className={styles.locale}>
        <LocaleSelector />
      </div>
      <div>
        <Spin spinning={isLoading}>
          <Card className={styles.card}>
            {error && (
              <Alert
                message={error.message}
                type="error"
                onClose={handleCloseError}
                showIcon
                closable
              />
            )}

            {status === UserVerificationStatus.Pending && <Pending />}
            {status === UserVerificationStatus.Verified && <Verified />}
            {status === UserVerificationStatus.Rejected && <Rejected />}
          </Card>
        </Spin>
      </div>
    </div>
  )
}

export default Verification
