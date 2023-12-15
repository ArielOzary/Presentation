import React, { forwardRef, useCallback } from 'react'

import { List, Space, Typography } from 'antd'
import cn from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'

import AvatarWithInitials from 'components/AvatarWithInitials'

import { AdminDto } from 'models'

import styles from './styles.module.scss'

const { Text } = Typography

interface Props {
  item: AdminDto
  ref?: React.ForwardedRef<HTMLElement | null>
}

const Item: React.FC<Props> = forwardRef(({ item }, ref) => {
  const params = useParams()
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(`/admin/admins/${item.id}`)
  }, [])

  return (
    <List.Item
      ref={ref && ref}
      key={item.id}
      onClick={handleClick}
      className={cn(styles.card, params.id === item?.id && styles.active)}
    >
      <List.Item.Meta
        avatar={
          <AvatarWithInitials
            styles={styles.avatar}
            name={item.companyNameEn}
          />
        }
        title={
          <Space direction="vertical" size={10}>
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
