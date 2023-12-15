import React from 'react'

import cn from 'classnames'
import { useLocation } from 'react-router-dom'

import LocaleSelector from 'components/LocaleSelector'

import ClientMenu from './ClientMenu'
import Menu from './Menu'
import MenuMobile from './MenuMobile'

import styles from './styles.module.scss'

import { ReactComponent as Logo } from 'assets/logo.svg'

const Header: React.FC = () => {
  const { pathname } = useLocation()

  return (
    <header
      className={cn(
        styles.header,
        pathname === '/client/search-quote' && styles.bgc
      )}
    >
      <div className={styles.nav}>
        <Logo />
        <Menu />
        <MenuMobile />
      </div>
      <div className={styles.group}>
        <LocaleSelector />
        <ClientMenu />
      </div>
    </header>
  )
}

export default Header
