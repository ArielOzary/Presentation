import React, { useCallback, useEffect, useState } from 'react'

import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Button, Dropdown, List, Spin } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'

import Scrollbars from 'components/Scrollbars'

import { getSuppliers } from 'fetchers'
import { CompanySupplierDto, PaginatedListOfCompanySupplierDto } from 'models'

import styles from './styles.module.scss'

interface Props {
  setCreateSupplier: (value: boolean) => void
  handleSelect: (value: number) => void
}

const CustomSelect: React.FC<Props> = ({ setCreateSupplier, handleSelect }) => {
  const { t } = useTranslation(['createSupplier'])

  const { ref, inView } = useInView()

  const [value, setValue] = useState<CompanySupplierDto>()
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      ['SUPPLIERS_LIST'],
      ({ pageParam = 1 }) =>
        getSuppliers({ PageNumber: pageParam, PageSize: 10 }),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage =
            lastPage.items?.length !== 0 ? allPages.length + 1 : undefined

          return nextPage
        },
      }
    )

  const handleItemClick = (item: CompanySupplierDto) => {
    setValue(item)
    item.id && handleSelect(item.id)
  }

  const renderListItem = useCallback(
    (page: PaginatedListOfCompanySupplierDto) => {
      return page.items?.map((item, idx) => {
        if (page.items?.length === idx + 1) {
          return (
            <button
              ref={ref}
              className={cn(
                styles.option,
                item.id === value?.id && styles.active
              )}
              key={item.id}
              onClick={() => handleItemClick(item)}
            >
              <span className={styles.fullName}>{item.companyName}</span>
              <span className={styles.companyName}>{item.contactName}</span>
            </button>
          )
        }
        return (
          <button
            className={cn(
              styles.option,
              item.id === value?.id && styles.active
            )}
            key={item.id}
            onClick={() => handleItemClick(item)}
          >
            <span className={styles.fullName}>{item.companyName}</span>
            <span className={styles.companyName}>{item.contactName}</span>
          </button>
        )
      })
    },
    [value]
  )

  const handleClick = useCallback(() => {
    setCreateSupplier(true)
  }, [])

  useEffect(() => {
    setValue(data?.pages?.[0].items?.[0])
  }, [data?.pages])

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const dropdownRender = useCallback(
    () => (
      <div className={styles.dropdown}>
        <Scrollbars style={{ height: 200 }}>
          <List dataSource={data?.pages} renderItem={renderListItem} />
          {isFetchingNextPage && <Spin />}
        </Scrollbars>
        <Button
          type="primary"
          ghost
          icon={<PlusOutlined />}
          onClick={handleClick}
          className={styles.createSupplierBtn}
        >
          {t('createSupplier:createNew')}
        </Button>
      </div>
    ),
    [data, isFetchingNextPage]
  )

  const handleOpenChange = useCallback(() => {
    setIsDropdownOpen(state => !state)
  }, [])

  return (
    <Dropdown
      menu={{ items: [] }}
      trigger={['click']}
      dropdownRender={dropdownRender}
      onOpenChange={handleOpenChange}
    >
      <button className={styles.trigger}>
        <div className={cn(styles.option, styles.value)}>
          <span className={styles.fullName}>{value?.companyName}</span>
          <span className={styles.companyName}>{value?.contactName}</span>
        </div>
        <DownOutlined
          className={cn(styles.arrow, isDropdownOpen && styles.open)}
        />
      </button>
    </Dropdown>
  )
}

export default CustomSelect
