import React from 'react'

import Table, { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'

import { RateRule, RuleItem } from 'models'

import { dimensionFormatAbbr, useOptions, weightFormatAbbr } from 'utils/const'
import { numberFormatter } from 'utils/formatters'

interface Props {
  rules: RuleItem[]
}

const Rules: React.FC<Props> = ({ rules }) => {
  const { t } = useTranslation(['rates'])
  const { rateRuleAbbr } = useOptions()
  const columns: ColumnsType<RuleItem> = [
    {
      title: '#',
      align: 'center',
      dataIndex: 'name',
      fixed: 'left',
      width: 50,
      render: (_name, _row, index) => index + 1,
    },
    {
      title: t('rates:tables.rules'),
      dataIndex: 'rule',
      render: (_rule, _row) => rateRuleAbbr[_row.rule],
    },
    {
      title: t('rates:tables.max'),
      dataIndex: 'value',
      render: (value, _row) =>
        `${numberFormatter.format(value)} ${
          _row.rule === RateRule.MaxHeightPerPallette ||
          _row.rule === RateRule.MaxHeightPerShipment
            ? dimensionFormatAbbr[_row.dimensionFormat]
            : weightFormatAbbr[_row.weightFormat]
        }`,
    },
  ]

  return (
    <Table
      dataSource={rules || []}
      columns={columns}
      pagination={false}
      bordered
      size="small"
      scroll={{ x: 640 }}
    />
  )
}

export default Rules
