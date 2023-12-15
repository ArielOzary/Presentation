import React, { useCallback, useMemo } from 'react'

import { Alert, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import WeightInput from 'containers/Rate/_components/WeightInput'

import { useInLandPricesTable } from './hooks/inLandPricesTable'

import { RateChargesType, WeightFormat } from 'models'
import { inLandTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import globalStylesTables from '../../tables.module.scss'

interface Props {
  chargesType: RateChargesType
}

const TablePrices: React.FC<Props> = ({ chargesType }) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['newRate'])
  const { inLand, setRateTableValue } = useRateStore(
    state => inLandTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = useInLandPricesTable(chargesType)

  const handleVolumeChange = useCallback((volume: number | null) => {
    setRateTableValue(chargesType, 'inLand', 'volume', volume || 0)
  }, [])

  const handleWeightFormatChange = useCallback((weightFormat: number) => {
    setRateTableValue(chargesType, 'inLand', 'weightFormat', weightFormat)
  }, [])

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <div>
      <p className={globalStylesTables.header}>
        {t('newRate:table.pricesPerKG')}
      </p>

      <WeightInput
        volume={inLand?.volume || null}
        weightFormat={inLand?.weightFormat || WeightFormat.KG}
        onVolumeChange={handleVolumeChange}
        onWeightFormatChange={handleWeightFormatChange}
        disabledWeightFormat
      />

      {!inLand || inLand.zones.length > 0 ? (
        <Table
          columns={columns}
          dataSource={inLand?.prices || []}
          footer={renderFooter}
          pagination={false}
          scroll={{ x: 240 }}
          size={tableSize}
          bordered
        />
      ) : (
        <Alert showIcon message={t('newRate:table.addOneZone')} />
      )}
    </div>
  )
}

export default TablePrices
