import React, { useCallback } from 'react'

import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { AirFreightItem, AirFreightPriceItem, WeightFormat } from 'models'

import { currencyAbbr, weightFormatAbbr } from 'utils/const'
import { formatCurrency, numberFormatter } from 'utils/formatters'

interface Props {
  items: AirFreightItem[]
  prices: AirFreightPriceItem[]
}

const Items: React.FC<Props> = ({ items, prices }) => {
  const { t } = useTranslation(['global', 'rates', 'newRate'])

  const getPriceColumns = useCallback(() => {
    const columns: ColumnsType<AirFreightItem> = []

    for (let i = 0; i < prices.length; i++) {
      columns.push({
        title: () =>
          i === 0
            ? t('newRate:table.minimum')
            : `${prices[i].limit} ${
                weightFormatAbbr[prices[i].weightFormat || WeightFormat.KG]
              }`,
        dataIndex: 'name',
        width: 100,
        render: (_key, _row, index) =>
          formatCurrency(prices[i].values[index], _row.currency),
      })
    }

    return columns
  }, [items, prices])

  const columns: ColumnsType<AirFreightItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    { title: t('rates:tables.POL'), width: 100, dataIndex: 'POL' },
    { title: t('rates:tables.POD'), width: 100, dataIndex: 'POD' },
    ...getPriceColumns(),
    {
      title: t('rates:tables.currency'),
      width: 85,
      render: (_currency, _row) => currencyAbbr[_row.currency],
    },
    {
      title: t('rates:tables.tt'),
      dataIndex: 'transitionTime',
      width: 85,
      render: transitionTime => `${numberFormatter.format(transitionTime)} ${t('global:days')}`,
    },
  ]
  return (
    <Table
      dataSource={items || []}
      columns={columns}
      pagination={false}
      bordered
      size="small"
      scroll={{ x: 640 }}
    />
  )
}
export default Items
