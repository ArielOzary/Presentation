import React, { useCallback, useMemo, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import BasicInfo from './BasicInfo'
import Card from './Card'
import CompanyLocation from './CompanyLocation'
import ContactInfo from './ContactInfo'
import Invite from './Invite'
import List from './List'

import { getFreightForwarders } from 'fetchers'

import styles from './styles.module.scss'

const FreightForwardersManagement: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'freightForwardersManagement'])
  const navigate = useNavigate()
  const params = useParams()

  const [search, setSearch] = useState('')

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    ['FORWARDERS_LIST', search],
    ({ pageParam = 1 }) =>
      getFreightForwarders({
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

      navigate(`/admin/freight-forwarders/${params.id}/${tab}`)
    },
    [params]
  )

  const tabItems = useMemo(
    () => [
      {
        label: t('freightForwardersManagement:basicInfoTab'),
        key: 'basicInfo',
        children: <BasicInfo refetchList={refetch} />,
      },
      {
        label: t('freightForwardersManagement:contactInfoTab'),
        key: 'contactInfo',
        children: <ContactInfo refetchList={refetch} />,
      },
      {
        label: t('freightForwardersManagement:companyLocationTab'),
        key: 'companyLocation',
        children: <CompanyLocation />,
      },
    ],
    [i18n.language]
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>{t('global:freightForwarder')}</span>
        <Invite />
      </div>
      <div className={styles.columnsBlock}>
        <div className={styles.sideBlock}>
          <List
            pages={data?.pages || []}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            // freightForwarders={data?.items || []}
            isLoading={isLoading}
            onSearch={setSearch}
            fetchNextPage={fetchNextPage}
          />
        </div>
        <div className={styles.main}>
          <Card refetchList={refetch} />
          <Tabs
            key={params.id}
            activeKey={params.tab}
            onChange={handleChangeTab}
            items={tabItems}
            destroyInactiveTabPane
            size="small"
            className={styles.tabs}
          />
        </div>
      </div>
    </div>
  )
}

export default FreightForwardersManagement
