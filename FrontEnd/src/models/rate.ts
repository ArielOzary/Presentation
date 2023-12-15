import {
  CalculationOption,
  CreateRateCommand,
  CurrencyType,
  DimensionsFormat,
  WeightFormat,
} from './api'

import { UniqueCollection } from 'utils/uniqueCollection'

export type RateChargesType =
  | 'freightCharges'
  | 'originCharges'
  | 'destinationCharges'

export type TableType = keyof RateCharges

export enum RateSteps {
  NAME = 0,
  CARRIER = 1,
  SHIPMENT_TYPE = 2,
  EXPIRATION = 3,
  CHARGES = 4,
}

export enum PerValueShipmentType {
  OceanFreight = 0,
  AirFreight = 1,
  CIFValue = 2,
  CommodityValue = 3,
}

export enum RateRule {
  MaxHeightPerPallette = 0,
  MaxHeightPerShipment = 1,
  MaxWeightPerPallette = 2,
  MaxWeightPerShipment = 3,
}

export enum ZoneType {
  ZIP = 0,
  City = 1,
  State = 2,
  Country = 3,
}

export interface FixedPriceItem {
  name: string
  price: number
  required: boolean
}

export interface PerWeightItem {
  name: string
  price: number
  weightFormat: WeightFormat
  volume: number
  currency: CurrencyType
}

export interface PerTypeItem {
  name: string
  CTR20FT: number
  CTR40FT: number
  CTR40HC: number
  CTR20OT: number
  CTR40OT: number
  CTR20RF: number
  CTR40RF: number
  currency: CurrencyType
}

export interface PerValueItem {
  name: string
  percent: number
  shipmentType: PerValueShipmentType
  currency: CurrencyType
}

export interface AirFreightItem {
  POL: string
  POD: string
  POLCountry: string
  PODCountry: string
  currency: CurrencyType
  transitionTime: number
}

export interface AirFreightPriceItem {
  limit: number
  weightFormat: WeightFormat
  values: number[]
}

export interface RuleItem {
  rule: RateRule
  dimensionFormat: DimensionsFormat
  weightFormat: WeightFormat
  value: number
}

export interface InLandZoneItem {
  zoneType: ZoneType
  zoneName: string
  zipRangeFrom: number
  zipRangeTo: number
  transitionTime: number
}

export interface InLandPriceItem {
  limit: number
  values: number[]
}

export interface OceanFreightLCLItem {
  POL: string
  POD: string
  POLCountry: string
  PODCountry: string
  weightMeasurement: number
  transitionTime: number
  currency: CurrencyType
}

export interface OceanFreightFCLItem {
  POL: string
  POD: string
  POLCountry: string
  PODCountry: string
  CTR20FT: number
  CTR40FT: number
  CTR40HC: number
  CTR20OT: number
  CTR40OT: number
  CTR20RF: number
  CTR40RF: number
  currency: CurrencyType
}

export interface OceanFreightFCLOverweightItem {
  limit: number
  CTR20FT: number
  CTR40FT: number
  CTR40HC: number
  CTR20OT: number
  CTR40OT: number
  CTR20RF: number
  CTR40RF: number
  currency: CurrencyType
}

export interface RateCharges {
  fixedPriced?: {
    items: UniqueCollection<FixedPriceItem>
    currency: CurrencyType
  }
  perWeight?: UniqueCollection<PerWeightItem>
  perType?: UniqueCollection<PerTypeItem>
  perValue?: UniqueCollection<PerValueItem>
  airFreight?: {
    items: UniqueCollection<AirFreightItem>
    prices: UniqueCollection<AirFreightPriceItem>
    rules: UniqueCollection<RuleItem>
    weightFormat: WeightFormat
    volume: number
  }
  inLand?: {
    zones: UniqueCollection<InLandZoneItem>
    prices: UniqueCollection<InLandPriceItem>
    rules: UniqueCollection<RuleItem>
    unitType: CalculationOption
    weightFormat: WeightFormat
    volume: number
  }
  oceanFreightLCL?: {
    items: UniqueCollection<OceanFreightLCLItem>
    weightFormat: WeightFormat
    volume: number
  }
  oceanFreightFCL?: {
    items: UniqueCollection<OceanFreightFCLItem>
    overweight: UniqueCollection<OceanFreightFCLOverweightItem>
  }
}

export interface Rate
  extends Partial<
    Omit<
      CreateRateCommand,
      'freightCharges' | 'originCharges' | 'destinationCharges'
    >
  > {
  freightCharges?: RateCharges
  originCharges?: RateCharges
  destinationCharges?: RateCharges
  remarks: string
}
