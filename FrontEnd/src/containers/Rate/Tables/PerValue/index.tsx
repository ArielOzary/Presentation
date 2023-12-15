import React, { useMemo } from 'react'

import { Collapse, CollapsePanelProps, Table } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { usePerValueTable } from './hooks/perValueTable'

import { RateChargesType } from 'models'
import { perValueTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const { Panel } = Collapse

const PerValue: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['newRate'])
  const { perValue } = useRateStore(
    state => perValueTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = usePerValueTable(chargesType)

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <Panel
      {...props}
      header={t('newRate:table.perValue')}
      key="per-value"
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <Table
        columns={columns}
        dataSource={perValue || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 930 }}
        size={tableSize}
        bordered
      />
    </Panel>
  )
}

export default PerValue
