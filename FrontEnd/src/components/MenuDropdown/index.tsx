import React from 'react'

import { UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

interface Props {
  items: MenuProps['items']
}

const MenuDropdown: React.FC<Props> = ({ items }) => {
  const { i18n } = useTranslation(['global'])
  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement={i18n.dir() === 'ltr' ? 'bottomRight' : 'bottomLeft'}
    >
      <Avatar className={styles.avatar} icon={<UserOutlined />} size={40} />
    </Dropdown>
  )
}

export default MenuDropdown
