import React, { forwardRef, useCallback } from 'react'

import { List, Typography } from 'antd'
import cn from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'

import AvatarWithInitials from 'components/AvatarWithInitials'

import { FreightForwarderDto } from 'models'

import styles from './styles.module.scss'

const { Text } = Typography

interface Props {
  item: FreightForwarderDto
  ref?: React.ForwardedRef<HTMLElement | null>
}

const Item: React.FC<Props> = forwardRef(({ item }, ref) => {
  const params = useParams()
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(`/admin/freight-forwarders/${item.id}/basicInfo`)
  }, [])

  return (
    <List.Item
      key={item.id}
      ref={ref && ref}
      onClick={handleClick}
      className={cn(styles.card, item.id === params.id && styles.active)}
    >
      <List.Item.Meta
        avatar={
          <AvatarWithInitials
            styles={styles.avatar}
            name={item.companyNameEn}
          />
        }
        title={
          <Text className={styles.companyName}>
            {item.companyNameEn ?? 'NO_COMPANY_NAME'}
          </Text>
        }
        description={
          <Text className={styles.description}>
            {item.paymentContact
              ? item.paymentContact.name
              : 'NO_PAYMENT_CONTACT'}
          </Text>
        }
      />
    </List.Item>
  )
})

export default Item
