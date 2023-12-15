import React, { useMemo } from 'react'

import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'

import OptionBlock from './OptionBlock'

import { useExchangeRate } from 'fetchers'
import { CurrencyType, QuoteDto } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import { currencyAbbr, currencySymbol } from 'utils/const'

import styles from './styles.module.scss'

interface Props {
  item: QuoteDto
}

const ExpandedInfo: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation(['quote'])
  const currency = useSearchQuoteStore(store => store.currency)

  const { data, isLoading } = useExchangeRate()

  const exchangeBlock = useMemo(() => {
    if (currency === CurrencyType.EUR) {
      const rate = data
        ?.find(el => el.baseCurrencyType === CurrencyType.EUR)
        ?.currencyRates?.find(rate => rate.type === 0)?.rate
      return (
        <>
          {t('quote:exchangeRate')}: 1 EUR = {rate} USD
        </>
      )
    } else if (currency === CurrencyType.NIS) {
      const rate = data
        ?.find(el => el.baseCurrencyType === CurrencyType.NIS)
        ?.currencyRates?.find(rate => rate.type === 0)?.rate
      return (
        <>
          {t('quote:exchangeRate')}: 1 ILS = {rate} USD
        </>
      )
    } else return null
  }, [currency])

  return (
    <div className={styles.content}>
      <OptionBlock data={item.originFees} type="origin" />
      <OptionBlock data={item.freightFees} type="freight" />
      <OptionBlock data={item.destinatonsFees} type="destination" />
      {item.remarks ? (
        <>
          <span className={styles.remarks}>{t('quote:remarks')}</span>
          <span className={styles.item}>{item.remarks}</span>
        </>
      ) : null}
      <div className={styles.totalBlock}>
        <span>{isLoading ? <Spin size="small" /> : exchangeBlock}</span>
        <span className={styles.total}>
          {t('quote:total')}: {currencySymbol[currency]}{' '}
          {item.totalAmout?.toFixed(2)} ({currencyAbbr[currency]})
        </span>
      </div>
    </div>
  )
}

export default ExpandedInfo
