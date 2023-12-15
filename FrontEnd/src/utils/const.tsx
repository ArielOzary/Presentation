import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import {
  CalculationOption,
  ContainerType,
  CurrencyType,
  DimensionsFormat,
  PerValueShipmentType,
  RateRule,
  ShipmentOption,
  ShipmentStatusStage,
  ShipmentType,
  VolumeFormat,
  WeightFormat,
  ZoneType,
} from 'models'

export const currencyOptions = [
  { key: CurrencyType.USD, value: CurrencyType.USD, label: 'USD' },
  { key: CurrencyType.NIS, value: CurrencyType.NIS, label: 'ILS' },
  { key: CurrencyType.EUR, value: CurrencyType.EUR, label: 'EUR' },
]

export const currencySymbol = {
  [CurrencyType.USD]: '$',
  [CurrencyType.NIS]: '₪',
  [CurrencyType.EUR]: '€',
}

export const currencyAbbr = {
  [CurrencyType.USD]: 'USD',
  [CurrencyType.NIS]: 'ILS',
  [CurrencyType.EUR]: 'EUR',
}

export const weightFormatOptions = [
  { key: WeightFormat.KG, value: WeightFormat.KG, label: 'KG' },
  { key: WeightFormat.TON, value: WeightFormat.TON, label: 'TON' },
  { key: WeightFormat.Lbs, value: WeightFormat.Lbs, label: 'Lbs' },
]

export const weightFormatAbbr = {
  [WeightFormat.KG]: 'KG',
  [WeightFormat.TON]: 'TON',
  [WeightFormat.Lbs]: 'Lbs',
}

export const dimensionFormatOptions = [
  { key: DimensionsFormat.Cm, value: DimensionsFormat.Cm, label: 'Cm' },
  {
    key: DimensionsFormat.Feet,
    value: DimensionsFormat.Feet,
    label: 'Feet',
  },
  {
    key: DimensionsFormat.Inch,
    value: DimensionsFormat.Inch,
    label: 'Inch',
  },
  {
    key: DimensionsFormat.Meters,
    value: DimensionsFormat.Meters,
    label: 'Meters',
  },
]

export const dimensionFormatAbbr = {
  [DimensionsFormat.Cm]: 'Cm',
  [DimensionsFormat.Feet]: 'Feet',
  [DimensionsFormat.Inch]: 'Inch',
  [DimensionsFormat.Meters]: 'Meters',
}

export const containerTypeAbbr = {
  [ContainerType.CTR20]: '20´',
  [ContainerType.CTR40]: '40´',
  [ContainerType.CTR40HC]: '40´HC',
  [ContainerType.CTR45HC]: '45´HC',
}

export const containerTypes = [
  { value: ContainerType.CTR20, label: '20´' },
  { value: ContainerType.CTR40, label: '40´' },
  { value: ContainerType.CTR40HC, label: '40´HC' },
  { value: ContainerType.CTR45HC, label: '45´HC' },
]

export const fclWeightFormatOptions = [
  { key: WeightFormat.KG, value: WeightFormat.KG, label: 'KG' },
  { key: WeightFormat.TON, value: WeightFormat.TON, label: 'TON' },
]

export const volumeFormatOptions = [
  { key: VolumeFormat.CBM, value: VolumeFormat.CBM, label: 'CBM' },
]

export const useOptions = () => {
  const { t, i18n } = useTranslation([
    'global',
    'newRate',
    'shipments',
    'clientDashboard',
  ])

  const perValueShipmentTypeOptions = useMemo(
    () => [
      {
        key: PerValueShipmentType.AirFreight,
        value: PerValueShipmentType.AirFreight,
        label: t('newRate:table.airFreight'),
      },
      {
        key: PerValueShipmentType.OceanFreight,
        value: PerValueShipmentType.OceanFreight,
        label: t('newRate:table.oceanFreight'),
      },
      {
        key: PerValueShipmentType.CIFValue,
        value: PerValueShipmentType.CIFValue,
        label: t('newRate:table.cifValue'),
      },
      {
        key: PerValueShipmentType.CommodityValue,
        value: PerValueShipmentType.CommodityValue,
        label: t('newRate:table.commodityValue'),
      },
    ],
    [i18n.language]
  )

  const perValueShipmentTypeAbbr = useMemo(
    () => ({
      [PerValueShipmentType.AirFreight]: t('newRate:table.airFreight'),
      [PerValueShipmentType.OceanFreight]: t('newRate:table.oceanFreight'),
      [PerValueShipmentType.CIFValue]: t('newRate:table.cifValue'),
      [PerValueShipmentType.CommodityValue]: t('newRate:table.commodityValue'),
    }),
    [i18n.language]
  )

  const rateRuleOptions = useMemo(
    () => [
      {
        key: RateRule.MaxHeightPerPallette,
        value: RateRule.MaxHeightPerPallette,
        label: `${t('newRate:table.max')} ${t('global:height')} ${t(
          'newRate:table.per'
        )} ${t('newRate:pallette')}`,
      },
      {
        key: RateRule.MaxHeightPerShipment,
        value: RateRule.MaxHeightPerShipment,
        label: `${t('newRate:table.max')} ${t('global:height')} ${t(
          'newRate:table.per'
        )} ${t('newRate:shipment')}`,
      },
      {
        key: RateRule.MaxWeightPerPallette,
        value: RateRule.MaxWeightPerPallette,
        label: `${t('newRate:table.max')} ${t('global:weight')} ${t(
          'newRate:table.per'
        )} ${t('newRate:pallette')}`,
      },
      {
        key: RateRule.MaxWeightPerShipment,
        value: RateRule.MaxWeightPerShipment,
        label: `${t('newRate:table.max')} ${t('global:weight')} ${t(
          'newRate:table.per'
        )} ${t('newRate:shipment')}`,
      },
    ],
    [i18n.language]
  )

  const rateRuleAbbr = useMemo(
    () => ({
      [RateRule.MaxHeightPerPallette]: `${t('newRate:table.max')} ${t(
        'global:height'
      )} ${t('newRate:table.per')} ${t('newRate:pallette')}`,
      [RateRule.MaxHeightPerShipment]: `${t('newRate:table.max')} ${t(
        'global:height'
      )} ${t('newRate:table.per')} ${t('newRate:shipment')}`,
      [RateRule.MaxWeightPerPallette]: `${t('newRate:table.max')} ${t(
        'global:weight'
      )} ${t('newRate:table.per')} ${t('newRate:pallette')}`,
      [RateRule.MaxWeightPerShipment]: `${t('newRate:table.max')} ${t(
        'global:weight'
      )} ${t('newRate:table.per')} ${t('newRate:shipment')}`,
    }),
    [i18n.language]
  )

  const zoneTypeOptions = useMemo(
    () => [
      { key: ZoneType.ZIP, value: ZoneType.ZIP, label: t('newRate:zipCode') },
      { key: ZoneType.City, value: ZoneType.City, label: t('newRate:city') },
      { key: ZoneType.State, value: ZoneType.State, label: t('newRate:state') },
      {
        key: ZoneType.Country,
        value: ZoneType.Country,
        label: t('global:country'),
      },
    ],
    [i18n.language]
  )

  const zoneTypeAbbr = useMemo(
    () => ({
      [ZoneType.ZIP]: t('newRate:zipCode'),
      [ZoneType.City]: t('newRate:city'),
      [ZoneType.State]: t('newRate:state'),
      [ZoneType.Country]: t('global:country'),
    }),
    [i18n.language]
  )

  const calculationOptions = useMemo(
    () => [
      {
        key: CalculationOption.TotalShipment,
        value: CalculationOption.TotalShipment,
        label: `${t('newRate:table.per')} ${t('newRate:shipment')}`,
      },
      {
        key: CalculationOption.UnitType,
        value: CalculationOption.UnitType,
        label: `${t('newRate:table.per')} ${t('newRate:unit')}`,
      },
    ],
    [i18n.language]
  )

  const calculationOptionAbbr = useMemo(
    () => ({
      [CalculationOption.TotalShipment]: `${t('newRate:table.per')} ${t(
        'newRate:shipment'
      )}`,
      [CalculationOption.UnitType]: `${t('newRate:table.per')} ${t(
        'newRate:unit'
      )}`,
    }),
    [i18n.language]
  )

  const statusesOptions = [
    {
      label: t('shipments:statuses.open'),
      value: ShipmentStatusStage.Open,
    },
    {
      label: t('shipments:statuses.booking'),
      value: ShipmentStatusStage.Booking,
    },
    {
      label: t('shipments:statuses.estimatedTimeOfDeparture'),
      value: ShipmentStatusStage.EstimatedTimeOfDeparture,
    },
    {
      label: t('shipments:statuses.goodsAreOnBoardOrActualDeparture'),
      value: ShipmentStatusStage.GoodsAreOnBoardOrActualDeparture,
    },
    {
      label: t('shipments:statuses.estimatedTimeOfArrival'),
      value: ShipmentStatusStage.EstimatedTimeOfArrival,
    },
    {
      label: t('shipments:statuses.noticeOfArrival'),
      value: ShipmentStatusStage.NoticeOfArrival,
    },
    {
      label: t('shipments:statuses.clearance'),
      value: ShipmentStatusStage.Clearance,
    },
    {
      label: t('shipments:statuses.delivered'),
      value: ShipmentStatusStage.Delivered,
    },
    {
      label: t('shipments:statuses.delayed'),
      value: ShipmentStatusStage.Delayed,
    },
  ]

  const fclOptions = useMemo(
    () => [
      { label: t('clientDashboard:fcl'), value: ShipmentType.FCL },
      { label: t('clientDashboard:lcl'), value: ShipmentType.LCL },
    ],
    [i18n.language]
  )

  const shipmentOptions = useMemo(
    () => [
      {
        label: t('shipments:shipmentTypes.ocean'),
        value: ShipmentOption.Ocean,
      },
      { label: t('shipments:shipmentTypes.air'), value: ShipmentOption.Air },
    ],
    [i18n.language]
  )

  return {
    perValueShipmentTypeOptions,
    perValueShipmentTypeAbbr,
    rateRuleOptions,
    rateRuleAbbr,
    zoneTypeOptions,
    zoneTypeAbbr,
    calculationOptions,
    calculationOptionAbbr,
    statusesOptions,
    fclOptions,
    shipmentOptions,
  }
}
