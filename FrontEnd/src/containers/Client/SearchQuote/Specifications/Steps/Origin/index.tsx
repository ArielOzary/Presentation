import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import FormWithPort from './FormWithPort'
import FormWithoutPort from './FormWithoutPort'

import { useGetCountries } from 'fetchers/geo'
import { QuoteSteps, SelectOption, ShipmentIncoterms } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
  destination: boolean
}

const Origin: React.FC<Props> = ({ setIsValid, setStep, destination }) => {
  const { t } = useTranslation(['global', 'searchQuote', 'createSupplier'])

  const [options, setOptions] = useState<SelectOption[]>([])

  const shippingType = useSearchQuoteStore(store => store.shippingType)

  const { data, isLoading } = useGetCountries()

  useEffect(() => {
    if (data) {
      setOptions(data.map(el => ({ label: el, value: el })))
    } else {
      setOptions([])
    }
  }, [data])

  return shippingType ? (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {destination
          ? `${t('searchQuote:destination.title')}`
          : ` ${t('searchQuote:origin.title')} ${t(
              'searchQuote:origin.dropdownTitle'
            )}`}
      </div>
      {shippingType.shipmentIncoterms &&
      [ShipmentIncoterms.FOB, ShipmentIncoterms.CIF].includes(
        shippingType.shipmentIncoterms
      ) ? (
        <FormWithPort
          destination={destination}
          setStep={setStep}
          options={options}
          isLoading={isLoading}
          setIsValid={setIsValid}
        />
      ) : (
        <FormWithoutPort
          destination={destination}
          setStep={setStep}
          options={options}
          isLoading={isLoading}
          setIsValid={setIsValid}
        />
      )}
    </div>
  ) : null
}

export default Origin
