import React, { useMemo } from 'react'

import { EditOutlined } from '@ant-design/icons'
import { Button, Spin } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import AvatarWithInitials from 'components/AvatarWithInitials'

import useRateShipmentOptions from 'containers/Rate/GeneralInfo/ShipmentTypes/hooks/rateShipmentOptions'

import { useGetCompaniesFreightForwarder } from 'fetchers'
import { useGetRateById } from 'fetchers/rates'

import { dateFormat } from 'utils/formatters'

import styles from './styles.module.scss'

interface Props {
  refetchList: () => void
}
const Card: React.FC<Props> = () => {
  const { t, i18n } = useTranslation(['rates', 'newRate'])
  const params = useParams<{ id: string }>()

  const { incoterms, options, types } = useRateShipmentOptions()

  const { data: rate, isLoading: isRateLoading } = useGetRateById(
    Number(params.id || 0),
    { enabled: Boolean(params.id) }
  )

  const carrierBasicInfo = useGetCompaniesFreightForwarder(
    rate?.carrierId || 0,
    {
      enabled: Boolean(rate?.carrierId),
    }
  )
  const forwarderBasicInfo = useGetCompaniesFreightForwarder(
    rate?.companyId || 0,
    {
      enabled: Boolean(rate?.companyId),
    }
  )

  const shippingTypeValue = useMemo(() => {
    if (rate?.shippingType) {
      const { shippingType } = rate

      const incoterm = incoterms.find(
        el => el.type === shippingType?.shipmentIncoterms
      )?.value
      const option = options.find(
        option => option.type === shippingType?.shipmentOption
      )?.value
      const type = types.find(
        el => el.type === shippingType?.shipmentType
      )?.value

      return `${incoterm} | ${option} | ${type}`
    }
    return '-'
  }, [rate?.shippingType, i18n.language])

  const expirationValue = useMemo(
    () =>
      rate?.startDate && rate?.endDate
        ? `${dayjs(rate?.startDate).format(dateFormat)} - ${dayjs(
            rate?.endDate
          ).format(dateFormat)}`
        : '-',
    [rate?.startDate, rate?.endDate]
  )

  const isLoading = useMemo(
    () =>
      isRateLoading ||
      carrierBasicInfo.isLoading ||
      forwarderBasicInfo.isLoading,
    [isRateLoading, carrierBasicInfo.isLoading, forwarderBasicInfo.isLoading]
  )

  return rate ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <AvatarWithInitials
          styles={styles.avatar}
          name={forwarderBasicInfo.data?.companyNameEn}
        />
        <span className={styles.title}>
          {forwarderBasicInfo.data?.companyNameEn || ''}
        </span>
      </div>

      <div className={styles.description}>
        <div>
          <span className={styles.title}>{t('newRate:carrier')}</span>
          <p className={styles.info}>
            {carrierBasicInfo.data?.companyNameEn || '-'}
          </p>
        </div>
        <div>
          <span className={styles.title}>{t('newRate:shipmentType')}</span>
          <p className={styles.info}>{shippingTypeValue}</p>
        </div>
        <div>
          <span className={styles.title}>{t('newRate:expiration')}</span>
          <p className={styles.info}>{expirationValue}</p>
        </div>
      </div>

      <Link to={`/rate/${params.id}`} className={styles.editBtn}>
        <Button icon={<EditOutlined />} type="text" size="large" />
      </Link>
    </div>
  ) : (
    <Spin spinning={isLoading}>
      <div className={styles.container} />
    </Spin>
  )
}

export default Card
