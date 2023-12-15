import React, { useCallback, useEffect } from 'react'

import { InfiniteQueryObserverResult } from '@tanstack/react-query'
import { List as AntdList, Spin } from 'antd'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useParams } from 'react-router-dom'

import Scrollbars from 'components/Scrollbars'
import Search from 'components/SearchBlock'

import Item from './Item'

import { PaginatedListOfFreightForwarderDto } from 'models'

import styles from './styles.module.scss'

interface Props {
  pages: PaginatedListOfFreightForwarderDto[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean | undefined
  onSearch: (query: string) => void
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<PaginatedListOfFreightForwarderDto, unknown>
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
  const params = useParams()
  const navigate = useNavigate()
  const { ref, inView } = useInView()

  const renderListItem = useCallback(
    (page: PaginatedListOfFreightForwarderDto) => {
      return page.items?.map((item, idx) => {
        if (page.items?.length === idx + 1) {
          return <Item ref={ref} item={item} key={item.id} />
        }
        return <Item item={item} key={item.id} />
      })
    },
    []
  )

  useEffect(() => {
    if (pages?.[0]?.items?.length && !params.id) {
      navigate(`/admin/freight-forwarders/${pages[0].items[0].id}/basicInfo`)
    }
  }, [pages, params])

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <div className={styles.wrapper}>
      <Search onSearch={onSearch} />
      <Spin spinning={isLoading} wrapperClassName={styles.list}>
        <Scrollbars className={styles.scrollBar}>
          <AntdList dataSource={pages} renderItem={renderListItem} />
          {isFetchingNextPage && <Spin />}
        </Scrollbars>
      </Spin>
    </div>
  )
}

export default List
