import React, { useCallback } from 'react'

import { Radio, RadioChangeEvent } from 'antd'
import { useTranslation } from 'react-i18next'

import Scrollbars from 'components/Scrollbars'

import LCLShipmentForm from './LCLShipmentForm'
import LCLUnitsForm from './LCLUnitsForm'
import { useConfig } from './hooks/config'

import { CalculationOption, QuoteSteps } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
}

const LoadLCL: React.FC<Props> = ({ setIsValid, setStep }) => {
  const { t } = useTranslation(['searchQuote'])

  const [calculationOption, setCalculationOption] = useSearchQuoteStore(
    store => [store.calculationOption, store.setCalculationOption]
  )

  const { options } = useConfig()

  const handleRadioChange = useCallback((e: RadioChangeEvent) => {
    setCalculationOption(e.target.value)
  }, [])

  return (
    <div className={styles.formWrapper}>
      <Scrollbars className={styles.scrollBar}>
        <div className={styles.title}>{t('searchQuote:load.lclTitle')}</div>
        <Radio.Group
          options={options}
          onChange={handleRadioChange}
          value={calculationOption}
          className={styles.radioCalculation}
        />
        {calculationOption === CalculationOption.UnitType ? (
          <LCLUnitsForm setIsValid={setIsValid} setStep={setStep} />
        ) : (
          <LCLShipmentForm setIsValid={setIsValid} setStep={setStep} />
        )}
      </Scrollbars>
    </div>
  )
}

export default LoadLCL
