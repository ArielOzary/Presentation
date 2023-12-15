import React, { useEffect, useState } from 'react'

import { Button, Empty } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import Header from 'components/Header'

import Tables from './BasicInfo'
import Card from './Card'
import List from './List'
import { useRatesList } from './_hooks/ratesList'

import styles from './styles.module.scss'

const Rates: React.FC = () => {
  const { t } = useTranslation(['global', 'rates'])
  const { id } = useParams<{ id: string }>()

  const [search, setSearch] = useState('')

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useRatesList(search)

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  return (
    <>
      <Header />
      <div className="wrapper">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <span className={styles.title}>{t('global:rates')}</span>
            <div className={styles.boxButton}>
              {/* <Button type="link" className={styles.export} size="large">
                {t('rates:export')}
              </Button> */}
              <Link to="/rate">
                <Button type="primary" className="bold" size="large">
                  {t('global:uploadRate')}
                </Button>
              </Link>
            </div>
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
              {id ? (
                <>
                  <Card refetchList={refetch} />
                  <Tables key={id} />
                </>
              ) : (
                <Empty
                  className={styles.selectRate}
                  description={t('rates:selectRate')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Rates
