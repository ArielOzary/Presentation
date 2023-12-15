import React, { useCallback, useEffect, useState } from 'react'

import { Alert, Input, Modal, Select, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { useDeleteShipment, useDeleteUser } from 'fetchers'
import { UserDto } from 'models'

import styles from './styles.module.scss'

interface Props {
  user?: UserDto
  id?: string
  open: boolean
  onCancel: () => void
  onSuccess: () => void
}

const DeleteUserModal: React.FC<Props> = ({
  user,
  id,
  open,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation(['clientsManagement', 'shipments'])
  const { pathname } = useLocation()

  const [reason, setReason] = useState<string>('')
  const [shipmentReason, setShipmentReason] = useState<string>('because')

  const { mutate, error, isLoading, isError } = useDeleteUser()
  const {
    mutate: mutateShipment,
    error: errorShipment,
    isLoading: loadingShipment,
    isError: isErrorShipment,
  } = useDeleteShipment()

  const handleSuccess = useCallback(() => {
    message.success(
      !pathname.includes('all-shipments')
        ? t('clientsManagement:userDeletedSuccessfully')
        : t('shipments:shipmentDeletedSuccessfully')
    )
    onSuccess()
  }, [])

  const handleOk = useCallback(() => {
    !pathname.includes('all-shipments')
      ? mutate(
          { id: user?.id || '', dto: { reason } },
          { onSuccess: handleSuccess }
        )
      : mutateShipment(
          { id: id || '', reason: shipmentReason },
          { onSuccess: handleSuccess }
        )
  }, [reason])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value),
    []
  )

  const handleSelectChange = (value: string) => {
    setShipmentReason(value)
  }

  const handleModalClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => e.stopPropagation(),
    []
  )

  useEffect(() => {
    setReason('')
  }, [open])

  return (
    <button className={styles.wrapper} onClick={handleModalClick}>
      <Modal
        title={
          pathname.includes('all-shipments')
            ? t('shipments:sureToWantDeleteShipment')
            : t('clientsManagement:sureToWantDeleteUser')
        }
        centered
        open={open}
        onOk={handleOk}
        onCancel={onCancel}
        okButtonProps={{
          danger: true,
          loading: isLoading || loadingShipment,
        }}
        destroyOnClose
      >
        {isError && <Alert type="error" message={error.message} />}
        {isErrorShipment && (
          <Alert type="error" message={errorShipment.message} />
        )}
        <Typography.Paragraph>
          {t('clientsManagement:defineReason')}
        </Typography.Paragraph>
        {pathname.includes('all-shipments') ? (
          <Select
            options={[
              { value: 'because', label: 'Just because' },
              { value: 'canceled', label: 'Canceled' },
              { value: 'finished', label: 'Finished long time ago' },
              { value: 'disabled', label: 'Company not exist' },
            ]}
            value={shipmentReason}
            onChange={handleSelectChange}
            className={styles.select}
          />
        ) : (
          <Input.TextArea
            showCount
            value={reason}
            maxLength={100}
            className={styles.textarea}
            onChange={handleChange}
          />
        )}
      </Modal>
    </button>
  )
}

export default DeleteUserModal
