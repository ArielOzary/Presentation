import React, { useCallback, useEffect } from 'react'

import { InfiniteQueryObserverResult } from '@tanstack/react-query'
import { List as AntdList, Spin } from 'antd'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useParams } from 'react-router-dom'

import Scrollbars from 'components/Scrollbars'
import Search from 'components/SearchBlock'

import Item from './Item'

import { PaginatedListOfRateDto } from 'models'

import styles from './styles.module.scss'

interface Props {
  pages: PaginatedListOfRateDto[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean | undefined
  onSearch: (query: string) => void
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<PaginatedListOfRateDto, unknown>
  >
}

const List: React.FC<Props> = ({
  pages,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onSearch,
  fetchNextPage,
}) => {
  const navigate = useNavigate()
  const params = useParams()
  const { ref, inView } = useInView()

  const renderListItem = useCallback((page: PaginatedListOfRateDto) => {
    return page.items?.map((item, idx) => {
      if (page.items?.length === idx + 1) {
        return <Item ref={ref} item={item} key={item.id} />
      }
      return <Item item={item} key={item.id} />
    })
  }, [])

  // const getRowKey = useCallback(({ id }: RateDto) => id as number, [])

  useEffect(() => {
    if (pages?.[0]?.items?.length && !params.id) {
      navigate(`/rates/${pages[0].items[0].id}`)
    }
  }, [pages, params])

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <div className={styles.container}>
      <Search onSearch={onSearch} />
      <Spin spinning={isLoading} wrapperClassName={styles.list}>
        <Scrollbars className={styles.scrollBar}>
          <AntdList
            // rowKey={getRowKey}
            dataSource={pages}
            renderItem={renderListItem}
          />
          {isFetchingNextPage && <Spin />}
        </Scrollbars>
      </Spin>
    </div>
  )
}

export default List
