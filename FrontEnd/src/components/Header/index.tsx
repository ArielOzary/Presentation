import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import LocaleSelector from 'components/LocaleSelector'
import MenuDropdown from 'components/MenuDropdown'

import { useRole } from '../../utils/hooks/roleHook'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import { useItems } from './hooks/configItems'

import styles from './styles.module.scss'

import { ReactComponent as LogoIcon } from 'assets/logo.svg'

const Header: React.FC = () => {
  const { i18n } = useTranslation(['global'])

  const { admin, freightForwarder } = useRole()
  const { adminItems, freightForwarderItems } = useItems()

  const items = useMemo(() => {
    if (admin) return adminItems
    if (freightForwarder) return freightForwarderItems

    return []
  }, [i18n.language])

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <LogoIcon />
        <DesktopMenu />
        <MobileMenu />
      </div>
      <div className={styles.controls}>
        <LocaleSelector />
        <MenuDropdown items={items} />
      </div>
    </header>
  )
}

export default Header
