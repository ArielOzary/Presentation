import React, { useMemo } from 'react'

import { Table } from 'antd'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { useInLandZonesTable } from './hooks/inLandZonesTable'

import { RateChargesType } from 'models'
import { inLandTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

interface Props {
  chargesType: RateChargesType
}

const TableInLand: React.FC<Props> = ({ chargesType }) => {
  const { width } = useWindowSize()
  const { inLand } = useRateStore(
    state => inLandTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = useInLandZonesTable(chargesType)

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <div>
      <Table
        columns={columns}
        dataSource={inLand?.zones || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 1110 }}
        size={tableSize}
        bordered
      />
    </div>
  )
}

export default TableInLand
