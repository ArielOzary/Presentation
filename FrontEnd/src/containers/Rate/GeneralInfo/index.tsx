import React, { useCallback, useMemo } from 'react'

import { ArrowRightOutlined, FormOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import cn from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import GeneralInfoDropdown from '../_components/GeneralInfoDropdown'
import Carrier from './Carrier'
import Expiration from './Expiration'
import RateName from './RateName'
import ShipmentTypes from './ShipmentTypes'
import useRateShipmentOptions from './ShipmentTypes/hooks/rateShipmentOptions'

import { useGetCompaniesFreightForwarder } from 'fetchers'
import { RateSteps } from 'models'
import { generalInfoSelector, useRateStore } from 'stores/rate'

import { dateFormat } from 'utils/formatters'
import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

interface Props {
  step: RateSteps
  setStep: (value: RateSteps) => void
}

const GeneralInfo: React.FC<Props> = ({ step, setStep }) => {
  const { t } = useTranslation(['newRate'])

  const {
    fullFilled,
    // step,
    name,
    shippingType,
    startDate,
    endDate,
    carrierId,
    companyId,
    // setStep,
  } = useRateStore(generalInfoSelector, shallow)

  const { freightForwarder } = useRole()

  const carrierBasicInfo = useGetCompaniesFreightForwarder(carrierId || 0, {
    enabled: Boolean(carrierId),
  })

  const forwarderBasicInfo = useGetCompaniesFreightForwarder(companyId || 0, {
    enabled: Boolean(companyId),
  })

  const { incoterms, options, types } = useRateShipmentOptions()

  const carrierValue = useMemo(() => {
    // if (carrierBasicInfo.data && forwarderBasicInfo.data) {
    //   return freightForwarder
    //     ? carrierBasicInfo.data.companyNameEn || ''
    //     : `${carrierBasicInfo.data.companyNameEn} | ${forwarderBasicInfo.data.companyNameEn}`
    // }

    // return '-'

    if (freightForwarder) {
      return carrierBasicInfo.data?.companyNameEn
        ? `${carrierBasicInfo.data?.companyNameEn}`
        : '-'
    } else if (carrierBasicInfo.data && forwarderBasicInfo.data) {
      return `${carrierBasicInfo.data.companyNameEn} | ${forwarderBasicInfo.data.companyNameEn}`
    } else return '-'
  }, [carrierBasicInfo, forwarderBasicInfo, freightForwarder])

  const shippingTypeValue = useCallback(() => {
    if (shippingType) {
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
  }, [shippingType])

  const expirationValue = useMemo(
    () =>
      startDate && endDate
        ? `${dayjs(startDate).format(dateFormat)} - ${dayjs(endDate).format(
            dateFormat
          )}`
        : '-',
    [startDate, endDate]
  )

  const handleToggle = useCallback(() => {
    if (step === RateSteps.CHARGES) {
      setStep(RateSteps.NAME)
    } else if (fullFilled) {
      setStep(RateSteps.CHARGES)
    }
  }, [step, fullFilled])

  return (
    <div
      className={cn(
        styles.container,
        step === RateSteps.CHARGES && styles.charges
      )}
    >
      <GeneralInfoDropdown
        step={step}
        setStep={setStep}
        currentStep={RateSteps.NAME}
        title={t('newRate:rateName')}
        value={name || '-'}
      >
        <RateName setStep={setStep} />
      </GeneralInfoDropdown>
      <GeneralInfoDropdown
        step={step}
        setStep={setStep}
        currentStep={RateSteps.CARRIER}
        title={t('newRate:carrier')}
        value={carrierValue}
      >
        <Carrier setStep={setStep} />
      </GeneralInfoDropdown>
      <GeneralInfoDropdown
        step={step}
        setStep={setStep}
        currentStep={RateSteps.SHIPMENT_TYPE}
        title={t('newRate:shipmentType')}
        value={shippingTypeValue()}
      >
        <ShipmentTypes setStep={setStep} />
      </GeneralInfoDropdown>
      <GeneralInfoDropdown
        step={step}
        setStep={setStep}
        currentStep={RateSteps.EXPIRATION}
        title={t('newRate:expiration')}
        value={expirationValue}
      >
        <Expiration setStep={setStep} />
      </GeneralInfoDropdown>

      <Button
        onClick={handleToggle}
        icon={
          step === RateSteps.CHARGES ? <FormOutlined /> : <ArrowRightOutlined />
        }
        size="large"
        type="primary"
        className={styles.continueBtn}
        disabled={!fullFilled}
      />
    </div>
  )
}

export default GeneralInfo
