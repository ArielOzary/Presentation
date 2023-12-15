import React from 'react'

import { Collapse, CollapsePanelProps } from 'antd'
import cn from 'classnames'

import TableFCL from './TableFCL'
import TableOverweight from './TableOverweight'

import { RateChargesType } from 'models'

import globalStylesTables from '../tables.module.scss'

interface Props extends Omit<CollapsePanelProps, 'key' | 'header'> {
  chargesType?: RateChargesType
  isActive?: boolean
}

const { Panel } = Collapse

const OceanFCL: React.FC<Props> = ({
  chargesType = 'originCharges',
  ...props
}) => {
  return (
    <Panel
      {...props}
      header={'Ocean Freight FCL'}
      key="ocean-freight-fcl"
      className={cn(
        globalStylesTables.panel,
        props.isActive && globalStylesTables.active
      )}
    >
      <TableFCL chargesType={chargesType} />
      <TableOverweight chargesType={chargesType} />
    </Panel>
  )
}

export default OceanFCL
