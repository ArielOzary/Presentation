import React, { useCallback, useMemo } from 'react'

import { Table } from 'antd'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import WeightInput from '../../../_components/WeightInput'
import { useAirFreightTable } from './hooks/airFreightTable'

import { RateChargesType, WeightFormat } from 'models'
import { airFreightTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

interface Props {
  chargesType: RateChargesType
}

const TableAir: React.FC<Props> = ({ chargesType }) => {
  const { width } = useWindowSize()
  const { airFreight, setRateTableValue } = useRateStore(
    state => airFreightTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = useAirFreightTable(chargesType)

  const handleVolumeChange = useCallback((volume: number | null) => {
    setRateTableValue(chargesType, 'airFreight', 'volume', volume || 1)
  }, [])

  const handleWeightFormatChange = useCallback((weightFormat: number) => {
    setRateTableValue(chargesType, 'airFreight', 'weightFormat', weightFormat)
  }, [])

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <>
      <WeightInput
        volume={airFreight?.volume || null}
        weightFormat={airFreight?.weightFormat || WeightFormat.KG}
        onVolumeChange={handleVolumeChange}
        onWeightFormatChange={handleWeightFormatChange}
      />

      <Table
        columns={columns}
        dataSource={airFreight?.items || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 1110 }}
        size={tableSize}
        bordered
      />
    </>
  )
}

export default TableAir
