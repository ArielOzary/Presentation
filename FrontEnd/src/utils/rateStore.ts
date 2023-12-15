import { cloneDeep } from 'lodash'

import {
  AirFreightItem,
  AirFreightPriceItem,
  ArrayElement,
  CreateRateCommand,
  InLandPriceItem,
  InLandZoneItem,
  Rate,
  RateCharges,
  RateChargesType,
  RateSteps,
  RuleItem,
  TableType,
} from 'models'

export interface RateState {
  step: RateSteps
  fullFilled: boolean
  rate: Rate
  setStep: (step: RateSteps) => void
  setFullFilled: (fullFilled: boolean) => void
  setRateShipmentType: (
    shippingType: Partial<CreateRateCommand['shippingType']>
  ) => void

  // rule tables
  addRateRuleItem: (
    chargesType: RateChargesType,
    tableType: Extract<TableType, 'airFreight' | 'inLand'>
  ) => void
  removeRateRuleItem: (
    chargesType: RateChargesType,
    tableType: Extract<TableType, 'airFreight' | 'inLand'>,
    index: number
  ) => void
  setRateRuleItemValue: <P extends keyof RuleItem>(
    chargesType: RateChargesType,
    tableType: Extract<TableType, 'airFreight' | 'inLand'>,
    index: number,
    prop: keyof RuleItem,
    value: RuleItem[P]
  ) => void

  // air freight tables
  addRateAirFreightItem: (chargesType: RateChargesType) => void
  removeRateAirFreightItem: (
    chargesType: RateChargesType,
    index: number
  ) => void
  setRateAirFreightItemValue: <P extends keyof AirFreightItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof AirFreightItem,
    value: AirFreightItem[P]
  ) => void
  addRateAirFreightPriceItem: (chargesType: RateChargesType) => void
  removeRateAirFreightPriceItem: (
    chargesType: RateChargesType,
    index: number
  ) => void
  setRateAirFreightPriceItemValue: <P extends keyof AirFreightPriceItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof AirFreightPriceItem,
    value: AirFreightPriceItem[P]
  ) => void
  setRateAirFreightPriceItemValues: (
    chargesType: RateChargesType,
    priceIndex: number,
    itemIndex: number,
    value: number
  ) => void

  // in land tables
  addRateInLandZoneItem: (chargesType: RateChargesType) => void
  removeRateInLandZoneItem: (
    chargesType: RateChargesType,
    index: number
  ) => void
  setRateInLandZoneItemValue: <P extends keyof InLandZoneItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof InLandZoneItem,
    value: InLandZoneItem[P]
  ) => void
  addRateInLandPriceItem: (chargesType: RateChargesType) => void
  removeRateInLandPriceItem: (
    chargesType: RateChargesType,
    index: number
  ) => void
  setRateInLandPriceItemValue: <P extends keyof InLandPriceItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof InLandPriceItem,
    value: InLandPriceItem[P]
  ) => void
  setRateInLandPriceItemValues: (
    chargesType: RateChargesType,
    priceIndex: number,
    itemIndex: number,
    value: number
  ) => void

  // rate
  setRateTableValue: <
    C extends RateChargesType,
    T extends TableType,
    P extends keyof NonNullable<RateCharges[T]>,
    V extends NonNullable<RateCharges[T]>[P]
  >(
    chargesType: C,
    tableType: T,
    prop: P,
    value: V
  ) => void
  setRateValue: <
    P extends Exclude<keyof Rate, RateChargesType>,
    V extends Rate[P]
  >(
    prop: P,
    value: V
  ) => void

  // table items
  addRateTableItem: <
    C extends RateChargesType,
    T extends Exclude<TableType, 'perWeight' | 'perType' | 'perValue'>,
    P extends keyof NonNullable<RateCharges[T]>,
    V extends ArrayElement<NonNullable<RateCharges[T]>[P]>
  >(
    chargesType: C,
    tableType: T,
    prop: P,
    value: V
  ) => void
  addRateTableRootItem: <
    C extends RateChargesType,
    T extends Extract<TableType, 'perWeight' | 'perType' | 'perValue'>,
    V extends ArrayElement<NonNullable<RateCharges[T]>>
  >(
    chargesType: C,
    tableType: T,
    value: V
  ) => void
  removeRateTableItem: <
    C extends RateChargesType,
    T extends Exclude<TableType, 'perWeight' | 'perType' | 'perValue'>,
    P extends keyof NonNullable<RateCharges[T]>
  >(
    chargesType: C,
    tableType: T,
    prop: P,
    index: number
  ) => void
  removeRateTableRootItem: <
    C extends RateChargesType,
    T extends Extract<TableType, 'perWeight' | 'perType' | 'perValue'>
  >(
    chargesType: C,
    tableType: T,
    index: number
  ) => void

  setRateTableItemValue: <
    C extends RateChargesType,
    T extends Exclude<TableType, 'perWeight' | 'perType' | 'perValue'>,
    I extends keyof NonNullable<RateCharges[T]>,
    P extends keyof ArrayElement<NonNullable<RateCharges[T]>[I]>,
    V extends ArrayElement<NonNullable<RateCharges[T]>[I]>[P]
  >(
    chargesType: C,
    tableType: T,
    item: I,
    prop: P,
    index: number,
    value: V
  ) => void

  setRateTableRootItemValue: <
    C extends RateChargesType,
    T extends Extract<TableType, 'perWeight' | 'perType' | 'perValue'>,
    P extends keyof ArrayElement<NonNullable<RateCharges[T]>>,
    V extends ArrayElement<NonNullable<RateCharges[T]>>[P]
  >(
    chargesType: C,
    tableType: T,
    prop: P,
    index: number,
    value: V
  ) => void

  setDefaultState: () => void
  setState: (rate: Pick<RateState, 'step' | 'fullFilled' | 'rate'>) => void
}

export const cloneRateCharges = (
  state: RateState,
  chargesType: RateChargesType
) => {
  const newState = cloneDeep(state)

  const { rate } = newState
  const charges = rate[chargesType]

  return { newState, rate, charges }
}
