import React, { useEffect, useMemo, useState } from 'react'

import { Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Header from 'components/Header'

import GeneralInfo from './GeneralInfo'
import Tables from './Tables'
import { useInitRate } from './_hooks/initRate'

import { RateSteps } from 'models'
import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'
import { useRateStore } from 'stores/rate'

import styles from './styles.module.scss'

const Rate: React.FC = () => {
  const { t, i18n } = useTranslation(['newRate'])
  const { id } = useParams<{ id: string }>()

  const setRateShipmentType = useRateStore(store => store.setRateShipmentType)
  const customQuote = useFreightForwarderClientsStore(
    store => store.customQuote
  )

  const [step, setStep] = useState<RateSteps>(
    id ? RateSteps.CHARGES : RateSteps.NAME
  )
  const { isLoading } = useInitRate(id)

  const stepContent = useMemo(() => {
    if (step === RateSteps.CHARGES) {
      return (
        <div className={styles.charges}>
          <div className={styles.newRate}>
            <GeneralInfo step={step} setStep={setStep} />
          </div>

          <p className={styles.newRateText}>
            {t(id ? 'newRate:editRate' : 'newRate:uploadNewRate')}
          </p>
          <Tables />
        </div>
      )
    }

    return (
      <div className={styles.generalInfo}>
        <p className={styles.headerText}>
          {t(id ? 'newRate:editRate' : 'newRate:uploadNewRate')}
        </p>
        <p className={styles.generalInfoText}>{t('newRate:generalInfo')}</p>
        <GeneralInfo step={step} setStep={setStep} />
      </div>
    )
  }, [step, i18n.language])

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    customQuote?.shippingType && setRateShipmentType(customQuote.shippingType)
  }, [customQuote?.shippingType])

  return (
    <>
      <Header />
      <div className="wrapper">
        {isLoading ? <Spin className={styles.loading} spinning /> : stepContent}
      </div>
    </>
  )
}

export default Rate
