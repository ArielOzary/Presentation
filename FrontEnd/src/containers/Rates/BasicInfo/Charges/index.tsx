import React, { useMemo, useState } from 'react'

import { Collapse, Typography } from 'antd'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'usehooks-ts'

import OpenAll from 'containers/Rates/_components/OpenAll'

import AirFreight from '../Tables/AirFreight'
import FixedPrices from '../Tables/FixedPrices'
import InLand from '../Tables/InLand'
import OceanFCL from '../Tables/OceanFCL'
import OceanLCL from '../Tables/OceanLCL'
import PerType from '../Tables/PerType'
import PerValue from '../Tables/PerValue'
import PerWeight from '../Tables/PerWeight'

import {
  RateCharges,
  RateChargesType,
  RateDto,
  ShipmentOption,
  ShipmentType,
} from 'models'

import { LG_BREAKPOINT } from 'utils/antd'

import styles from './styles.module.scss'

type ActiveKeys = string | string[]

interface Props {
  type: RateChargesType
  charges: RateCharges
  rate?: RateDto
}

const { Panel } = Collapse
const Charges: React.FC<Props> = ({ type, charges, rate }) => {
  const { width } = useWindowSize()
  const { t } = useTranslation(['rates'])

  const [originActiveKeys, setOriginActiveKeys] = useState<ActiveKeys>([])

  const size = useMemo(
    () => (width < LG_BREAKPOINT ? 'small' : 'middle'),
    [width]
  )

  const title = useMemo(() => {
    // type === 'originCharges'
    //   ? 'rates:collapses.origin'
    //   : type === 'freightCharges'
    //   ? 'rates:collapses.freight'
    //   : 'rates:collapses.destination'

    switch (type) {
      case 'originCharges':
        return 'rates:collapses.origin'
      case 'freightCharges':
        return 'rates:collapses.freight'
      default:
        return 'rates:collapses.destination'
    }
  }, [type])

  const isAirFreightFilled = useMemo(
    () => get(charges, ['airFreight', 'items'], []).length > 0,
    [charges.airFreight]
  )
  const isOceanFCLFilled = useMemo(
    () => get(charges, ['oceanFreightFCL', 'items'], []).length > 0,
    [charges.oceanFreightFCL]
  )
  const isOceanLCLFilled = useMemo(
    () => get(charges, ['oceanFreightLCL', 'items'], []).length > 0,
    [charges.oceanFreightLCL]
  )
  const isFixedPricesFilled = useMemo(
    () => get(charges, ['fixedPriced', 'items'], []).length > 0,
    [charges.fixedPriced]
  )
  const isPerWeightFilled = useMemo(
    () => get(charges, ['perWeight'], []).length > 0,
    [charges.perWeight]
  )
  const isPerTypeFilled = useMemo(
    () => get(charges, ['perType'], []).length > 0,
    [charges.perType]
  )
  const isPerValueFilled = useMemo(
    () => get(charges, ['perValue'], []).length > 0,
    [charges.perValue]
  )
  const isInLandFilled = useMemo(
    () => get(charges, ['inLand', 'zones'], []).length > 0,
    [charges.inLand]
  )

  return (
    <div>
      <div className={styles.collapseBox}>
        <Typography.Title level={5}>{t(title)}</Typography.Title>
        <OpenAll keys={originActiveKeys} onChange={setOriginActiveKeys} />
      </div>
      <Collapse
        className={styles.container}
        activeKey={originActiveKeys}
        onChange={setOriginActiveKeys}
        size={size}
      >
        {type === 'freightCharges' && (
          <>
            {rate?.shippingType?.shipmentOption === ShipmentOption.Air && (
              <Panel
                key={isAirFreightFilled ? 'air-freight' : 'air-freight-empty'}
                header={t('rates:collapses.air')}
                className={styles.collapseContainer}
                collapsible={isAirFreightFilled ? undefined : 'disabled'}
              >
                <AirFreight quotes={charges.airFreight} />
              </Panel>
            )}
            {rate?.shippingType?.shipmentOption === ShipmentOption.Ocean &&
              rate?.shippingType.shipmentType === ShipmentType.FCL && (
                <Panel
                  key={
                    isOceanFCLFilled
                      ? 'ocean-freight-fcl'
                      : 'ocean-freight-fcl-empty'
                  }
                  header={t('rates:collapses.oceanFCL')}
                  className={styles.collapseContainer}
                  collapsible={isOceanFCLFilled ? undefined : 'disabled'}
                >
                  <OceanFCL quotes={charges.oceanFreightFCL} />
                </Panel>
              )}

            {rate?.shippingType?.shipmentOption === ShipmentOption.Ocean &&
              rate.shippingType.shipmentType === ShipmentType.LCL && (
                <Panel
                  key={
                    isOceanLCLFilled
                      ? 'ocean-freight-lcl'
                      : 'ocean-freight-lcl-empty'
                  }
                  header={t('rates:collapses.oceanLCL')}
                  className={styles.collapseContainer}
                  collapsible={isOceanLCLFilled ? undefined : 'disabled'}
                >
                  <OceanLCL quotes={charges.oceanFreightLCL} />
                </Panel>
              )}
          </>
        )}

        <Panel
          key={isFixedPricesFilled ? 'fixed-prices' : 'fixed-prices-empty'}
          header={t('rates:collapses.fixedPrices')}
          className={styles.collapseContainer}
          collapsible={isFixedPricesFilled ? undefined : 'disabled'}
        >
          <FixedPrices quotes={charges.fixedPriced} />
        </Panel>
        {((rate?.shippingType?.shipmentType === ShipmentType.LCL &&
          rate?.shippingType.shipmentOption === ShipmentOption.Air) ||
          rate?.shippingType?.shipmentOption === ShipmentOption.Ocean) && (
          <Panel
            key={isPerWeightFilled ? 'per-weight' : 'per-weight-empty'}
            header={t('rates:collapses.perWeight')}
            className={styles.collapseContainer}
            collapsible={isPerWeightFilled ? undefined : 'disabled'}
          >
            <PerWeight quotes={charges.perWeight} />
          </Panel>
        )}

        {rate?.shippingType?.shipmentType !== ShipmentType.LCL && (
          <Panel
            key={isPerTypeFilled ? 'per-type' : 'per-type-empty'}
            header={t('rates:collapses.perType')}
            className={styles.collapseContainer}
            collapsible={isPerTypeFilled ? undefined : 'disabled'}
          >
            <PerType quotes={charges.perType} />
          </Panel>
        )}

        {type !== 'freightCharges' && (
          <>
            <Panel
              key={isPerValueFilled ? 'per-value' : 'per-value-empty'}
              header={t('rates:collapses.perValue')}
              className={styles.collapseContainer}
              collapsible={isPerValueFilled ? undefined : 'disabled'}
            >
              <PerValue quotes={charges.perValue} />
            </Panel>

            <Panel
              key={isInLandFilled ? 'in-land' : 'in-land-empty'}
              header={t('rates:collapses.inLand')}
              className={styles.collapseContainer}
              collapsible={isInLandFilled ? undefined : 'disabled'}
            >
              <InLand quotes={charges.inLand} />
            </Panel>
          </>
        )}
      </Collapse>
    </div>
  )
}

export default Charges
