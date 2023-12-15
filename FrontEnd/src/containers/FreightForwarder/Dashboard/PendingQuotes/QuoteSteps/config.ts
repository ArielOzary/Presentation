import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import useRateShipmentOptions from 'containers/Rate/GeneralInfo/ShipmentTypes/hooks/rateShipmentOptions'

import { ClientCustomQuoteDto } from 'models'

export const useQuoteStepsLabel = (item: ClientCustomQuoteDto) => {
  const { t, i18n } = useTranslation(['ffClients', 'searchQuote'])

  const { shippingType, origin, destination } = item

  const { incoterms, options, types } = useRateShipmentOptions()

  const shippingLabel = useMemo(() => {
    if (shippingType) {
      const incoterm = incoterms.find(
        el => el.type === shippingType?.shipmentIncoterms
      )?.value
      const option = options.find(
        el => el.type === shippingType?.shipmentOption
      )?.value
      const type = types.find(
        el => el.type === shippingType?.shipmentType
      )?.value
      return `${incoterm} | ${option} | ${type}`
    } else {
      return t('searchQuote:shippingType.label')
    }
  }, [item, i18n.language])

  const originLabel = useMemo(() => {
    if (origin?.city) {
      return `${origin.country}, ${origin.city}`
    }

    return `${origin?.country}, ${origin?.portName}`
  }, [origin, i18n.language])

  const destinationLabel = useMemo(() => {
    if (destination?.city) {
      return `${destination.country}, ${destination.city}`
    }

    return `${destination?.country}, ${destination?.portName}`
  }, [destination, i18n.language])

  return { shippingLabel, originLabel, destinationLabel }
}
