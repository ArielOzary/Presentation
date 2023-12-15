import React, { useCallback, useEffect } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'

import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import styles from './styles.module.scss'

const ClientSideSearch: React.FC = () => {
  const { t } = useTranslation(['global'])

  const [searchByKeyWords, setSearchByKeyWords] = useShipmentsDashboardStore(
    store => [store.searchByKeyWords, store.setSearchByKeyWords]
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchByKeyWords(e.currentTarget.value)
  }, [])

  useEffect(() => {
    setSearchByKeyWords(undefined)
  }, [])

  return (
    <Input
      placeholder={t('global:search')}
      prefix={<SearchOutlined className={styles.icon} />}
      className={styles.input}
      value={searchByKeyWords}
      onChange={handleChange}
    />
  )
}

export default ClientSideSearch
