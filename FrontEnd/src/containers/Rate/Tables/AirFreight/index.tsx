import React from 'react'

import { Collapse, CollapsePanelProps } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import TableAir from './Table'
import TableRules from './TableRules'

import { RateChargesType } from 'models'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const { Panel } = Collapse

const AirFreight: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  const { t } = useTranslation(['newRate'])

  return (
    <Panel
      {...props}
      header={t('newRate:table.airFreight')}
      key="air-freight"
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <TableAir chargesType={chargesType} />
      <TableRules chargesType={chargesType} tableType="airFreight" />
    </Panel>
  )
}

export default AirFreight
