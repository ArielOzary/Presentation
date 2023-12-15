import React, { useEffect } from 'react'

import { WarningOutlined } from '@ant-design/icons'
import { Alert, Form, Space } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import useInputNumberControl from 'components/FormControls/hooks/inputNumberControl'
import { useSelectControl } from 'components/FormControls/hooks/selectControl'

import ConfirmBtn from '../../../ConfirmBtn'
import {
  LCLShipmentSchemaType,
  useLCLShipmentForm,
} from './hooks/lclShipmentSchema'

import { QuoteSteps, VolumeFormat, WeightFormat } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import { volumeFormatOptions, weightFormatOptions } from 'utils/const'
import { handleKeyPress } from 'utils/handleKeyPress'

import styles from './styles.module.scss'

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
}

const LCLShipmentForm: React.FC<Props> = ({ setIsValid, setStep }) => {
  const { t } = useTranslation(['global', 'searchQuote', 'quote'])

  const [lclShipmentForm, setLclShipmentForm] = useSearchQuoteStore(store => [
    store.lclShipmentForm,
    store.setLclShipmentForm,
  ])

  const {
    control,
    handleSubmit,
    formState: { isValidating, errors },
  } = useLCLShipmentForm({
    defaultValues: lclShipmentForm
      ? lclShipmentForm
      : {
          weightFormat: WeightFormat.KG,
          volumeFormat: VolumeFormat.CBM,
        },
  })

  const errorsArr = Object.values(errors)

  const { renderSelectControl } = useSelectControl<LCLShipmentSchemaType>()
  const { renderInputNumberControl } =
    useInputNumberControl<LCLShipmentSchemaType>()

  const handleForm = (value: LCLShipmentSchemaType) => {
    setLclShipmentForm(value)
    setStep(QuoteSteps.GOODS)
  }

  useEffect(() => {
    errorsArr.length ? setIsValid(false) : setIsValid(true)
  }, [errorsArr])

  return (
    <>
      <Alert
        description={t('searchQuote:load.lclForm.alert')}
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        className={styles.alert}
      />
      <Form layout="vertical" onFinish={handleSubmit(handleForm)}>
        <div className={styles.formRow}>
          <Controller
            name="unitsQuantity"
            control={control}
            render={renderInputNumberControl(
              {
                label: (
                  <strong># {t('searchQuote:load.lclForm.ofUnits')}</strong>
                ),
              },
              {
                placeholder: '1',
                size: 'large',
                className: styles.inputNumber,
                onKeyPress: handleKeyPress,
              }
            )}
          />
          <Space.Compact className={styles.inputAddon}>
            <Controller
              name="volume"
              control={control}
              render={renderInputNumberControl(
                {
                  label: (
                    <strong className={styles.label}>
                      {t('quote:total')} {t('searchQuote:load.lclForm.volume')}
                    </strong>
                  ),
                },
                {
                  controls: false,
                  placeholder: '0',
                  size: 'large',
                  onKeyPress: handleKeyPress,
                }
              )}
            />
            <Controller
              name="volumeFormat"
              control={control}
              render={renderSelectControl(
                { label: <div /> },
                {
                  options: volumeFormatOptions,
                  className: styles.select,
                }
              )}
            />
          </Space.Compact>
          <Space.Compact className={styles.inputAddon}>
            <Controller
              name="weight"
              control={control}
              render={renderInputNumberControl(
                {
                  label: (
                    <strong className={styles.label}>
                      {t('quote:total')} {t('global:weight')}
                    </strong>
                  ),
                },
                {
                  placeholder: '0',
                  size: 'large',
                  controls: false,
                  onKeyPress: handleKeyPress,
                }
              )}
            />

            <Controller
              name="weightFormat"
              control={control}
              render={renderSelectControl(
                { label: <div /> },
                {
                  options: weightFormatOptions,
                  className: styles.select,
                }
              )}
            />
          </Space.Compact>
        </div>
        <ConfirmBtn isValidating={isValidating} isLoad />
      </Form>
    </>
  )
}

export default LCLShipmentForm
