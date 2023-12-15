import React, { useEffect, useMemo, useRef } from 'react'

import { QuestionCircleOutlined } from '@ant-design/icons'
import { Form, Tooltip } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from 'usehooks-ts'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useRadioGroupControl } from 'components/FormControls/hooks/radioGroupControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'

import ShipmentRadioButton from 'containers/Rate/GeneralInfo/ShipmentTypes/ShipmentRadioButton'
import useRateShipmentOptions from 'containers/Rate/GeneralInfo/ShipmentTypes/hooks/rateShipmentOptions'

import ConfirmBtn from '../ConfirmBtn'
import {
  ShippingTypeSchemaType,
  useShippingTypeForm,
} from './hooks/shippingTypeForm'

import { QuoteSteps, ShipmentOption, ShipmentType } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
}

const ShippingType: React.FC<Props> = ({ setIsValid, setStep }) => {
  const { t, i18n } = useTranslation(['global', 'searchQuote', 'shipments'])

  const [shippingType, setShippingType] = useSearchQuoteStore(store => [
    store.shippingType,
    store.setShippingType,
  ])

  const incotermsTooltip = useMemo(
    () => (
      <>
        <p>{t('searchQuote:shippingType.incotermsTooltip.EXW')}</p>
        <p>{t('searchQuote:shippingType.incotermsTooltip.FOB')}</p>
        <p>{t('searchQuote:shippingType.incotermsTooltip.CIF')}</p>
        <p>{t('searchQuote:shippingType.incotermsTooltip.DDP')}</p>
      </>
    ),
    [i18n.language]
  )

  const {
    control,
    handleSubmit,
    formState: { isValidating, errors },
    watch,
    setValue,
  } = useShippingTypeForm({
    defaultValues: shippingType
      ? shippingType
      : { customs: true, insurance: true },
  })

  const { shipmentOptions, typeOptions, incotermsOptions } =
    useRateShipmentOptions()

  const errorsArr = Object.values(errors)

  const { renderSwitchControl } = useSwitchControl<ShippingTypeSchemaType>()
  const { renderRadioGroupControl } =
    useRadioGroupControl<ShippingTypeSchemaType>()

  const handleForm = (value: ShippingTypeSchemaType) => {
    setShippingType(value)

    setStep(QuoteSteps.ORIGIN)
  }

  const isDisabled = (type: ShipmentType) => {
    return watch().shipmentOption === ShipmentOption.Air &&
      type === ShipmentType.FCL
      ? true
      : false
  }

  useEffect(() => {
    errorsArr.length ? setIsValid(false) : setIsValid(true)
  }, [errorsArr])

  useEffect(() => {
    if (watch().shipmentOption === ShipmentOption.Air) {
      setValue('shipmentType', ShipmentType.LCL)
    }
  }, [watch().shipmentOption])

  const ref = useRef(null)

  const handleClickOutside = () => {
    setStep(QuoteSteps.DEFAULT)
  }

  useOnClickOutside(ref, handleClickOutside)

  return (
    <div ref={ref} className={styles.wrapper}>
      <div className={styles.title}>
        <p>{t('searchQuote:shippingType.dropdownTitle')}</p>
        <Tooltip placement="rightTop" title={'text'}>
          <QuestionCircleOutlined className={styles.tooltipIcon} />
        </Tooltip>
      </div>
      <Form layout="vertical" onFinish={handleSubmit(handleForm)}>
        <Controller
          name="shipmentIncoterms"
          control={control}
          render={renderRadioGroupControl(
            {
              label: (
                <p className={styles.itemTitle}>
                  {t('searchQuote:shippingType.incoterms')}
                  <Tooltip placement="rightTop" title={incotermsTooltip}>
                    <QuestionCircleOutlined className={styles.tooltipIcon} />
                  </Tooltip>
                </p>
              ),
            },
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
        <FormRow>
          <Controller
            name="shipmentOption"
            control={control}
            render={renderRadioGroupControl(
              {
                label: (
                  <span className={styles.itemTitle}>
                    {t('searchQuote:shippingType.shipment')}
                  </span>
                ),
              },
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
          <Controller
            name="shipmentType"
            control={control}
            render={renderRadioGroupControl(
              {
                label: (
                  <span className={styles.itemTitle}>
                    {t('shipments:shipmentTypes.type')}
                  </span>
                ),
              },
              {
                className: styles.radioGroup,
                children: (
                  <div>
                    {typeOptions.map(opt => (
                      <ShipmentRadioButton
                        key={opt.value}
                        {...opt}
                        disabled={isDisabled(opt.value)}
                      />
                    ))}
                  </div>
                ),
              }
            )}
          />
        </FormRow>
        <div className={styles.switchBlock}>
          <Controller
            control={control}
            name="customs"
            render={renderSwitchControl({
              label: (
                <span className={styles.itemTitle}>
                  {t('searchQuote:shippingType.customs')}
                </span>
              ),
            })}
          />
          <Controller
            control={control}
            name="insurance"
            render={renderSwitchControl({
              label: (
                <span className={styles.itemTitle}>
                  {t('searchQuote:shippingType.insurance')}
                </span>
              ),
            })}
          />
        </div>
        <ConfirmBtn isValidating={isValidating} isLoad={false} />
      </Form>
    </div>
  )
}

export default ShippingType
