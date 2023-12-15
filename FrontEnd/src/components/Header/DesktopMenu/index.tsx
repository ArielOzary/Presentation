import React, { useCallback } from 'react'

import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { useWindowSize } from 'usehooks-ts'

import { useRole } from '../../../utils/hooks/roleHook'

import { LG_BREAKPOINT } from 'utils/antd'

import styles from './styles.module.scss'

const DesktopMenu: React.FC = () => {
  const { t } = useTranslation(['global'])
  const { width } = useWindowSize()
  const location = useLocation()

  const { admin, freightForwarder } = useRole()

  const activeClassName = useCallback(
    (path: string) => {
      return location.pathname.startsWith(path) ? styles.active : undefined
    },
    [location.pathname]
  )

  return width > LG_BREAKPOINT ? (
    <nav className={styles.menu}>
      {freightForwarder && (
        <>
          <NavLink
            to="/freight-forwarder/dashboard"
            className={activeClassName('/freight-forwarder/dashboard')}
          >
            {t('global:dashboard')}
          </NavLink>
          <NavLink to="/rates" className={activeClassName('/rates')}>
            {t('global:rates')}
          </NavLink>
        </>
      )}
      {admin && (
        <>
          <NavLink
            to="/admin/all-shipments/active"
            className={activeClassName('/admin/all-shipments/')}
          >
            {t('global:allShipments')}
          </NavLink>
          <NavLink
            to="/admin/admins/"
            className={activeClassName('/admin/admins/')}
          >
            {t('global:admins')}
          </NavLink>
          <NavLink
            to="/admin/clients/"
            className={activeClassName('/admin/clients/')}
          >
            {t('global:clients')}
          </NavLink>
          <NavLink
            to="/admin/freight-forwarders/"
            className={activeClassName('/admin/freight-forwarders/')}
          >
            {t('global:freightForwarder')}
          </NavLink>
          <NavLink to="/rates" className={activeClassName('/rates')}>
            {t('global:rates')}
          </NavLink>
        </>
      )}
    </nav>
  ) : null
}

export default DesktopMenu
