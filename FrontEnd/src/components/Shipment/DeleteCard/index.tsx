import React, { useCallback, useState } from 'react'

import { EllipsisOutlined } from '@ant-design/icons'
import { Button, Popover } from 'antd'
import { useTranslation } from 'react-i18next'

import DeleteUserModal from 'components/ChangeUserStatus/DeleteUserModal'

import styles from './styles.module.scss'

interface Props {
  id: string | undefined
  refetchShipments?: () => void
}

const DeleteCard: React.FC<Props> = ({ id, refetchShipments }) => {
  const { t } = useTranslation(['global'])

  const [openModal, setOpenModal] = useState<boolean>(false)

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
    setOpenModal(true)
  }, [])

  const handleCancel = useCallback(() => {
    setOpenModal(false)
  }, [])

  const handleSuccess = useCallback(() => {
    setOpenModal(false)
    refetchShipments && refetchShipments()
  }, [])

  return (
    <div className={styles.popoverWrapper}>
      <Popover
        content={
          <Button danger type="text" onClick={handleClick}>
            {t('global:delete')}
          </Button>
        }
        trigger="hover"
        placement="bottom"
      >
        <EllipsisOutlined className={styles.icon} />
      </Popover>
      <DeleteUserModal
        open={openModal}
        id={id}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default DeleteCard
