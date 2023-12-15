import React, { useCallback } from 'react'

import { Table } from 'antd'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { columns } from './config'

import { QuoteFees } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import { currencyAbbr, currencySymbol } from 'utils/const'

import styles from './styles.module.scss'

interface Props {
  data: QuoteFees | null | undefined
  type: string
}

const OptionBlock: React.FC<Props> = ({ data, type }) => {
  const { t, i18n } = useTranslation(['quote'])

  const currency = useSearchQuoteStore(store => store.currency)

  const title = useCallback(() => {
    switch (type) {
      case 'origin':
        return <span>{t('quote:originCharges')}</span>
      case 'destination':
        return <span>{t('quote:destinationCharges')}</span>
      case 'freight':
        return <span>{t('quote:freightCharges')}</span>

      default:
        return null
    }
  }, [i18n.language])

  return (
    <div>
      <div className={styles.header}>{title()}</div>
      <Table
        bordered
        dataSource={data?.items}
        columns={columns}
        pagination={false}
        size="small"
        scroll={{ x: 'calc(700px + 10%)' }}
        rowKey={_.uniqueId()}
        className={styles.table}
      />
      <span className={styles.subtotal}>
        {t('quote:subtotal')}: {currencySymbol[currency]}{' '}
        {data?.subTotal?.toFixed(2)} {currencyAbbr[currency]}
      </span>
    </div>
  )
}

export default OptionBlock
