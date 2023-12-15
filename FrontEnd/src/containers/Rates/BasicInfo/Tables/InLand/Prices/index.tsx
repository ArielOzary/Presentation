import React, { useCallback } from 'react'

import Table, { ColumnsType } from 'antd/es/table'

import {
  CalculationOption,
  CurrencyType,
  InLandPriceItem,
  InLandZoneItem,
} from 'models'

import { useOptions } from 'utils/const'
import { formatCurrency, numberFormatter } from 'utils/formatters'

interface Props {
  prices: InLandPriceItem[]
  zones: InLandZoneItem[]
  unitType: CalculationOption
}

const Prices: React.FC<Props> = ({ prices, zones, unitType }) => {
  const { calculationOptionAbbr } = useOptions()

  const renderZoneColumns = useCallback(() => {
    const columns: ColumnsType<InLandPriceItem> = []

    for (let i = 0; i < zones.length; i++) {
      columns.push({
        title: () => `Zone ${i + 1}`,
        dataIndex: 'limit',
        render: (_limit, _row, index) =>
          formatCurrency(prices[index].values[i], CurrencyType.USD),
      })
    }

    return columns
  }, [])

  const columns: ColumnsType<InLandPriceItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    {
      title: () => calculationOptionAbbr[unitType],
      dataIndex: 'limit',
      fixed: 'left',
      width: 150,
      render: (limit, _row, index) =>
        index === 0 ? 'Minimum' : `+ ${numberFormatter.format(limit)} KG`,
    },
    ...renderZoneColumns(),
  ]

  return (
    <Table
      dataSource={prices || []}
      columns={columns}
      pagination={false}
      bordered
      size="small"
      scroll={{ x: 640 }}
    />
  )
}

export default Prices
