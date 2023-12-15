import React, { useCallback, useEffect, useMemo } from 'react'

import { Select } from 'antd'
import { SelectValue } from 'antd/es/select'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ShipmentSortOption } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'
import { useSortShipmentsStore } from 'stores/sortShipments'

import styles from './styles.module.scss'

type Option = {
  value: ShipmentSortOption | string
  label: string | JSX.Element
}

interface Props {
  options?: Option[]
}

const SortShipments: React.FC<Props> = ({ options }) => {
  const { t, i18n } = useTranslation(['global', 'shipments'])

  const { tab } = useParams()

  const [sortBy, setSortBy] = useSortShipmentsStore(store => [
    store.sortBy,
    store.setSortBy,
  ])
  const [sortQuotes, setSortQuotes] = useSearchQuoteStore(store => [
    store.sortQuotes,
    store.setSortQuotes,
  ])

  const sortOptions = useMemo((): Option[] => {
    switch (tab) {
      case 'active':
        return [
          {
            value: ShipmentSortOption.LastAdded,
            label: t('shipments:sortOptions.lastAdded'),
          },
          // {
          //   value: ShipmentSortOption.CreationDate,
          //   label: t('shipments:sortOptions.creationDate'),
          // },
          { value: ShipmentSortOption.Name, label: t('global:name') },
          {
            value: ShipmentSortOption.Status,
            label: t('shipments:sortOptions.status'),
          },
        ]
      case 'history':
        return [
          {
            value: ShipmentSortOption.LastAdded,
            label: t('shipments:sortOptions.lastAdded'),
          },
          // {
          //   value: ShipmentSortOption.CreationDate,
          //   label: t('shipments:sortOptions.creationDate'),
          // },
          { value: ShipmentSortOption.Name, label: t('global:name') },
        ]
      default:
        return []
    }
  }, [tab, i18n.language])

  const handleSortByChange = useCallback((value: SelectValue) => {
    options
      ? setSortQuotes(value as string)
      : setSortBy(value as ShipmentSortOption)
  }, [])

  useEffect(() => {
    tab === 'history' && setSortBy(ShipmentSortOption.LastAdded)
  }, [tab])

  return (
    <div className={styles.select}>
      <span className={styles.title}>{t('global:sortBy')}</span>
      <Select
        value={options ? sortQuotes : sortBy}
        onChange={handleSortByChange}
        options={options ? options : sortOptions}
        className={styles.selectInput}
      />
    </div>
  )
}

export default SortShipments
