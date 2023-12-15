import { ColumnsType } from 'antd/es/table'

import { QuoteFeeItem } from 'models'

export const columns: ColumnsType<QuoteFeeItem> = [
  {
    title: 'Fee Name',
    dataIndex: 'name',
    key: 'feeName',
    width: '25%',
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
    width: '25%',
    ellipsis: true,
  },
  {
    title: 'Units',
    dataIndex: 'unitsQuantity',
    key: 'units',
    width: '15%',
  },
  {
    title: 'Unit Price',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: '15%',
    render: unitPrice => Number(unitPrice).toFixed(2),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: amount => amount?.toFixed(2),
    width: '15%',
  },
]
