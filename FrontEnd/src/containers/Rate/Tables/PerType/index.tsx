import React, { useMemo } from 'react'

import { Collapse, CollapsePanelProps, Table } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { usePerTypeTable } from './hooks/perTypeTable'

import { RateChargesType } from 'models'
import { perTypeTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const { Panel } = Collapse

const PerType: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['newRate'])
  const { perType } = useRateStore(
    state => perTypeTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = usePerTypeTable(chargesType)

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <Panel
      {...props}
      header={t('newRate:table.perType')}
      key="per-type"
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <Table
        columns={columns}
        dataSource={perType || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 910 }}
        size={tableSize}
        bordered
      />
    </Panel>
  )
}

export default PerType
