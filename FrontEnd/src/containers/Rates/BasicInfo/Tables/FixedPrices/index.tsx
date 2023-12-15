import React from 'react'

import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { FixedPriceItem, RateCharges } from 'models'

import { formatCurrency } from 'utils/formatters'

interface Props {
  quotes: RateCharges['fixedPriced']
}

const FixedPrices: React.FC<Props> = ({ quotes }) => {
  const { t } = useTranslation(['rates'])

  const columns: ColumnsType<FixedPriceItem> = [
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
      render: price => formatCurrency(price, quotes?.currency),
    },
    {
      title: t('rates:tables.ifRequired'),
      dataIndex: 'required',
      render: required => (required ? 'Required' : 'Not required'),
    },
  ]

  return (
    <Table
      dataSource={quotes?.items || []}
      columns={columns}
      pagination={false}
      bordered
      size="small"
      scroll={{ x: 640 }}
    />
  )
}

export default FixedPrices
