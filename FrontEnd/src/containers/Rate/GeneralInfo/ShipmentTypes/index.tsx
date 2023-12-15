import React, { useCallback, useEffect } from 'react'

import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'

import { useRadioGroupControl } from 'components/FormControls/hooks/radioGroupControl'

import ConfirmButton from '../../_components/ConfirmButton'
import ShipmentRadioButton from './ShipmentRadioButton'
import useRateShipmentOptions from './hooks/rateShipmentOptions'
import {
  RateShipmentTypesSchemaType,
  useRateShipmentTypesForm,
} from './hooks/rateShipmentTypesFrom'

import { RateSteps, ShipmentOption, ShipmentType } from 'models'
import { useFreightForwarderClientsStore } from 'stores/freightForwarderClients'
import { useRateStore } from 'stores/rate'

import styles from './styles.module.scss'

interface Props {
  setStep: (value: RateSteps) => void
}

const ShipmentTypes: React.FC<Props> = ({ setStep }) => {
  const { t } = useTranslation(['newRate'])

  const customQuote = useFreightForwarderClientsStore(
    store => store.customQuote
  )
  const { shipmentType, setRateShipmentType } = useRateStore(
    ({ rate, setRateShipmentType }) => ({
      shipmentType: customQuote?.shippingType
        ? customQuote.shippingType
        : rate.shippingType,
      setRateShipmentType,
    }),
    shallow
  )

  const { control, watch, setValue, handleSubmit } = useRateShipmentTypesForm({
    defaultValues: { ...shipmentType },
  })

  const shipmentOption = watch('shipmentOption')
  const { renderRadioGroupControl } =
    useRadioGroupControl<RateShipmentTypesSchemaType>()

  const { shipmentOptions, typeOptions, incotermsOptions } =
    useRateShipmentOptions({ shipmentOption })

  const handleConfirm = useCallback((data: RateShipmentTypesSchemaType) => {
    setRateShipmentType(data)
    setStep(RateSteps.EXPIRATION)
  }, [])

  useEffect(() => {
    if (shipmentOption === ShipmentOption.Air) {
      setValue('shipmentType', ShipmentType.LCL)
    }
  }, [shipmentOption])

  return (
    <div className={styles.container}>
      <p className={styles.textHeader}>{t('newRate:tellUs')}</p>
      <p className={styles.textBody}>{t('newRate:incoterms')}</p>
      <Controller
        control={control}
        name="shipmentIncoterms"
        render={renderRadioGroupControl(
          {},
          {
            className: styles.radioGroup,
            children: (
              <div>
                {incotermsOptions.map(opt => (
                  <ShipmentRadioButton key={opt.value} {...opt} />
                ))}
              </div>
            ),
          }
        )}
      />
      <div className={styles.box}>
        <div className={styles.block}>
          <p className={styles.textBody}>{t('newRate:shipmentType')}</p>
          <Controller
            control={control}
            name="shipmentOption"
            render={renderRadioGroupControl(
              {},
              {
                className: styles.radioGroup,
                children: (
                  <div>
                    {shipmentOptions.map(opt => (
                      <ShipmentRadioButton key={opt.value} {...opt} />
                    ))}
                  </div>
                ),
              }
            )}
          />
        </div>
        <div className={styles.block}>
          <p className={styles.textBody}>{t('newRate:containerLoadType')}</p>
          <Controller
            control={control}
            name="shipmentType"
            render={renderRadioGroupControl(
              {},
              {
                className: styles.radioGroup,
                children: (
                  <div>
                    {typeOptions.map(opt => (
                      <ShipmentRadioButton key={opt.value} {...opt} />
                    ))}
                  </div>
                ),
              }
            )}
          />
        </div>
      </div>

      <ConfirmButton nextStep={handleSubmit(handleConfirm)} />
    </div>
  )
}

export default ShipmentTypes
