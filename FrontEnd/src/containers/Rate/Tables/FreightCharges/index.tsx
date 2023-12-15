import React, { useState } from 'react'

import { Collapse } from 'antd'
import { useTranslation } from 'react-i18next'

import OpenAll from '../../_components/OpenAll'
import AirFreight from '../AirFreight'
import FixedPrice from '../FixedPrices'
import OceanFCL from '../OceanFreightFCL'
import OceanLCL from '../OceanFreightLCL'
import PerType from '../PerType'
import PerWeight from '../PerWeight'

import { ShipmentOption, ShipmentType } from 'models'
import { useRateStore } from 'stores/rate'

import styles from './styles.module.scss'

interface Props {
  collapseSize: 'small' | 'large'
}

type ActiveKeys = string | string[]

const FreightCharges: React.FC<Props> = ({ collapseSize }) => {
  const { t } = useTranslation(['newRate'])

  const [freightActiveKeys, setFreightActiveKeys] = useState<ActiveKeys>([])
  const shippingType = useRateStore(({ rate }) => rate.shippingType)

  return (
    <>
      <div className={styles.openAllBox}>
        <p className={styles.mainText}>{t('newRate:table.freightCharges')}</p>
        <OpenAll keys={freightActiveKeys} onChange={setFreightActiveKeys} />
      </div>
      <Collapse
        activeKey={freightActiveKeys}
        onChange={setFreightActiveKeys}
        className={styles.collapse}
        size={collapseSize}
      >
        {shippingType?.shipmentOption === ShipmentOption.Ocean &&
          shippingType?.shipmentType === ShipmentType.LCL && (
            <OceanLCL chargesType="freightCharges" />
          )}
        {shippingType?.shipmentOption === ShipmentOption.Ocean &&
          shippingType.shipmentType === ShipmentType.FCL && (
            <OceanFCL chargesType="freightCharges" />
          )}
        {shippingType?.shipmentOption === ShipmentOption.Air && (
          <AirFreight chargesType="freightCharges" />
        )}
        <FixedPrice chargesType="freightCharges" />
        {((shippingType?.shipmentType === ShipmentType.LCL &&
          shippingType.shipmentOption === ShipmentOption.Air) ||
          shippingType?.shipmentOption === ShipmentOption.Ocean) && (
          <PerWeight chargesType="freightCharges" />
        )}
        {shippingType?.shipmentType !== ShipmentType.LCL && (
          <PerType chargesType="freightCharges" />
        )}
      </Collapse>
    </>
  )
}

export default FreightCharges
