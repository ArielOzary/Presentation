import React, { useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Card from './Card'
import Invite from './Invite'
import List from './List'

import { getAdmins } from 'fetchers'

import styles from './styles.module.scss'

const Admins: React.FC = () => {
  const { t } = useTranslation(['global', 'adminsManagement'])
  const params = useParams<{ id: string }>()

  const [search, setSearch] = useState('')

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    ['ADMINS_LIST', search],
    ({ pageParam = 1 }) =>
      getAdmins({
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>
          {t('adminsManagement:administrators')}
        </span>
        <Invite />
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
          {params.id ? (
            <Card refetchList={refetch} />
          ) : (
            <Empty
              className={styles.selectAdmin}
              description={t('adminsManagement:selectAdmin')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Admins
