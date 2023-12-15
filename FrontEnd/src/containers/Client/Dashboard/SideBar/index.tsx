import React from 'react'

import ClientSideSearch from 'components/ClientSideSearch'

import Filters from './Filters'

import styles from './styles.module.scss'

const SideBar: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <ClientSideSearch />
      <Filters />
    </div>
  )
}

export default SideBar
