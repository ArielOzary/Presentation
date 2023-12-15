import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Button, Tabs, message } from 'antd'
import { AxiosError } from 'axios'
import FileSaver from 'file-saver'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import CardFF from 'containers/FreightForwarder/Dashboard/Card'
import PendingQuotes from 'containers/FreightForwarder/Dashboard/PendingQuotes'

import BasicInfo from '../../containers/Admin/Clients/BasicInfo'
import Card from '../../containers/Admin/Clients/Card'
import Profits from '../../containers/Admin/Clients/Profits'
import List from './List'
import Shipments from './Shipments'

import { getClients } from 'fetchers'
import { getExcelClient } from 'fetchers/freightForwarders/getExportClient'
import { useAdminClientsStore } from 'stores/adminClients'
import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'

import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

const Clients: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'clientsManagement', 'quote'])
  const navigate = useNavigate()
  const params = useParams()

  const { freightForwarder } = useRole()
  const setClient = useFreightForwarderClientsStore(store => store.setClient)

  const [search, setSearch] = useState('')
  const [clientId, setClientId] = useState<string>('')
  const companyName = useAdminClientsStore(store => store.companyName)

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    ['CLIENTS_LIST', search],
    ({ pageParam = 1 }) =>
      getClients({
        PageNumber: pageParam,
        CompanyNameQuery: search || undefined,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.items?.length === 10 ? allPages.length + 1 : undefined

        return nextPage
      },
    }
  )

  const handleChangeTab = useCallback(
    (tab: string) => {
      if (!params.id) {
        return
      }
      freightForwarder
        ? navigate(`/freight-forwarder/dashboard/${params.id}/${tab}`)
        : navigate(`/admin/clients/${params.id}/${tab}`)
    },
    [params, freightForwarder]
  )

  const exportClient = useCallback(async () => {
    try {
      const file = await getExcelClient(clientId)

      fetch(file)
        .then(res => res.blob())
        .then(blob => FileSaver.saveAs(blob, companyName))
    } catch (e) {
      if (e instanceof Error || e instanceof AxiosError) {
        message.error(e.message)
      }
    }
  }, [clientId])

  useEffect(() => {
    if (!params.id) {
      return
    }
    if (freightForwarder) {
      const clients = data?.pages.map(page => page.items && page.items)
      const client = clients?.flat().find(client => client?.id === params.id)
      client && setClient(client)
    }
    setClientId(params.id)
  }, [freightForwarder, params, data])

  const tabItems = useMemo(
    () => [
      {
        label: t('clientsManagement:activeTab'),
        key: 'active',
        children: <Shipments />,
      },
      {
        label: t('clientsManagement:historyTab'),
        key: 'history',
        children: <Shipments />,
      },
      {
        label: t('clientsManagement:clientProfitsTab'),
        key: 'profits',
        children: <Profits refetchList={refetch} />,
      },
      {
        label: t('clientsManagement:basicInfoTab'),
        key: 'info',
        children: <BasicInfo refetchList={refetch} />,
      },
    ],
    [i18n.language]
  )

  const ffTabItems = useMemo(
    () => [
      {
        label: t('quote:requests'),
        key: 'requests',
        children: <PendingQuotes />,
      },
      {
        label: t('clientsManagement:activeTab'),
        key: 'active',
        children: <Shipments />,
      },
      {
        label: t('clientsManagement:historyTab'),
        key: 'history',
        children: <Shipments />,
      },
    ],
    [i18n.language]
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>
          {freightForwarder ? t('global:dashboard') : t('global:clients')}
        </span>
        {!freightForwarder && (
          <Button type="link" className={styles.export} onClick={exportClient}>
            {t('clientsManagement:exportToExcel')}
          </Button>
        )}
      </div>
      <div className={styles.columns}>
        <div className={styles.sideBar}>
          <List
            pages={data?.pages || []}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            onSearch={setSearch}
            fetchNextPage={fetchNextPage}
          />
        </div>
        <div className={styles.main}>
          {freightForwarder ? <CardFF /> : <Card refetchList={refetch} />}
          <Tabs
            destroyInactiveTabPane
            activeKey={params.tab}
            onChange={handleChangeTab}
            size="small"
            items={freightForwarder ? ffTabItems : tabItems}
            className={styles.tabs}
          />
        </div>
      </div>
    </div>
  )
}

export default Clients
