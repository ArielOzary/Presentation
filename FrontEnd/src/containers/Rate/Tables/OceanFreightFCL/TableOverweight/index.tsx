import React, { useMemo } from 'react'

import { Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { useOceanFreightFCLOverweightTable } from './hooks/oceanFreightFCLOverweightTable'

import { RateChargesType } from 'models'
import { oceanFreightFCLTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import globalStylesTables from '../../tables.module.scss'

interface Props {
  chargesType: RateChargesType
}

const TableOverweight: React.FC<Props> = ({ chargesType }) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['newRate'])
  const { oceanFreightFCL } = useRateStore(
    state => oceanFreightFCLTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } =
    useOceanFreightFCLOverweightTable(chargesType)

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <div>
      <p className={globalStylesTables.header}>
        {t('newRate:table.overweight')}
      </p>
      <Table
        columns={columns}
        dataSource={oceanFreightFCL?.overweight || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 1040 }}
        size={tableSize}
        bordered
      />
    </div>
  )
}

export default TableOverweight
