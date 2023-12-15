import React from 'react'

import { Collapse, CollapsePanelProps } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import TableRules from '../AirFreight/TableRules'
import TableInLand from './TableInLand'
import TablePrices from './TablePrices'

import { RateChargesType } from 'models'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const { Panel } = Collapse

const InLand: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  const { t } = useTranslation(['newRate'])

  return (
    <Panel
      {...props}
      header={t('newRate:table.inLand')}
      key="in-land"
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <TableInLand chargesType={chargesType} />
      <TablePrices chargesType={chargesType} />
      <TableRules chargesType={chargesType} tableType="inLand" />
    </Panel>
  )
}

export default InLand
