import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Space, Spin, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Charges from './Charges'

import { useGetRateById, useGetRateCharges } from 'fetchers'
import { RateCharges, RateChargesInfoDto, ShipmentIncoterms } from 'models'

import styles from './styles.module.scss'

const { Text, Title } = Typography

const Tables: React.FC = () => {
  const { t } = useTranslation(['newRate'])
  const { id } = useParams<{ id: string }>()

  const [originCharges, setOriginCharges] = useState<RateCharges>({})
  const [freightCharges, setFreightCharges] = useState<RateCharges>({})
  const [destinationCharges, setDestinationCharges] = useState<RateCharges>({})

  const { data: charges, isLoading: isChargesLoading } = useGetRateCharges(
    Number(id || 0)
  )
  const { data: rate, isLoading: isRateLoading } = useGetRateById(
    Number(id || 0)
  )

  const parseTables = useCallback(
    (charges?: RateChargesInfoDto | null): RateCharges => {
      const fixedPriced: RateCharges['fixedPriced'] = JSON.parse(
        charges?.fixedPriced || '{}'
      )
      const perType: RateCharges['perType'] = JSON.parse(
        charges?.perType || '[]'
      )
      const perWeight: RateCharges['perWeight'] = JSON.parse(
        charges?.perWeight || '[]'
      )
      const perValue: RateCharges['perValue'] = JSON.parse(
        charges?.perValue || '[]'
      )
      const inLand: RateCharges['inLand'] = JSON.parse(charges?.inLand || '{}')
      const airFreight: RateCharges['airFreight'] = JSON.parse(
        charges?.airFreight || '{}'
      )
      const oceanFreightFCL: RateCharges['oceanFreightFCL'] = JSON.parse(
        charges?.oceanFreightFcl || '{}'
      )
      const oceanFreightLCL: RateCharges['oceanFreightLCL'] = JSON.parse(
        charges?.oceanFreightLcl || '{}'
      )

      return {
        fixedPriced,
        perType,
        perWeight,
        perValue,
        inLand,
        airFreight,
        oceanFreightFCL,
        oceanFreightLCL,
      }
    },
    []
  )

  useEffect(() => {
    setOriginCharges(parseTables(charges?.originCharges))
    setFreightCharges(parseTables(charges?.freightCharges))
    setDestinationCharges(parseTables(charges?.destinationCharges))
  }, [charges])

  const isLoading = useMemo(
    () => isChargesLoading || isRateLoading,
    [isChargesLoading, isRateLoading]
  )

  return (
    <div className={styles.container}>
      <Spin spinning={isLoading}>
        <div className={styles.main}>
          {rate?.shippingType?.shipmentIncoterms !== ShipmentIncoterms.FOB &&
            rate?.shippingType?.shipmentIncoterms !== ShipmentIncoterms.CIF && (
              <Charges
                type="originCharges"
                charges={originCharges}
                rate={rate}
              />
            )}
          {rate?.shippingType?.shipmentIncoterms !== ShipmentIncoterms.CIF && (
            <Charges
              type="freightCharges"
              charges={freightCharges}
              rate={rate}
            />
          )}
          <Charges
            type="destinationCharges"
            charges={destinationCharges}
            rate={rate}
          />
        </div>
        {rate?.remarks && (
          <Space direction="vertical">
            <Title level={5}>{t('newRate:remarks')}</Title>
            <Text>{rate.remarks}</Text>
          </Space>
        )}
      </Spin>
    </div>
  )
}

export default Tables
