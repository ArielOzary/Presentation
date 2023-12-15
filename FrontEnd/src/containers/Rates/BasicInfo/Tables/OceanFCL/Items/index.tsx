import React from 'react'

import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { OceanFreightFCLItem } from 'models'

import { currencyAbbr } from 'utils/const'
import { formatCurrency } from 'utils/formatters'

interface Props {
  items: OceanFreightFCLItem[]
}

const Items: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation(['rates'])

  const columns: ColumnsType<OceanFreightFCLItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    {
      title: t('rates:tables.POL'),
      width: 100,
      dataIndex: 'POL',
    },
    {
      title: t('rates:tables.POD'),
      width: 100,
      dataIndex: 'POD',
    },
    {
      title: '20FT',
      dataIndex: 'CTR20FT',
      width: 90,
      align: 'center',
      render: (CTR20FT, _row) =>
        CTR20FT && formatCurrency(CTR20FT, _row.currency),
    },
    {
      title: '40FT',
      dataIndex: 'CTR40FT',
      width: 90,
      align: 'center',
      render: (CTR40FT, _row) =>
        CTR40FT && formatCurrency(CTR40FT, _row.currency),
    },
    {
      title: '40HC',
      dataIndex: 'CTR40HC',
      width: 90,
      align: 'center',
      render: (CTR40HC, _row) =>
        CTR40HC && formatCurrency(CTR40HC, _row.currency),
    },
    {
      title: '20OT',
      dataIndex: 'CTR20OT',
      width: 90,
      align: 'center',
      render: (CTR20OT, _row) =>
        CTR20OT && formatCurrency(CTR20OT, _row.currency),
    },
    {
      title: '40OT',
      dataIndex: 'CTR40OT',
      width: 90,
      align: 'center',
      render: (CTR40OT, _row) =>
        CTR40OT && formatCurrency(CTR40OT, _row.currency),
    },
    {
      title: '20RF',
      dataIndex: 'CTR20RF',
      width: 90,
      align: 'center',
      render: (CTR20RF, _row) =>
        CTR20RF && formatCurrency(CTR20RF, _row.currency),
    },
    {
      title: '40RF',
      dataIndex: 'CTR40RF',
      width: 90,
      align: 'center',
      render: (CTR40RF, _row) =>
        CTR40RF && formatCurrency(CTR40RF, _row.currency),
    },
    {
      title: t('rates:tables.currency'),
      width: 85,
      render: (_currency, _row) => currencyAbbr[_row.currency],
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
