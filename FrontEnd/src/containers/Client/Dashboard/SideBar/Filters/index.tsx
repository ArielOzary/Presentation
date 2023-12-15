import React from 'react'

import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'

import FilterBlock from 'components/FilterBlock'

import { useGetClients, useGetProviders } from './config'

import { useOptions } from 'utils/const'

import styles from './styles.module.scss'

const Filters: React.FC = () => {
  const { t } = useTranslation(['global', 'shipments', 'clientDashboard'])
  const { tab } = useParams()
  const { pathname } = useLocation()

  const { statusesOptions, fclOptions, shipmentOptions } = useOptions()

  const {
    providers,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useGetProviders()

  const clientsProps = useGetClients()

  return (
    <Spin spinning={isLoading}>
      <div className={styles.wrapper}>
        {tab === 'active' ? (
          <FilterBlock
            title={t('shipments:sortOptions.status')}
            options={statusesOptions}
            type="status"
          />
        ) : null}
        <FilterBlock
          title={t('clientDashboard:providers')}
          options={providers()}
          type="providers"
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
        {pathname.includes('all-shipments') && clientsProps && (
          <FilterBlock
            title={t('global:clients')}
            options={clientsProps.clients()}
            type="clients"
            isFetchingNextPage={clientsProps.isFetchingNextPage}
            hasNextPage={clientsProps.hasNextPage}
            fetchNextPage={clientsProps.fetchNextPage}
          />
        )}
        <FilterBlock
          title={`${t('clientDashboard:fcl')}/${t('clientDashboard:lcl')}`}
          options={fclOptions}
          type="shipmentType"
          listStyle={styles.listsStyle}
        />
        <FilterBlock
          title={t('shipments:shipmentTypes.type')}
          options={shipmentOptions}
          type="shipmentOptions"
          listStyle={styles.listsStyle}
        />
      </div>
    </Spin>
  )
}

export default Filters
