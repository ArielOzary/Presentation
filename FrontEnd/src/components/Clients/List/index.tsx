import React, { useCallback, useEffect } from 'react'

import { InfiniteQueryObserverResult } from '@tanstack/react-query'
import { List as AntdList, Spin } from 'antd'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useParams } from 'react-router-dom'

import Scrollbars from 'components/Scrollbars'
import Search from 'components/SearchBlock'

import Item from './Item'

import { PaginatedListOfClientDto } from 'models'

import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

interface Props {
  pages: PaginatedListOfClientDto[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean | undefined
  onSearch: (query: string) => void
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<PaginatedListOfClientDto, unknown>
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
  const { freightForwarder } = useRole()

  const renderListItem = useCallback((page: PaginatedListOfClientDto) => {
    return page.items?.map((item, idx) => {
      if (page.items?.length === idx + 1) {
        return <Item ref={ref} item={item} key={item.id} />
      }
      return <Item item={item} key={item.id} />
    })
  }, [])

  useEffect(() => {
    if (pages?.[0]?.items?.length && !params.id) {
      freightForwarder
        ? navigate(
            `/freight-forwarder/dashboard/${pages[0].items[0].id}/active`
          )
        : navigate(`/admin/clients/${pages[0].items[0].id}/active`)
    }
  }, [pages, params, freightForwarder])

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
