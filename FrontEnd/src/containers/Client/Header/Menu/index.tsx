import React from 'react'

import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { useWindowSize } from 'usehooks-ts'

import { LG_BREAKPOINT } from 'utils/antd'

import styles from './styles.module.scss'

const Menu: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation(['global'])
  const { width } = useWindowSize()

  return width > LG_BREAKPOINT ? (
    <nav className={styles.menu}>
      <NavLink
        className={location.pathname.includes('dashboard') ? 'active' : ''}
        to="/client/dashboard/active"
      >
        {t('global:dashboard')}
      </NavLink>
      <NavLink to="/client/search-quote">
        <Button size="large" type="primary" className="bold">
          {t('global:searchQuote')}
        </Button>
      </NavLink>
    </nav>
  ) : null
}

export default Menu
