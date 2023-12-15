import React, { useCallback } from 'react'

import dayjs, { Dayjs } from 'dayjs'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useDatePickerControl } from 'components/FormControls/hooks/datePickerControl'

import ConfirmButton from '../../_components/ConfirmButton'
import {
  RateExpirationSchemaType,
  useRateExpirationForm,
} from './hooks/rateExpirationFrom'

import { RateSteps } from 'models'
import { useRateStore } from 'stores/rate'

import { useDisabledDate } from 'utils/disabledDate'

import styles from './styles.module.scss'

interface Props {
  setStep: (value: RateSteps) => void
}

const Expiration: React.FC<Props> = ({ setStep }) => {
  const { t } = useTranslation(['newRate'])
  const { disabledStartDate } = useDisabledDate()

  const { startDate, endDate, setRateValue, setFullFilled } = useRateStore(
    ({ rate, setRateValue, setFullFilled }) => ({
      startDate: rate.startDate,
      endDate: rate.endDate,
      setRateValue,
      setFullFilled,
    }),
    shallow
  )

  const { control, handleSubmit, watch } = useRateExpirationForm({
    defaultValues: {
      startDate: startDate && (dayjs(startDate) as unknown as string),
      endDate: endDate && (dayjs(endDate) as unknown as string),
    },
  })
  const _startDate = watch('startDate')
  const { renderDatePickerControl } =
    useDatePickerControl<RateExpirationSchemaType>()

  const disabledEndDate = useCallback(
    (current: Dayjs) => {
      return current < (_startDate ? dayjs(_startDate) : dayjs().startOf('day'))
    },
    [_startDate]
  )

  const handleConfirm = useCallback(
    ({ startDate, endDate }: RateExpirationSchemaType) => {
      setRateValue('startDate', startDate)
      setRateValue('endDate', endDate)
      setFullFilled(true)
      setStep(RateSteps.CHARGES)
    },
    []
  )

  return (
    <div className={styles.container}>
      <p className={styles.textHeader}>
        {t('newRate:tilWhenIsThisQuoteValid')}
      </p>
      <p className={styles.textBody}>{t('newRate:quoteExpiration')}</p>
      <div className={styles.boxData}>
        <Controller
          control={control}
          name="startDate"
          render={renderDatePickerControl(
            {},
            { disabledDate: disabledStartDate }
          )}
        />
        <span className={styles.textTil}>{t('newRate:til')}</span>
        <Controller
          control={control}
          name="endDate"
          render={renderDatePickerControl(
            {
              // style: { maxWidth: 135 }
            },
            { disabledDate: disabledEndDate }
          )}
        />
      </div>

      <ConfirmButton nextStep={handleSubmit(handleConfirm)} />
    </div>
  )
}

export default Expiration
