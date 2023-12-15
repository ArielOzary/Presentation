import React, { forwardRef, useCallback, useEffect } from 'react'

import { List, Space, Typography } from 'antd'
import cn from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'

import AvatarWithInitials from 'components/AvatarWithInitials'

import Status from './Status'

import { ClientDto } from 'models'
import { useAdminClientsStore } from 'stores/adminClients'

import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

const { Text } = Typography

interface Props {
  item: ClientDto
  ref?: React.ForwardedRef<HTMLElement | null>
}

const Item: React.FC<Props> = forwardRef(({ item }, ref) => {
  const params = useParams()
  const navigate = useNavigate()
  const { freightForwarder } = useRole()
  const setCompanyName = useAdminClientsStore(store => store.setCompanyName)

  const handleClick = useCallback(() => {
    if (freightForwarder) {
      item.hasCustomQuote
        ? navigate(`/freight-forwarder/dashboard/${item.id}/requests`)
        : navigate(`/freight-forwarder/dashboard/${item.id}/active`)
    } else {
      navigate(`/admin/clients/${item.id}/active`)
    }
  }, [item])

  useEffect(() => {
    params.id === item?.id &&
      item?.companyNameEn &&
      setCompanyName(item?.companyNameEn)
  }, [params, item])

  return (
    <List.Item
      ref={ref && ref}
      key={item.id}
      onClick={handleClick}
      className={cn(styles.card, params.id === item?.id && styles.active)}
    >
      <List.Item.Meta
        avatar={
          <div className={styles.avatarBlock}>
            {freightForwarder && item.hasCustomQuote && (
              <div className={styles.marker}>!</div>
            )}
            <AvatarWithInitials
              styles={styles.avatar}
              name={item.companyNameEn}
            />
          </div>
        }
        title={
          <Space direction="vertical" size={10}>
            {item.status !== 1 && <Status status={item.status} />}
            <Text className={styles.companyName}>{item.companyNameEn}</Text>
          </Space>
        }
        description={
          <Text className={styles.personOfContact}>{item.contactName}</Text>
        }
      />
    </List.Item>
  )
})

export default Item
