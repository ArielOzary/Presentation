import React from 'react'

import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { PerWeightItem, RateCharges } from 'models'

import { currencyAbbr, weightFormatAbbr } from 'utils/const'
import { formatCurrency } from 'utils/formatters'

interface Props {
  quotes: RateCharges['perWeight']
}

const PerWeight: React.FC<Props> = ({ quotes }) => {
  const { t } = useTranslation(['rates'])

  const columns: ColumnsType<PerWeightItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    {
      title: t('rates:tables.name'),
      dataIndex: 'name',
    },
    {
      title: t('rates:tables.price'),
      dataIndex: 'price',
      render: (price, _row) => formatCurrency(price, _row.currency),
    },
    {
      title: t('rates:tables.per'),
      dataIndex: 'weightFormat',
      render: (_weightFormat, _row) => weightFormatAbbr[_row.weightFormat],
    },
    {
      title: 'CBM = Xkg',
      dataIndex: 'volume',
    },
    {
      title: t('rates:tables.currency'),
      dataIndex: 'currency',
      render: (_currency, _row) => currencyAbbr[_row.currency],
    },
  ]

  return (
    <Table
      dataSource={quotes || []}
      columns={columns}
      pagination={false}
      bordered
      size="small"
      scroll={{ x: 640 }}
    />
  )
}

export default PerWeight
