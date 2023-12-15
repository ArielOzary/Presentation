import React, { useMemo } from 'react'

import { Table } from 'antd'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { useOceanFreightFCLTable } from './hooks/oceanFreightFCLTable'

import { RateChargesType } from 'models'
import { oceanFreightFCLTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

interface Props {
  chargesType: RateChargesType
}

const TableFCL: React.FC<Props> = ({ chargesType }) => {
  const { width } = useWindowSize()
  const { oceanFreightFCL } = useRateStore(
    state => oceanFreightFCLTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = useOceanFreightFCLTable(chargesType)

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <Table
      columns={columns}
      dataSource={oceanFreightFCL?.items || []}
      footer={renderFooter}
      pagination={false}
      scroll={{ x: 1115 }}
      size={tableSize}
      bordered
    />
  )
}

export default TableFCL
