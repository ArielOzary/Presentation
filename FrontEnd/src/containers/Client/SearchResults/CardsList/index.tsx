import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Alert, List as AntdList, Button, Select } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import SortShipments from 'components/SortShipments'

import Card from './Card'

import { CurrencyType, QuoteDto } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

const currencyOptions = [
  { value: CurrencyType.USD, label: 'USD' },
  { value: CurrencyType.NIS, label: 'ILS' },
  { value: CurrencyType.EUR, label: 'EUR' },
]

const List: React.FC = () => {
  const { i18n, t } = useTranslation([
    'quote',
    'shipments',
    'newRate',
    'searchQuote',
  ])

  const [
    availableList,
    currency,
    goodsInfo,
    setCurrency,
    setRequestedCustomQuote,
  ] = useSearchQuoteStore(store => [
    store.availableList,
    store.currency,
    store.goodsInfo,
    store.setCurrency,
    store.setRequestedCustomQuote,
  ])

  const [isValidDate, setIsValidDate] = useState<boolean>()

  const renderListItem = useCallback(
    (item: QuoteDto) => <Card item={item} />,
    []
  )

  const options = useMemo(
    () => [
      {
        value: 'lastUpdated',
        label: <span>{t('shipments:sortOptions.lastUpdated')}</span>,
      },
      {
        value: 'lowPrice',
        label: (
          <span>
            <ArrowUpOutlined /> {t('newRate:table.price')}
          </span>
        ),
      },
      {
        value: 'heightPrice',
        label: (
          <span>
            <ArrowDownOutlined /> {t('newRate:table.price')}
          </span>
        ),
      },
    ],
    [i18n.language]
  )

  const handleChange = useCallback((value: CurrencyType) => {
    setCurrency(value)
  }, [])

  const handleRequestQuote = () => {
    setRequestedCustomQuote(true)
  }

  useEffect(() => {
    const diff = dayjs(goodsInfo?.shippingDate)
      .startOf('day')
      .diff(dayjs().startOf('day'))

    setIsValidDate(diff >= 0 ? true : false)
  }, [goodsInfo?.shippingDate])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.results}>
          {availableList?.quotes?.length} {t('quote:results')}
        </span>
        <div className={styles.filters}>
          <SortShipments options={options} />
          <Select
            value={currency}
            onChange={handleChange}
            options={currencyOptions}
            className={styles.selectInput}
          />
        </div>
      </div>
      {!isValidDate && (
        <Alert
          message={t('searchQuote:refreshShippingDateInfo')}
          type="info"
          showIcon
          closable
          className={styles.alert}
        />
      )}
      {availableList?.quotes?.length ? (
        <AntdList
          className={styles.list}
          dataSource={availableList?.quotes}
          renderItem={renderListItem}
        />
      ) : (
        <div className={styles.noResults}>
          {t('quote:noResults')}
          <Button
            type="primary"
            size="large"
            className={styles.btn}
            onClick={handleRequestQuote}
          >
            {t('quote:requestCustomQuotes')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default List
