import React, { useCallback } from 'react'

import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useSelectControl } from 'components/FormControls/hooks/selectControl'

import ConfirmButton from '../../_components/ConfirmButton'
import useFreightForwarderOptions from './hooks/freightForwarderOptions'
import {
  RateCarriersSchemaType,
  useRateCarriersForm,
} from './hooks/rateCarriersForm'

import { RateSteps } from 'models'
import { useEnvStore } from 'stores/env'
import { useRateStore } from 'stores/rate'

import { useRole } from 'utils/hooks/roleHook'

import styles from './styles.module.scss'

interface Props {
  setStep: (value: RateSteps) => void
}

const Carrier: React.FC<Props> = ({ setStep }) => {
  const { t } = useTranslation(['newRate'])
  const { id } = useParams<{ id: string }>()

  const { freightForwarder } = useRole()

  const { carrierId, companyId, setRateValue } = useRateStore(
    ({ rate, setRateValue }) => ({
      carrierId: rate.carrierId,
      // companyId: rate.companyId || freightForwarder ? 1 : undefined,
      companyId: freightForwarder ? 1 : rate.companyId,

      setRateValue,
    }),
    shallow
  )

  const { control, handleSubmit } = useRateCarriersForm({
    defaultValues: {
      carrierId: carrierId || undefined,
      companyId: companyId || undefined,
    },
  })

  const { renderSelectControl } = useSelectControl<RateCarriersSchemaType>()
  const { options, isLoading } = useFreightForwarderOptions()

  const handleConfirm = useCallback(
    ({ carrierId, companyId }: RateCarriersSchemaType) => {
      setRateValue('carrierId', carrierId)
      setRateValue('companyId', freightForwarder ? undefined : companyId)
      setStep(RateSteps.SHIPMENT_TYPE)
    },
    []
  )

  return (
    <div className={styles.container}>
      <p className={styles.textHeader}>{t('newRate:whoWillBeShipping')}</p>
      <p className={styles.textBody}>{t('newRate:carrier')}</p>
      <Controller
        control={control}
        name="carrierId"
        render={renderSelectControl(
          { className: styles.selectItem },
          { placeholder: t('newRate:ZIM'), options, loading: isLoading }
        )}
      />
      {!freightForwarder && (
        <>
          <p className={styles.textBody}>{t('newRate:freightForwarder')}</p>
          <Controller
            control={control}
            name="companyId"
            render={renderSelectControl(
              { className: styles.selectItem },
              {
                placeholder: t('newRate:ZIM'),
                options,
                loading: isLoading,
                disabled: Boolean(id),
              }
            )}
          />
        </>
      )}

      <ConfirmButton nextStep={handleSubmit(handleConfirm)} />
    </div>
  )
}

export default Carrier
