import React, { useMemo } from 'react'

import { Collapse, CollapsePanelProps, Table } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'
import { shallow } from 'zustand/shallow'

import { useFixedPricesTable } from './hooks/fixedPricesTable'

import { RateChargesType } from 'models'
import { fixedPriceTableSelector, useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const FixedPrice: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['newRate', 'global'])
  const { fixedPrices } = useRateStore(
    state => fixedPriceTableSelector(chargesType, state),
    shallow
  )

  const { columns, renderFooter } = useFixedPricesTable(chargesType)

  const tableSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <Collapse.Panel
      {...props}
      key="fixed-price"
      header={t('newRate:table.fixedPrices')}
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <Table
        columns={columns}
        dataSource={fixedPrices?.items || []}
        footer={renderFooter}
        pagination={false}
        scroll={{ x: 710 }}
        size={tableSize}
        bordered
      />
    </Collapse.Panel>
  )
}

export default FixedPrice
