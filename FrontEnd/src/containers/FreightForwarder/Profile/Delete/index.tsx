import React, { useCallback, useState } from 'react'

import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Popconfirm, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useDeleteOwnClientProfile, useDeleteOwnProfile } from 'fetchers'
import { useEnvStore } from 'stores/env'

import { useRole } from 'utils/hooks/roleHook'
import securedStorage from 'utils/secureStorage'

import styles from './styles.module.scss'

const DeleteProfile: React.FC = () => {
  const { t } = useTranslation(['global', 'freightForwardersManagement'])
  const envStore = useEnvStore()
  const navigate = useNavigate()
  const { client, freightForwarder } = useRole()
  const [open, setOpen] = useState<boolean>(false)

  const { mutate, isLoading } = useDeleteOwnProfile()
  const { mutate: deleteClientProfile, isLoading: loadingClient } =
    useDeleteOwnClientProfile()

  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open])

  const handleCancel = useCallback(() => {
    setOpen(false)
  }, [])

  const handleSuccess = () => {
    securedStorage.removeAccessToken()
    envStore.setUser(null)
    navigate('/sign-in')

    message.success(
      t('freightForwardersManagement:accountAndPersonalDataDeleted')
    )
  }

  const handleOk = useCallback(() => {
    freightForwarder &&
      mutate(undefined, {
        onSuccess: handleSuccess,
        onError: error => message.error(error.message),
      })

    client &&
      deleteClientProfile(undefined, {
        onSuccess: handleSuccess,
        onError: error => message.error(error.message),
      })
  }, [])

  return (
    <div className={styles.wrapper}>
      <Popconfirm
        title={t('freightForwardersManagement:deleteProfile')}
        description={t('freightForwardersManagement:confirmToDeleteProfile')}
        icon={<QuestionCircleOutlined />}
        open={open}
        onConfirm={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading: isLoading }}
      >
        <Button
          type="text"
          danger
          size="large"
          className="bold"
          onClick={handleClick}
        >
          {t('global:delete')} {t('global:profile')}
        </Button>
      </Popconfirm>
    </div>
  )
}

export default DeleteProfile
