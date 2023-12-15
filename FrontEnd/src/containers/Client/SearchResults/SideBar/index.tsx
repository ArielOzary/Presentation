import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { DatePicker, Slider, Spin } from 'antd'
import cn from 'classnames'
import { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'

import ClientSideSearch from 'components/ClientSideSearch'
import FilterBlock from 'components/FilterBlock'

import { useGetProviders } from 'containers/Client/Dashboard/SideBar/Filters/config'
import useConfig from 'containers/Client/SearchQuote/Specifications/config'

import { useGetAvailableList } from 'fetchers'
import { AvailableQuotesFilterDto, AvailableQuotesListDto } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'
import { useShipmentsDashboardStore } from 'stores/shipmentsDashboard'

import { currencySymbol } from 'utils/const'
import { paramsByType } from 'utils/getParamsByType'

import styles from './styles.module.scss'

const dateFormatList = 'DD.MM.YY'

const SideBar: React.FC = () => {
  const { t, i18n } = useTranslation([
    'global',
    'quote',
    'newRate',
    'clientDashboard',
    'shipments',
  ])
  const queryParams = new URLSearchParams(location.search)
  const { mutate } = useGetAvailableList()
  const { mutateData } = useConfig()

  const [dateValue, setDateValue] = useState<Dayjs | null>(null)

  const [
    availableList,
    currency,
    sortQuotes,
    sortDescending,
    sortingFilter,
    setAvailableList,
    setSortDescending,
    setSortingFilter,
  ] = useSearchQuoteStore(store => [
    store.availableList,
    store.currency,
    store.sortQuotes,
    store.sortDescending,
    store.sortingFilter,
    store.setAvailableList,
    store.setSortDescending,
    store.setSortingFilter,
  ])

  const searchByKeyWords = useShipmentsDashboardStore(
    store => store.searchByKeyWords
  )

  const minValue = useCallback(
    (value: number) => Math.floor(value * 100) / 100,
    [availableList?.minPriceFilterOption]
  )
  const maxValue = useCallback(
    (value: number) => Number(value.toFixed(2)),
    [availableList?.maxPriceFilterOption]
  )

  const [inputValue, setInputValue] = useState<[number, number]>(
    availableList?.minPriceFilterOption && availableList.maxPriceFilterOption
      ? [
          minValue(availableList?.minPriceFilterOption),
          maxValue(availableList?.maxPriceFilterOption),
        ]
      : [0, 0]
  )

  const {
    providers,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useGetProviders()

  // const { shipmentOptions } = useOptions()
  // const shipmentOptionsList = paramsByType({
  //   type: 'shipmentOptions',
  //   queryParams,
  // })

  const providersList = paramsByType({
    type: 'providers',
    queryParams,
  })

  const [filterData, setFilterData] = useState<AvailableQuotesFilterDto>({
    sortingFilter,
    sortDescending,
    currencyTypeFilter: currency,
  })

  const activeList = useMemo(() => {
    const list: number[] = []
    availableList?.companyIdsFilterOptions?.forEach(el => {
      if (el.id) {
        list.push(el.id)
      }
    })
    return list
  }, [availableList])

  const handleAfterChange = useCallback((newValue: [number, number]) => {
    setInputValue(newValue)

    setFilterData(prev => ({
      ...prev,
      priceRangeFilter: {
        from: newValue[0],
        to: newValue[1],
      },
    }))
  }, [])

  const handleDateChange = useCallback((value: Dayjs | null) => {
    setDateValue(value)

    value
      ? setFilterData(prev => ({
          ...prev,
          expirationDateFilter: {
            value: value.toISOString(),
          },
        }))
      : setFilterData(prev => {
          const data = { ...prev }
          delete data.expirationDateFilter

          return data
        })
  }, [])

  const handleSuccess = (data: AvailableQuotesListDto) => {
    setAvailableList(data)
  }

  useEffect(() => {
    setSortDescending()
    setSortingFilter()
  }, [sortQuotes])

  useEffect(() => {
    let filters: AvailableQuotesFilterDto = {}

    if (sortingFilter !== filterData?.sortingFilter)
      filters = { ...filters, sortingFilter }
    if (sortDescending !== filterData?.sortDescending)
      filters = { ...filters, sortDescending }
    if (currency !== filterData?.currencyTypeFilter)
      filters = { ...filters, currencyTypeFilter: currency }
    if (providersList?.length)
      filters = {
        ...filters,
        companyIdsFilter: { options: providersList as number[] },
      }

    if (searchByKeyWords)
      filters = { ...filters, searchQuery: { query: searchByKeyWords } }

    if (filterData.companyIdsFilter && !providersList?.length) {
      const { companyIdsFilter, ...rest } = filterData

      setFilterData(rest)
    }

    if (filterData.searchQuery && !searchByKeyWords) {
      const { searchQuery, ...rest } = filterData

      setFilterData(rest)
    }

    Object.keys(filters).length &&
      setFilterData(prev => ({
        ...prev,
        ...filters,
      }))
  }, [
    currency,
    sortDescending,
    location.search,
    sortQuotes,
    sortingFilter,
    searchByKeyWords,
    dateValue,
  ])

  useEffect(() => {
    filterData && delete filterData.priceRangeFilter

    setInputValue(
      typeof availableList?.minPriceFilterOption === 'number' &&
        typeof availableList?.maxPriceFilterOption === 'number'
        ? [
            minValue(availableList?.minPriceFilterOption),
            maxValue(availableList?.maxPriceFilterOption),
          ]
        : [0, 0]
    )
  }, [
    currency,
    availableList?.minPriceFilterOption,
    availableList?.maxPriceFilterOption,
  ])

  useEffect(() => {
    mutate(
      {
        ...mutateData,
        filters: filterData,
      },
      { onSuccess: handleSuccess }
    )
  }, [filterData])

  return (
    <div className={styles.wrapper}>
      <ClientSideSearch />
      <div className={styles.block}>
        <span className={styles.title}>{t('newRate:table.price')}</span>
        <span className={styles.price}>
          {currencySymbol[currency]}
          {availableList?.minPriceFilterOption?.toFixed(2)} -{' '}
          {currencySymbol[currency]}
          {availableList?.maxPriceFilterOption?.toFixed(2)}
        </span>
        <Slider
          range
          min={
            availableList?.minPriceFilterOption &&
            Math.floor(availableList?.minPriceFilterOption * 100) / 100
          }
          max={Number(availableList?.maxPriceFilterOption?.toFixed(2))}
          value={inputValue}
          onChange={setInputValue}
          onAfterChange={handleAfterChange}
          className={styles.slider}
        />
      </div>
      <div className={cn(styles.block, styles.date)}>
        <span className={styles.title}>{t('quote:expirationDate')}</span>
        <DatePicker
          allowClear
          value={dateValue}
          format={dateFormatList}
          placement={i18n.language === 'he' ? 'bottomRight' : 'bottomLeft'}
          onChange={handleDateChange}
        />
      </div>
      <Spin spinning={isLoading}>
        <FilterBlock
          title={t('clientDashboard:providers')}
          options={providers()}
          type="providers"
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          style={styles.bgc}
          activeList={activeList}
        />
      </Spin>
      {/* <FilterBlock
        title={t('shipments:shipmentTypes.type')}
        options={shipmentOptions}
        type="shipmentOptions"
        style={styles.bgc}
        listStyle={styles.listsStyle}
      /> */}
    </div>
  )
}

export default SideBar
