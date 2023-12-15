import React, { useCallback, useMemo } from 'react'

import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import securedStorage from 'utils/secureStorage'

import styles from '../styles.module.scss'

export const useItems = () => {
  const { t, i18n } = useTranslation(['global'])
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    securedStorage.removeAccessToken()
    window.location.replace('/')
  }, [])

  const handleLink = useCallback((to: string) => {
    navigate(to)
  }, [])

  const adminItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'logout',
        label: t('global:logout'),
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
    [i18n.language]
  )

  const freightForwarderItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'profile',
        label: t('global:profile'),
        icon: <UserOutlined />,
        onClick: () => handleLink('/freight-forwarder/profile'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: t('global:logout'),
        icon: <LogoutOutlined />,
        danger: true,
        className: styles.item,
        onClick: handleLogout,
      },
    ],
    [i18n.language]
  )

  return { adminItems, freightForwarderItems }
}
