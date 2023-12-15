import React, { useCallback, useEffect, useState } from 'react'

import { InfiniteQueryObserverResult } from '@tanstack/react-query'
import { Checkbox, Spin } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { useLocation, useNavigate } from 'react-router-dom'

import Scrollbars from 'components/Scrollbars'

import styles from './styles.module.scss'

const CheckboxGroup = Checkbox.Group

export interface Option {
  label: string
  value: string | number
}

interface Props {
  title: string
  options: Option[]
  type: string
  style?: string
  listStyle?: string
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => Promise<InfiniteQueryObserverResult>
  activeList?: (string | number)[]
}

const FilterBlock: React.FC<Props> = ({
  title,
  options,
  type,
  style = '',
  listStyle,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  activeList,
}) => {
  const { t } = useTranslation(['clientDashboard'])

  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(
    activeList?.length ? activeList : []
  )

  const { ref, inView } = useInView()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const onChange = useCallback(
    (list: CheckboxValueType[]) => {
      queryParams.delete(type)
      list.forEach(id => queryParams.append(type, String(id)))
      navigate(`?${queryParams.toString()}`)
      setCheckedList(list)

      if (options.length === list.length) {
        setCheckAll(true)
      } else {
        setCheckAll(false)
      }
    },
    [location, type]
  )

  const onCheckAllChange = useCallback(() => {
    if (checkAll) {
      queryParams.delete(type)
      setCheckedList([])
      setCheckAll(false)
    } else {
      queryParams.delete(type)
      const list = options.map(option => option.value)
      setCheckedList(list)
      setCheckAll(true)
    }
    navigate(`?${queryParams.toString()}`)
  }, [checkAll, options, location])

  useEffect(() => {
    !checkAll &&
      setCheckedList(
        queryParams.getAll(type).map(id => {
          if (type === 'clients') {
            return id
          } else return Number(id)
        })
      )
  }, [location, type])

  useEffect(() => {
    const list = options.map(option => option.value)

    checkAll && setCheckedList(list)
  }, [checkAll, options])

  useEffect(() => {
    if (inView && hasNextPage && fetchNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <div className={cn(styles.wrapper, style)}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <button className={styles.all} onClick={onCheckAllChange}>
          {t('clientDashboard:selectAll')}
        </button>
      </div>

      <div className={cn(styles.list, listStyle && listStyle)}>
        <Scrollbars>
          <CheckboxGroup
            options={options}
            value={checkedList}
            onChange={onChange}
            className={styles.group}
          />
          {hasNextPage && (
            <div ref={ref}>
              <Spin spinning={isFetchingNextPage} />{' '}
            </div>
          )}
        </Scrollbars>
      </div>
    </div>
  )
}

export default FilterBlock
