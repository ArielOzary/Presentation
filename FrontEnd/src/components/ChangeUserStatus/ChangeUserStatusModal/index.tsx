import React, { useCallback, useEffect, useState } from 'react'

import { Alert, Input, Modal, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'

import { usePutUserActivationStatus } from 'fetchers'
import { UserDto } from 'models'

import styles from '../styles.module.scss'

interface Props {
  user: UserDto
  open: boolean
  onCancel: () => void
  onSuccess: () => void
}

const ChangeUserStatusModal: React.FC<Props> = ({
  user,
  open,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation(['clientsManagement'])

  const [reason, setReason] = useState<string>('')

  const { mutate, error, isLoading, isError } = usePutUserActivationStatus()

  const handleSuccess = useCallback(() => {
    message.success(
      user.isDeactivated
        ? t('clientsManagement:userActivatedSuccessfully')
        : t('clientsManagement:userDeactivatedSuccessfully')
    )
    onSuccess()
  }, [user])

  const handleOk = useCallback(() => {
    mutate(
      {
        id: user.id || '',
        dto: {
          isDeactivated: !user.isDeactivated,
          deactivationReason: reason,
        },
      },
      { onSuccess: handleSuccess }
    )
  }, [reason, user])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value),
    []
  )

  useEffect(() => {
    setReason('')
  }, [open])

  return (
    <Modal
      title={
        user.isDeactivated
          ? t('clientsManagement:sureToWantUnblockUser')
          : t('clientsManagement:sureToWantBlockUser')
      }
      centered
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okButtonProps={{
        danger: !user.isDeactivated,
        type: user.isDeactivated ? 'primary' : 'default',
        loading: isLoading,
      }}
    >
      {isError && <Alert type="error" message={error.message} />}
      {!user.isDeactivated && (
        <>
          <Typography.Paragraph
            type={user.isDeactivated ? 'secondary' : undefined}
          >
            {t('clientsManagement:defineReason')}
          </Typography.Paragraph>
          <Input.TextArea
            showCount
            value={reason}
            maxLength={100}
            className={styles.textarea}
            onChange={handleChange}
            disabled={user.isDeactivated}
          />
        </>
      )}
    </Modal>
  )
}

export default ChangeUserStatusModal
