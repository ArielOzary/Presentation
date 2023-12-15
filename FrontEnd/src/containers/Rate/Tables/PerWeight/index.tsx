import React, { useMemo } from 'react'

import { Collapse, CollapsePanelProps, Table } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { usePerWeightTable } from './hooks/perWeightTable'

import { RateChargesType } from 'models'
import { perWeightTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const { Panel } = Collapse

const PerWeight: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['newRate'])
  const { perWeight } = useRateStore(
    state => perWeightTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = usePerWeightTable(chargesType)

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <Panel
      {...props}
      header={t('newRate:table.perWeight')}
      key="per-weight"
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <Table
        columns={columns}
        dataSource={perWeight || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 910 }}
        size={tableSize}
        bordered
      />
    </Panel>
  )
}

export default PerWeight
