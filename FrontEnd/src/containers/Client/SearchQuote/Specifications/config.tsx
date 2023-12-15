import React, { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import useRateShipmentOptions from 'containers/Rate/GeneralInfo/ShipmentTypes/hooks/rateShipmentOptions'

import Goods from './Steps/Goods'
import Load from './Steps/Load'
import Origin from './Steps/Origin'
import ShippingType from './Steps/ShippingType'

import { CalculationOption, QuoteSteps, ShipmentType } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

const useConfig = (
  setIsValid?: (value: boolean) => void,
  setStep?: (value: QuoteSteps) => void
) => {
  const { t, i18n } = useTranslation(['searchQuote'])

  const [
    shippingType,
    originInfo,
    portName,
    destinationInfo,
    portOfDestination,
    lclUnitForm,
    lclShipmentForm,
    fclFormInfo,
    goodsInfo,
    calculationOption,
    originState,
    destinationState,
  ] = useSearchQuoteStore(store => [
    store.shippingType,
    store.originInfo,
    store.portName,
    store.destinationInfo,
    store.portOfDestination,
    store.lclUnitForm,
    store.lclShipmentForm,
    store.fclFormInfo,
    store.goodsInfo,
    store.calculationOption,
    store.originState,
    store.destinationState,
  ])

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
  }, [shippingType, i18n.language])

  const originLabel = useMemo(() => {
    if (!Object.keys(originInfo).length) {
      return t('searchQuote:origin.label')
    }

    if (originInfo.city) {
      return `${originInfo.country}, ${originInfo.city}`
    }

    return `${originInfo.country}, ${portName}`
  }, [originInfo, portName, i18n.language])

  const destinationLabel = useMemo(() => {
    if (!Object.keys(destinationInfo).length) {
      return t('searchQuote:destination.label')
    }

    if (destinationInfo.city) {
      return `${destinationInfo.country}, ${destinationInfo.city}`
    }

    return `${destinationInfo.country}, ${portOfDestination}`
  }, [destinationInfo, portOfDestination, i18n.language])

  const specificBlocks = useMemo(
    () =>
      setIsValid &&
      setStep && [
        {
          id: QuoteSteps.SHIPPING_TYPE,
          title: t('searchQuote:shippingType.title'),
          label: shippingLabel,
          children: <ShippingType setIsValid={setIsValid} setStep={setStep} />,
        },
        {
          id: QuoteSteps.ORIGIN,
          title: t('searchQuote:origin.title'),
          label: originLabel,
          children: (
            <Origin
              destination={false}
              setIsValid={setIsValid}
              setStep={setStep}
            />
          ),
        },
        {
          id: QuoteSteps.DESTINATION,
          title: t('searchQuote:destination.title'),
          label: destinationLabel,
          children: (
            <Origin destination setIsValid={setIsValid} setStep={setStep} />
          ),
        },
        {
          id: QuoteSteps.LOAD,
          title: t('searchQuote:load.title'),
          label: t('searchQuote:load.label'),
          children: <Load setIsValid={setIsValid} setStep={setStep} />,
        },
        {
          id: QuoteSteps.GOODS,
          title: t('searchQuote:goods.title'),
          label: t('searchQuote:goods.label'),
          children: <Goods setIsValid={setIsValid} setStep={setStep} />,
        },
      ],
    [
      i18n.language,
      setIsValid,
      setIsValid,
      shippingType,
      originInfo,
      destinationInfo,
    ]
  )

  const mutateData = useMemo(() => {
    const quoteLoads = () => {
      if (shippingType?.shipmentType === ShipmentType.LCL) {
        return calculationOption === CalculationOption.UnitType
          ? lclUnitForm?.unit.map(el => ({
              ...el,
              calculationOption,
            }))
          : [{ ...lclShipmentForm, calculationOption }]
      } else {
        return fclFormInfo?.unit
      }
    }

    if (!goodsInfo?.file) {
      delete goodsInfo?.file
    }

    return {
      isKnownSupplier: originInfo?.isKnownSupplier,
      shippingType,
      destination: destinationInfo && {
        ...destinationInfo,
        city: destinationInfo.city ? destinationInfo.city : undefined,
        state: destinationState,
        portName: portOfDestination,
      },
      origin: originInfo && {
        ...originInfo,
        city: originInfo.city ? originInfo.city : undefined,
        state: originState,
        portName,
      },
      quoteGood: goodsInfo,
      quoteLoads: quoteLoads(),
    }
  }, [
    shippingType,
    originInfo,
    destinationInfo,
    lclUnitForm,
    lclShipmentForm,
    fclFormInfo,
    goodsInfo,
    calculationOption,
  ])

  return { specificBlocks, mutateData }
}

export default useConfig
