import React, { useMemo, useState } from 'react'

import { Alert, Collapse, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useWindowSize } from 'usehooks-ts'

import OpenAll from '../_components/OpenAll'
import Remarks from '../_components/Remarks'
import { useSaveRate } from '../_hooks/saveRate'
import BtnSaveBox from './BtnSaveBox'
import FixedPrice from './FixedPrices'
import FreightCharges from './FreightCharges'
import InLand from './InLand'
import PerType from './PerType'
import PerValue from './PerValue'
import PerWeight from './PerWeight'

import { ShipmentIncoterms, ShipmentOption, ShipmentType } from 'models'
import { useRateStore } from 'stores/rate'

import { LG_BREAKPOINT } from 'utils/antd'

import styles from './tables.module.scss'

type ActiveKeys = string | string[]

const Tables: React.FC = () => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['global', 'newRate'])
  const { id } = useParams<{ id: string }>()
  const shippingType = useRateStore(({ rate }) => rate.shippingType)

  const [originActiveKeys, setOriginActiveKeys] = useState<ActiveKeys>([])
  const [destActiveKeys, setDestActiveKeys] = useState<ActiveKeys>([])

  const { error, isError, isLoading } = useSaveRate(id)

  const collapseSize = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'large'),
    [width]
  )

  return (
    <Spin spinning={isLoading}>
      {shippingType?.shipmentIncoterms !== ShipmentIncoterms.FOB &&
        shippingType?.shipmentIncoterms !== ShipmentIncoterms.CIF && (
          <>
            <div className={styles.openAllBox}>
              <p className={styles.mainText}>
                {t('newRate:table.originCharges')}
              </p>
              <OpenAll keys={originActiveKeys} onChange={setOriginActiveKeys} />
            </div>
            <Collapse
              activeKey={originActiveKeys}
              onChange={setOriginActiveKeys}
              className={styles.collapse}
              size={collapseSize}
            >
              <FixedPrice />
              {((shippingType?.shipmentType === ShipmentType.LCL &&
                shippingType.shipmentOption === ShipmentOption.Air) ||
                shippingType?.shipmentOption === ShipmentOption.Ocean) && (
                <PerWeight />
              )}
              {shippingType?.shipmentType !== ShipmentType.LCL && <PerType />}
              <PerValue />
              <InLand />
            </Collapse>
          </>
        )}

      {shippingType?.shipmentIncoterms !== ShipmentIncoterms.CIF && (
        <FreightCharges collapseSize={collapseSize} />
      )}

      <div className={styles.openAllBox}>
        <p className={styles.mainText}>
          {t('newRate:table.destinationCharges')}
        </p>
        <OpenAll keys={destActiveKeys} onChange={setDestActiveKeys} />
      </div>
      <Collapse
        activeKey={destActiveKeys}
        onChange={setDestActiveKeys}
        className={styles.collapse}
        size={collapseSize}
      >
        <FixedPrice chargesType="destinationCharges" />
        {((shippingType?.shipmentType === ShipmentType.LCL &&
          shippingType.shipmentOption === ShipmentOption.Air) ||
          shippingType?.shipmentOption === ShipmentOption.Ocean) && (
          <PerWeight chargesType="destinationCharges" />
        )}
        {shippingType?.shipmentType !== ShipmentType.LCL && (
          <PerType chargesType="destinationCharges" />
        )}
        <PerValue chargesType="destinationCharges" />
        <InLand chargesType="destinationCharges" />
      </Collapse>

      <div className={styles.openAllBox}>
        <p className={styles.mainText}>{t('newRate:remarks')}</p>
      </div>
      <Remarks />

      {isError && <Alert type="error" message={error?.message} showIcon />}

      <div className={styles.buttonSaveBox}>
        <BtnSaveBox />
      </div>
    </Spin>
  )
}

export default Tables
