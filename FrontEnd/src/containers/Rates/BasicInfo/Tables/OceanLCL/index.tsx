import React from 'react'

import { ExpandOutlined } from '@ant-design/icons'
import { Space, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { OceanFreightLCLItem, RateCharges, WeightFormat } from 'models'

import { currencyAbbr, weightFormatAbbr } from 'utils/const'
import { formatCurrency, numberFormatter } from 'utils/formatters'

interface Props {
  quotes: RateCharges['oceanFreightLCL']
}

const { Text } = Typography

const OceanLCL: React.FC<Props> = ({ quotes }) => {
  const { t } = useTranslation(['global', 'rates'])

  const columns: ColumnsType<OceanFreightLCLItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    { title: t('rates:tables.POL'), dataIndex: 'POL' },
    { title: t('rates:tables.POD'), dataIndex: 'POD' },
    {
      title: t('rates:tables.wm'),
      dataIndex: 'weightMeasurement',
      render: (weightMeasurement, _row) =>
        weightMeasurement && formatCurrency(weightMeasurement, _row.currency),
    },
    {
      title: t('rates:tables.currency'),
      dataIndex: 'currency',
      width: 85,
      render: (_currency, _row) => currencyAbbr[_row.currency],
    },
    {
      title: t('rates:tables.tt'),
      dataIndex: 'transitionTime',
      render: transitionTime =>
        transitionTime &&
        `${numberFormatter.format(transitionTime)} ${t('global:days')}`,
    },
  ]
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Text>
        <ExpandOutlined /> 1CBM = {quotes?.volume}{' '}
        {weightFormatAbbr[quotes?.weightFormat || WeightFormat.KG]}
      </Text>
      <Table
        dataSource={quotes?.items || []}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        scroll={{ x: 640 }}
      />
    </Space>
  )
}

export default OceanLCL
