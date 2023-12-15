import React, { ReactNode, useCallback, useEffect, useMemo } from 'react'

import { Form, Spin } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useSelectControl } from 'components/FormControls/hooks/selectControl'
import { useSelectPortControl } from 'components/FormControls/hooks/selectPortControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'

import { usePlaceAutocomplete } from 'containers/Rate/_components/ZoneSelect/hooks/placeAutocomplete'

import ConfirmBtn from '../../ConfirmBtn'
import { Props } from '../hooks/config'
import {
  OriginWithPortSchema,
  useOriginWithPortForm,
} from '../hooks/originForm'

import { QuoteSteps, ZoneType } from 'models'
import { useGeoStore } from 'stores/geo'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

const FormWithPort: React.FC<Props> = ({
  destination,
  setStep,
  // options,
  // isLoading,
  setIsValid,
}) => {
  const { t } = useTranslation(['global', 'searchQuote', 'createSupplier'])

  const [country, setCountry, setSearchPortName] = useGeoStore(store => [
    store.country,
    store.setCountry,
    store.setSearchPortName,
  ])

  const {
    options,
    isLoading,
    setSearch: setCountrySearch,
  } = usePlaceAutocomplete(ZoneType.Country)

  const [
    originInfo,
    destinationInfo,
    setOriginInfo,
    setPortName,
    setDestinationInfo,
    setPortOfDestination,
  ] = useSearchQuoteStore(store => [
    store.originInfo,
    store.destinationInfo,
    store.setOriginInfo,
    store.setPortName,
    store.setDestinationInfo,
    store.setPortOfDestination,
  ])

  const defaultValues = () => {
    if (originInfo && !destination) {
      return originInfo
    }

    if (destinationInfo) {
      return destinationInfo
    }

    return country === 'United States'
      ? { isKnownSupplier: true }
      : { isKnownSupplier: false }
  }

  const {
    control,
    handleSubmit,
    formState: { isValidating, errors },
  } = useOriginWithPortForm({
    defaultValues: defaultValues(),
  })

  const errorsArr = Object.values(errors)

  const { renderSelectControl } = useSelectControl<OriginWithPortSchema>()
  const { renderInputControl } = useInputControl<OriginWithPortSchema>()
  const { renderSwitchControl } = useSwitchControl<OriginWithPortSchema>()
  const { renderSelectPortControl } =
    useSelectPortControl<OriginWithPortSchema>()

  const handleSelectChange = useCallback((value: string) => {
    setCountry(value)
  }, [])

  const handleSelectPort = useCallback(
    (value: number, option: { label: ReactNode }) => {
      destination
        ? setPortOfDestination(option.label as unknown as string)
        : setPortName(option.label as unknown as string)
      setSearchPortName('')
    },
    []
  )

  const handleForm = (value: OriginWithPortSchema) => {
    destination ? setDestinationInfo(value) : setOriginInfo(value)
    destination ? setStep(QuoteSteps.LOAD) : setStep(QuoteSteps.DESTINATION)
  }

  const notFoundContent = useMemo(
    () =>
      isLoading ? (
        <div className={styles.spinner}>
          <Spin size="small" />
        </div>
      ) : undefined,
    [isLoading]
  )

  useEffect(() => {
    errorsArr.length ? setIsValid(false) : setIsValid(true)
  }, [errorsArr])

  useEffect(() => {
    if (originInfo?.country && !destination) {
      setCountry(originInfo.country)
    } else if (destinationInfo?.country && destination) {
      setCountry(destinationInfo.country)
    } else setCountry('')
  }, [originInfo, destinationInfo, destination])

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleForm)}>
      <div className={styles.formRow}>
        <Controller
          name="country"
          control={control}
          render={renderSelectControl(
            {
              label: t('global:country'),
              className: styles.selectInput,
            },
            {
              showSearch: true,
              autoClearSearchValue: true,
              options,
              size: 'large',
              loading: isLoading,
              placeholder: t('global:country'),
              onSelect: handleSelectChange,
              onSearch: setCountrySearch,
              notFoundContent,
            }
          )}
        />
        <Controller
          control={control}
          name="portId"
          render={renderSelectPortControl(
            {
              label: t('searchQuote:origin.dropdownTitle'),
              className: styles.selectInput,
            },
            {
              size: 'large',
              showSearch: true,
              autoClearSearchValue: true,
              onSelect: handleSelectPort,
              onSearch: setSearchPortName,
            }
          )}
        />
      </div>
      <Controller
        name="address"
        control={control}
        render={renderInputControl(
          { label: t('createSupplier:address') },
          { placeholder: t('createSupplier:address'), size: 'large' }
        )}
      />
      {country === 'United States' && !destination && (
        <Controller
          control={control}
          name="isKnownSupplier"
          render={renderSwitchControl({
            label: t('searchQuote:origin.knownSupplier'),
          })}
        />
      )}
      <ConfirmBtn isValidating={isValidating} isLoad={false} />
    </Form>
  )
}

export default FormWithPort
