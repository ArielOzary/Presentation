import React, { useCallback, useEffect, useMemo } from 'react'

import { Form, Spin } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useSelectControl } from 'components/FormControls/hooks/selectControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'

import { usePlaceAutocomplete } from 'containers/Rate/_components/ZoneSelect/hooks/placeAutocomplete'

import ConfirmBtn from '../../ConfirmBtn'
import { Props } from '../hooks/config'
import {
  OriginWithoutPortSchema,
  useOriginWithoutPortForm,
} from '../hooks/originForm'

import { QuoteSteps, ZoneType } from 'models'
import { useGeoStore } from 'stores/geo'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

const FormWithoutPort: React.FC<Props> = ({
  destination,
  setStep,
  setIsValid,
}) => {
  const { t } = useTranslation(['global', 'searchQuote', 'createSupplier'])

  const [country, setCountry] = useGeoStore(store => [
    store.country,
    store.setCountry,
  ])

  const {
    options: cityOptions,
    isLoading: cityLoading,
    setSearch,
  } = usePlaceAutocomplete(ZoneType.City, country)

  const {
    options,
    isLoading,
    setSearch: setCountrySearch,
  } = usePlaceAutocomplete(ZoneType.Country)

  const [
    originInfo,
    setOriginInfo,
    setDestinationInfo,
    destinationInfo,
    setOriginState,
    setDestinationState,
    setPortName,
    setPortOfDestination,
  ] = useSearchQuoteStore(store => [
    store.originInfo,
    store.setOriginInfo,
    store.setDestinationInfo,
    store.destinationInfo,
    store.setOriginState,
    store.setDestinationState,
    store.setPortName,
    store.setPortOfDestination,
  ])

  const defaultValues = () => {
    if (originInfo && !destination) return originInfo
    if (destinationInfo) return destinationInfo

    return country === 'United States'
      ? { isKnownSupplier: true }
      : { isKnownSupplier: false }
  }

  const {
    control,
    handleSubmit,
    formState: { isValidating, errors },
    setValue,
  } = useOriginWithoutPortForm({
    defaultValues: defaultValues(),
  })

  const errorsArr = Object.values(errors)

  const { renderSelectControl } = useSelectControl<OriginWithoutPortSchema>()
  const { renderInputControl } = useInputControl<OriginWithoutPortSchema>()
  const { renderSwitchControl } = useSwitchControl<OriginWithoutPortSchema>()

  const handleSelectCountryChange = useCallback((value: string) => {
    setCountry(value)
  }, [])

  const decodeStateAbbr = async (stateAbbreviation: string) => {
    const geocoder = new google.maps.Geocoder()
    let stateName = ''

    await geocoder.geocode(
      { address: stateAbbreviation, language: 'en' },
      (results, status) => {
        if (status == 'OK' && results) {
          const location = results[0]
          for (const component of location.address_components) {
            if (component.types.includes('administrative_area_level_1')) {
              stateName = component.long_name
              break
            }
          }
        }
      }
    )

    return stateName
  }

  const handleSelectCityChange = useCallback(async (value: string) => {
    const cityNameArr = value.split(',')
    setValue('city', cityNameArr[0])

    if (cityNameArr.length === 3) {
      const stateName = await decodeStateAbbr(
        `${cityNameArr[1]},${cityNameArr[2]}`
      )
      destination ? setDestinationState(stateName) : setOriginState(stateName)
    }
  }, [])

  const handleForm = (value: OriginWithoutPortSchema) => {
    console.log(value, 'value')
    destination ? setDestinationInfo(value) : setOriginInfo(value)
    destination ? setStep(QuoteSteps.LOAD) : setStep(QuoteSteps.DESTINATION)
  }

  const notFoundContent = useMemo(
    () =>
      isLoading || cityLoading ? (
        <div className={styles.spinner}>
          <Spin size="small" />
        </div>
      ) : undefined,
    [isLoading, cityLoading]
  )

  useEffect(() => {
    errorsArr.length ? setIsValid(false) : setIsValid(true)
  }, [errors])

  useEffect(() => {
    setPortOfDestination('')
    setPortName('')
    if (originInfo?.country && !destination) {
      setCountry(originInfo.country)
    } else if (destinationInfo?.country && destination) {
      setCountry(destinationInfo.country)
    } else setCountry('')
  }, [])

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleForm)}>
      <div className={styles.formRow}>
        <Controller
          name="country"
          control={control}
          render={renderSelectControl(
            { label: t('global:country') },
            {
              showSearch: true,
              autoClearSearchValue: true,
              options,
              size: 'large',
              loading: isLoading,
              placeholder: t('global:country'),
              onSearch: setCountrySearch,
              onSelect: handleSelectCountryChange,
              notFoundContent,
            }
          )}
        />
        <Controller
          name="city"
          control={control}
          render={renderSelectControl(
            { label: t('searchQuote:origin.city') },
            {
              showSearch: true,
              autoClearSearchValue: true,
              options: cityOptions,
              size: 'large',
              loading: cityLoading,
              placeholder: t('searchQuote:origin.city'),
              onSearch: setSearch,
              onSelect: handleSelectCityChange,
              notFoundContent,
            }
          )}
        />
        <Controller
          name="zip"
          control={control}
          render={renderInputControl(
            { label: t('searchQuote:origin.zipCode') },
            { placeholder: '91204', size: 'large' }
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

export default FormWithoutPort
