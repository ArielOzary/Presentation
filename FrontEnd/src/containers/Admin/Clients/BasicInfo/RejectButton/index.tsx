import React, { useCallback } from 'react'

import { Button, Modal, message } from 'antd'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { usePutUserVerificationStatus } from 'fetchers'
import { UserDto, UserVerificationStatus } from 'models'

interface Props {
  user: UserDto
  onSuccess?: () => void
}

const RejectButton: React.FC<Props> = ({ user, onSuccess }) => {
  const { t, i18n } = useTranslation(['global', 'clientsManagement'])
  const params = useParams<{ id: string }>()

  const { mutate, isLoading } = usePutUserVerificationStatus()

  const handleSuccess = useCallback(() => {
    message.success(
      t(
        user.status === UserVerificationStatus.Pending
          ? 'clientsManagement:clientRegistrationRejected'
          : 'clientsManagement:clientRegistrationUnRejected'
      )
    )

    if (onSuccess) {
      onSuccess()
    }
  }, [i18n.language, user])

  const handleError = useCallback((error: AxiosError) => {
    message.error(error.message)
  }, [])

  const handleOk = useCallback(() => {
    const dto = {
      status:
        user.status === UserVerificationStatus.Pending
          ? UserVerificationStatus.Rejected
          : UserVerificationStatus.Pending,
    }

    mutate(
      {
        id: params.id || '',
        dto,
      },
      { onSuccess: handleSuccess, onError: handleError }
    )
  }, [user])

  const handleClick = useCallback(() => {
    Modal.confirm({
      title: t(
        user.status === UserVerificationStatus.Pending
          ? 'clientsManagement:sureToWantRejectClient'
          : 'clientsManagement:sureToWantUnRejectClient'
      ),
      okText: t('global:yes'),
      onOk: handleOk,
    })
  }, [i18n.language, user])

  return user.status !== UserVerificationStatus.Verified ? (
    <Button
      size="large"
      loading={isLoading}
      onClick={handleClick}
      className="bold"
      type={user.status === UserVerificationStatus.Pending ? 'text' : 'primary'}
      danger={user.status === UserVerificationStatus.Pending}
      disabled={false}
    >
      {t(
        user.status === UserVerificationStatus.Pending
          ? 'global:rejectClient'
          : 'global:unreject'
      )}
    </Button>
  ) : null
}

export default RejectButton
