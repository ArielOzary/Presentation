import React from 'react'

import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { PerValueItem, RateCharges } from 'models'

import { currencyAbbr, useOptions } from 'utils/const'
import { percentFormatter } from 'utils/formatters'

interface Props {
  quotes: RateCharges['perValue']
}

const PerValue: React.FC<Props> = ({ quotes }) => {
  const { t } = useTranslation(['rates'])

  const { perValueShipmentTypeAbbr } = useOptions()

  const columns: ColumnsType<PerValueItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    { title: t('rates:tables.name'), dataIndex: 'name' },
    {
      title: t('rates:tables.outOf'),
      dataIndex: 'percent',
      render: percent => percentFormatter.format(percent / 100),
    },
    {
      title: t('rates:tables.outOf'),
      dataIndex: 'shipmentType',
      render: (_shipmentType, _row) =>
        perValueShipmentTypeAbbr[_row.shipmentType],
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

export default PerValue
