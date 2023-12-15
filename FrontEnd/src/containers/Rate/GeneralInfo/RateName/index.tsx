import React, { useCallback } from 'react'

import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useInputControl } from 'components/FormControls/hooks/inputControl'

import ConfirmButton from '../../_components/ConfirmButton'
import { RateNameSchemaType, useRateNameForm } from './hooks/rateNameForm'

import { RateSteps } from 'models'
import { useRateStore } from 'stores/rate'

import styles from './styles.module.scss'

interface Props {
  setStep: (value: RateSteps) => void
}

const RateName: React.FC<Props> = ({ setStep }) => {
  const { t } = useTranslation(['newRate'])
  const { name, setRateValue } = useRateStore(
    ({ rate, setRateValue }) => ({
      setRateValue,
      name: rate.name || '',
    }),
    shallow
  )

  const { control, handleSubmit } = useRateNameForm({
    defaultValues: { name },
  })
  const { renderInputControl } = useInputControl<RateNameSchemaType>()

  const handleConfirm = useCallback(({ name }: RateNameSchemaType) => {
    setRateValue('name', name)
    setStep(RateSteps.CARRIER)
  }, [])

  return (
    <div className={styles.container}>
      <span className={styles.headerText}>
        {t('newRate:giveYourRateAName')}
      </span>
      <span className={styles.bodyText}>{t('newRate:rateName')}</span>

      <Controller
        control={control}
        name="name"
        render={renderInputControl(
          {},
          { placeholder: t('newRate:italyFreightQuote') }
        )}
      />

      <ConfirmButton nextStep={handleSubmit(handleConfirm)} />
    </div>
  )
}

export default RateName
