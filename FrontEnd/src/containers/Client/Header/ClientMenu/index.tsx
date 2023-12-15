import React, { useCallback, useMemo } from 'react'

import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { activeClassName } from 'components/Header/MobileMenu/configItems'
import MenuDropdown from 'components/MenuDropdown'

import { useFetchOwnProfile } from 'fetchers/clientDashboard/fetchOwnProfile'

import securedStorage from 'utils/secureStorage'

import styles from './styles.module.scss'

const ClientMenu: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'clientContactUs'])

  const { data } = useFetchOwnProfile()

  const handleLogout = useCallback(() => {
    securedStorage.removeAccessToken()
    window.location.replace('/')
  }, [])

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'avatar',
        label: (
          <div className={styles.user}>
            <Avatar
              className={styles.avatar}
              icon={<UserOutlined />}
              size={40}
            />
            <div className={styles.info}>
              <span className={styles.name}>
                {data?.companyProfile?.nameEn}
              </span>
              <span className={styles.email}>
                {data?.companyProfile?.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        type: 'divider',
      },
      {
        key: 'help',
        label: (
          <NavLink
            to="/client/helpCenter"
            className={activeClassName(styles.active)}
          >
            {t('global:helpCenter')}
          </NavLink>
        ),
      },
      {
        key: 'contactUs',
        label: (
          <NavLink
            to="/client/contactUs"
            className={activeClassName(styles.active)}
          >
            {t('clientContactUs:contactUs')}
          </NavLink>
        ),
      },
      {
        key: 'profile',
        label: (
          <NavLink
            to="/client/profile"
            className={activeClassName(styles.active)}
          >
            {t('global:profile')}
          </NavLink>
        ),
      },
      {
        type: 'divider',
      },
      {
        key: 'logOut',
        label: t('global:logOut'),
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
    [i18n.language, data]
  )

  return <MenuDropdown items={items} />
}

export default ClientMenu
