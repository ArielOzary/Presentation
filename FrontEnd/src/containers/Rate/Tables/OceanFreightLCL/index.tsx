import React, { useCallback, useMemo } from 'react'

import { Collapse, CollapsePanelProps, Table } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import WeightInput from 'containers/Rate/_components/WeightInput'

import { useOceanFreightLCLTable } from './hooks/oceanFreightLCLTable'

import { RateChargesType, WeightFormat } from 'models'
import { oceanFreightLCLTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const { Panel } = Collapse

const OceanLCL: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['newRate'])
  const { oceanFreightLCL, setRateTableValue } = useRateStore(
    state => oceanFreightLCLTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = useOceanFreightLCLTable(chargesType)

  const handleVolumeChange = useCallback((volume: number | null) => {
    setRateTableValue(chargesType, 'oceanFreightLCL', 'volume', volume || 1)
  }, [])

  const handleWeightFormatChange = useCallback((weightFormat: number) => {
    setRateTableValue(
      chargesType,
      'oceanFreightLCL',
      'weightFormat',
      weightFormat
    )
  }, [])

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <Panel
      {...props}
      header={t('newRate:table.oceanFreightLCL')}
      key="ocean-freight-lcl"
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <WeightInput
        volume={oceanFreightLCL?.volume || null}
        weightFormat={oceanFreightLCL?.weightFormat || WeightFormat.KG}
        onVolumeChange={handleVolumeChange}
        onWeightFormatChange={handleWeightFormatChange}
      />

      <Table
        columns={columns}
        dataSource={oceanFreightLCL?.items || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 240 }}
        size={tableSize}
        bordered
      />
    </Panel>
  )
}

export default OceanLCL
