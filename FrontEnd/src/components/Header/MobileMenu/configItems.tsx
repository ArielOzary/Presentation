import React from 'react'

import { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import styles from './styles.module.scss'

export const activeClassName =
  (className: string) =>
  ({ isActive }: { isActive: boolean }) =>
    isActive ? className : undefined

export const useMobileItems = () => {
  const { t } = useTranslation(['global'])

  const adminItems: MenuProps['items'] = [
    {
      key: 'allShipments',
      label: (
        <NavLink
          to="/admin/all-shipments/active"
          className={activeClassName(styles.active)}
        >
          {t('allShipments')}
        </NavLink>
      ),
    },
    {
      key: 'admins',
      label: (
        <NavLink to="/admin/admins/" className={activeClassName(styles.active)}>
          {t('admins')}
        </NavLink>
      ),
    },
    {
      key: 'clients',
      label: (
        <NavLink
          to="/admin/clients/"
          className={activeClassName(styles.active)}
        >
          {t('clients')}
        </NavLink>
      ),
    },
    {
      key: 'freight-forwarder',
      label: (
        <NavLink
          to="/admin/freight-forwarders/"
          className={activeClassName(styles.active)}
        >
          {t('freightForwarder')}
        </NavLink>
      ),
    },
    {
      key: 'rates',
      label: (
        <NavLink to="/rates" className={activeClassName(styles.active)}>
          {t('rates')}
        </NavLink>
      ),
    },
  ]

  const freightForwarderItems: MenuProps['items'] = [
    {
      key: 'clients',
      label: (
        <NavLink
          to="/freight-forwarder/dashboard"
          className={activeClassName(styles.active)}
        >
          {t('global:dashboard')}
        </NavLink>
      ),
    },
    {
      key: 'rates',
      label: (
        <NavLink
          to="/freight-forwarder/rates"
          className={activeClassName(styles.active)}
        >
          {t('global:rates')}
        </NavLink>
      ),
    },
  ]

  return { adminItems, freightForwarderItems }
}
