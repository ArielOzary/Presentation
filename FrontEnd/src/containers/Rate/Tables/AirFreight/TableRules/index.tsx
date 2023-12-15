import React, { useMemo } from 'react'

import { Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { useAirFreightRulesTable } from './hooks/airFreightRulesTable'

import { RateChargesType, TableType } from 'models'
import { useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import tableStyles from '../../tables.module.scss'

interface Props {
  chargesType: RateChargesType
  tableType: Extract<TableType, 'airFreight' | 'inLand'>
}

const TableRules: React.FC<Props> = ({ chargesType, tableType }) => {
  const { t } = useTranslation(['newRate'])
  const { width } = useWindowSize()
  const { rules } = useRateStore(
    ({ rate }) => ({
      rules: rate[chargesType]?.[tableType]?.rules || [],
    }),
    shallow
  )

  const { columns, renderFooter } = useAirFreightRulesTable(
    chargesType,
    tableType,
    rules,
  )

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <div className={tableStyles.rulesTable}>
      <p className={tableStyles.header}>{t('newRate:table.rules')}</p>
      <Table
        columns={columns}
        dataSource={rules}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 490 }}
        size={tableSize}
        bordered
      />
    </div>
  )
}

export default TableRules
