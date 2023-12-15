import React, { useCallback, useMemo, useState } from 'react'

import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { useWindowSize } from 'usehooks-ts'

import { activeClassName } from 'components/Header/MobileMenu/configItems'

import { LG_BREAKPOINT } from 'utils/antd'

import styles from './styles.module.scss'

const MenuMobile: React.FC = () => {
  const { t, i18n } = useTranslation(['global'])
  const { width } = useWindowSize()

  const [open, setOpen] = useState<boolean>(false)

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'dashboard',
        label: (
          <NavLink
            to="/client/dashboard/active"
            className={activeClassName(styles.active)}
          >
            {t('global:dashboard')}
          </NavLink>
        ),
      },
      {
        key: 'quote',
        label: (
          <NavLink
            to="/client/search-quote"
            className={activeClassName(styles.active)}
          >
            <Button size="large" type="primary" className="bold">
              {t('global:searchQuote')}
            </Button>
          </NavLink>
        ),
      },
    ],
    [i18n.language]
  )

  const handleOpenChange = useCallback(() => setOpen(open => !open), [])

  return width <= LG_BREAKPOINT ? (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button size="large" type="text" className={styles.trigger}>
        {open ? <CloseOutlined /> : <MenuOutlined />}
      </Button>
    </Dropdown>
  ) : null
}

export default MenuMobile
