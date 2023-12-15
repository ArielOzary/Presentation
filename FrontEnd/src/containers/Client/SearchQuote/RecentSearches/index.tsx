import React, { useCallback } from 'react'

import { Empty, List, Spin } from 'antd'
import { useTranslation } from 'react-i18next'

import Item from './Item'

import { useGetOwnLatestSearch } from 'fetchers/quotes'
import { ClientQuoteDto } from 'models'

import styles from './styles.module.scss'

const RecentSearches: React.FC = () => {
  const { t } = useTranslation(['searchQuote'])
  const { data, isLoading } = useGetOwnLatestSearch()

  const renderListItem = useCallback(
    (item: ClientQuoteDto) => <Item data={item} />,
    []
  )

  return (
    <>
      <span className={styles.title}>{t('searchQuote:recentSearches')}</span>
      <Spin spinning={isLoading} wrapperClassName={styles.wrapper}>
        {data?.length ? (
          <List dataSource={data} renderItem={renderListItem} />
        ) : (
          <Empty className={styles.emptyWrapper} />
        )}
      </Spin>
    </>
  )
}

export default RecentSearches
