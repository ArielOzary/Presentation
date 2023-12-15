import React, { useCallback, useMemo, useState } from 'react'

import { EllipsisOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import ChangeUserStatusModal from './ChangeUserStatusModal'
import DeleteUserModal from './DeleteUserModal'

import { UserDto } from 'models'

import styles from './styles.module.scss'

type ModalType = 'delete' | 'block' | ''

interface Props {
  user: UserDto
  onSuccess?: () => void
  refetchList?: () => void
}

const ChangeUserStatus: React.FC<Props> = ({
  user,
  onSuccess,
  refetchList,
}) => {
  const { t, i18n } = useTranslation(['clientsManagement'])
  const navigate = useNavigate()
  const location = useLocation()

  const [modalType, setModalType] = useState<ModalType>()

  const handleSuccess = useCallback(() => {
    if (onSuccess) {
      onSuccess()
    }

    setModalType('')
  }, [])

  const handleCancel = useCallback(() => {
    setModalType('')
  }, [])

  const handleDeleteSuccess = useCallback(() => {
    if (refetchList) {
      refetchList()
    }

    navigate(
      location.pathname.includes('/clients')
        ? '/admin/clients'
        : location.pathname.includes('/freight-forwarders')
        ? '/admin/freight-forwarders'
        : '/admin/admins'
    )
    handleCancel()
  }, [])

  const handleBlockTrigger = useCallback(() => setModalType('block'), [])
  const handleDeleteTrigger = useCallback(() => setModalType('delete'), [])

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'status',
        label: user.isDeactivated
          ? t('clientsManagement:unblockUser')
          : t('clientsManagement:blockUser'),
        onClick: handleBlockTrigger,
      },
      {
        key: 'delete',
        label: t('clientsManagement:deleteUser'),
        danger: true,
        onClick: handleDeleteTrigger,
      },
    ],
    [i18n.language, user]
  )

  return (
    <>
      <Dropdown
        menu={{ items }}
        placement={i18n.dir() === 'ltr' ? 'bottomRight' : 'bottomLeft'}
      >
        <EllipsisOutlined className={styles.icon} />
      </Dropdown>

      <ChangeUserStatusModal
        user={user}
        open={modalType === 'block'}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      <DeleteUserModal
        user={user}
        open={modalType === 'delete'}
        onSuccess={handleDeleteSuccess}
        onCancel={handleCancel}
      />
    </>
  )
}

export default ChangeUserStatus
