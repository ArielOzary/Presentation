import { uniqueId } from 'lodash'
// skipcq: JS-C1003
import * as _ from 'lodash'
import { create } from 'zustand'

import {
  AirFreightItem,
  AirFreightPriceItem,
  ArrayElement,
  CalculationOption,
  CreateRateCommand,
  CurrencyType,
  DimensionsFormat,
  InLandPriceItem,
  InLandZoneItem,
  Rate,
  RateCharges,
  RateChargesType,
  RateRule,
  RateSteps,
  RuleItem,
  ShipmentIncoterms,
  ShipmentOption,
  ShipmentType,
  TableType,
  WeightFormat,
  ZoneType,
} from 'models'

import { RateState, cloneRateCharges } from 'utils/rateStore'

const getDefaultRateCharges = (): RateCharges => ({
  fixedPriced: {
    items: [],
    currency: CurrencyType.USD,
  },
  perWeight: [],
  perType: [],
  perValue: [],
  airFreight: {
    items: [],
    prices: [
      {
        key: uniqueId(),
        limit: 0,
        weightFormat: WeightFormat.KG,
        values: [],
      },
    ],
    rules: [],
    weightFormat: WeightFormat.KG,
    volume: 1,
  },
  inLand: {
    zones: [],
    prices: [
      {
        key: uniqueId(),
        limit: 0,
        values: [],
      },
    ],
    rules: [],
    weightFormat: WeightFormat.KG,
    unitType: CalculationOption.TotalShipment,
    volume: 1,
  },
  oceanFreightLCL: {
    items: [],
    weightFormat: WeightFormat.KG,
    volume: 1,
  },
  oceanFreightFCL: {
    items: [],
    overweight: [],
  },
})

const getDefaultRate = (): Rate => ({
  name: '',
  remarks: '',
  shippingType: {
    shipmentType: ShipmentType.LCL,
    shipmentIncoterms: ShipmentIncoterms.EXW,
    shipmentOption: ShipmentOption.Ocean,
    insurance: false,
    customs: false,
  },
  originCharges: getDefaultRateCharges(),
  freightCharges: getDefaultRateCharges(),
  destinationCharges: getDefaultRateCharges(),
})

export const useRateStore = create<RateState>(set => ({
  step: RateSteps.NAME,
  fullFilled: false,
  rate: getDefaultRate(),
  setStep: (step: RateSteps) => {
    set(() => ({ step }))
  },
  setFullFilled(fullFilled: boolean) {
    set(() => ({ fullFilled }))
  },
  setRateTableValue<
    C extends RateChargesType,
    T extends TableType,
    P extends keyof NonNullable<RateCharges[T]>,
    V extends NonNullable<RateCharges[T]>[P]
  >(chargesType: C, tableType: T, prop: P, value: V) {
    set(state => {
      const newState = _.cloneDeep(state)

      if (newState) {
        _.set(newState, ['rate', chargesType, tableType, prop], value)
      }

      return newState
    })
  },
  setRateValue<
    P extends Exclude<keyof Rate, RateChargesType>,
    V extends Rate[P]
  >(prop: P, value: V) {
    set(state => {
      const newState = _.cloneDeep(state)

      _.set(newState, ['rate', prop], value)

      return newState
    })
  },

  setRateShipmentType(
    shippingType: Partial<CreateRateCommand['shippingType']>
  ) {
    set(state => ({
      rate: {
        ...state.rate,
        shippingType: { ...state.rate.shippingType, ...shippingType },
      },
    }))
  },

  // rule tables
  addRateRuleItem(
    chargesType: RateChargesType,
    tableType: Extract<TableType, 'airFreight' | 'inLand'>
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.[tableType]) {
        const rules = [
          RateRule.MaxHeightPerPallette,
          RateRule.MaxHeightPerShipment,
          RateRule.MaxWeightPerPallette,
          RateRule.MaxWeightPerShipment,
        ]
        const usedRules = charges[tableType]?.rules.map(item => item.rule) || []
        const allowedRules = _.difference(rules, usedRules)
        const rule =
          allowedRules.length > 0
            ? allowedRules[0]
            : RateRule.MaxHeightPerPallette

        charges[tableType]?.rules.push({
          key: uniqueId(),
          rule,
          dimensionFormat: DimensionsFormat.Cm,
          weightFormat: WeightFormat.KG,
          value: 0,
        })
      }

      return newState
    })
  },
  removeRateRuleItem(
    chargesType: RateChargesType,
    tableType: Extract<TableType, 'airFreight' | 'inLand'>,
    index: number
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.[tableType]) {
        charges[tableType]?.rules.splice(index, 1)
      }

      return newState
    })
  },
  setRateRuleItemValue<P extends keyof RuleItem>(
    chargesType: RateChargesType,
    tableType: Extract<TableType, 'airFreight' | 'inLand'>,
    index: number,
    prop: keyof RuleItem,
    value: RuleItem[P]
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      const rules = charges?.[tableType]?.rules
      if (charges && rules) {
        ;(rules[index][prop] as RuleItem[P]) = value
      }

      return newState
    })
  },

  // air freight tables
  addRateAirFreightItem(chargesType: RateChargesType) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.airFreight) {
        charges.airFreight.items.push({
          key: uniqueId(),
          POD: '',
          POL: '',
          POLCountry: '',
          PODCountry: '',
          currency: CurrencyType.USD,
          transitionTime: 0,
        })

        for (const price of charges.airFreight.prices) {
          price.values.push(0)
        }
      }

      return newState
    })
  },
  removeRateAirFreightItem(chargesType: RateChargesType, index: number) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.airFreight) {
        charges.airFreight.items.splice(index, 1)

        for (const price of charges.airFreight.prices) {
          price.values.splice(index, 1)
        }
      }

      return newState
    })
  },
  setRateAirFreightItemValue<P extends keyof AirFreightItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof AirFreightItem,
    value: AirFreightItem[P]
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.airFreight) {
        ;(charges.airFreight.items[index][prop] as AirFreightItem[P]) = value
      }

      return newState
    })
  },
  addRateAirFreightPriceItem(chargesType: RateChargesType) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.airFreight) {
        charges.airFreight.prices.push({
          key: uniqueId(),
          limit: 0,
          weightFormat: WeightFormat.KG,
          values: Array.from(
            { length: charges.airFreight.items.length },
            () => 0
          ),
        })
      }

      return newState
    })
  },
  removeRateAirFreightPriceItem(chargesType: RateChargesType, index: number) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.airFreight) {
        charges.airFreight.prices.splice(index, 1)
      }

      return newState
    })
  },
  setRateAirFreightPriceItemValue<P extends keyof AirFreightPriceItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof AirFreightPriceItem,
    value: AirFreightPriceItem[P]
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.airFreight) {
        ;(charges.airFreight.prices[index][prop] as AirFreightPriceItem[P]) =
          value
      }

      return newState
    })
  },
  setRateAirFreightPriceItemValues(
    chargesType: RateChargesType,
    priceIndex: number,
    itemIndex: number,
    value: number
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.airFreight) {
        charges.airFreight.prices[priceIndex].values[itemIndex] = value
      }

      return newState
    })
  },

  // in land tables
  addRateInLandZoneItem(chargesType: RateChargesType) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.inLand) {
        charges.inLand.zones.push({
          key: uniqueId(),
          zoneName: '',
          zoneType: ZoneType.Country,
          zipRangeFrom: 0,
          zipRangeTo: 0,
          transitionTime: 0,
        })

        for (const price of charges.inLand.prices) {
          price.values.push(0)
        }
      }

      return newState
    })
  },
  removeRateInLandZoneItem(chargesType: RateChargesType, index: number) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.inLand) {
        charges.inLand.zones.splice(index, 1)

        for (const price of charges.inLand.prices) {
          price.values.splice(index, 1)
        }
      }

      return newState
    })
  },
  setRateInLandZoneItemValue<P extends keyof InLandZoneItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof InLandZoneItem,
    value: InLandZoneItem[P]
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.inLand) {
        ;(charges.inLand.zones[index][prop] as InLandZoneItem[P]) = value
      }

      return newState
    })
  },
  addRateInLandPriceItem(chargesType: RateChargesType) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.inLand) {
        charges.inLand.prices.push({
          key: uniqueId(),
          limit: 0,
          values: Array.from({ length: charges.inLand.zones.length }, () => 0),
        })
      }

      return newState
    })
  },
  removeRateInLandPriceItem(chargesType: RateChargesType, index: number) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.inLand) {
        charges.inLand.prices.splice(index, 1)
      }

      return newState
    })
  },
  setRateInLandPriceItemValue<P extends keyof InLandPriceItem>(
    chargesType: RateChargesType,
    index: number,
    prop: keyof InLandPriceItem,
    value: InLandPriceItem[P]
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.inLand) {
        ;(charges.inLand.prices[index][prop] as InLandPriceItem[P]) = value
      }

      return newState
    })
  },
  setRateInLandPriceItemValues(
    chargesType: RateChargesType,
    priceIndex: number,
    itemIndex: number,
    value: number
  ) {
    set(state => {
      const { newState, charges } = cloneRateCharges(state, chargesType)

      if (charges?.inLand) {
        charges.inLand.prices[priceIndex].values[itemIndex] = value
      }

      return newState
    })
  },

  // table items
  addRateTableItem<
    C extends RateChargesType,
    T extends Exclude<TableType, 'perWeight' | 'perType' | 'perValue'>,
    P extends keyof NonNullable<RateCharges[T]>,
    V extends ArrayElement<NonNullable<RateCharges[T]>[P]>
  >(chargesType: C, tableType: T, prop: P, value: V) {
    set(state => {
      const newState = _.cloneDeep(state)

      if (newState) {
        const items = _.get(
          newState,
          ['rate', chargesType, tableType, prop],
          []
        )
        _.set(
          newState,
          ['rate', chargesType, tableType, prop],
          [...items, value]
        )
      }

      return newState
    })
  },
  addRateTableRootItem<
    C extends RateChargesType,
    T extends Extract<TableType, 'perWeight' | 'perType' | 'perValue'>,
    V extends ArrayElement<NonNullable<RateCharges[T]>>
  >(chargesType: C, tableType: T, value: V) {
    set(state => {
      const newState = _.cloneDeep(state)

      if (newState) {
        const items = _.get(newState, ['rate', chargesType, tableType], [])
        _.set(newState, ['rate', chargesType, tableType], [...items, value])
      }

      return newState
    })
  },
  removeRateTableItem<
    C extends RateChargesType,
    T extends Exclude<TableType, 'perWeight' | 'perType' | 'perValue'>,
    P extends keyof NonNullable<RateCharges[T]>
  >(chargesType: C, tableType: T, prop: P, index: number) {
    set(state => {
      const newState = _.cloneDeep(state)

      if (newState) {
        const items = _.get(
          newState,
          ['rate', chargesType, tableType, prop],
          []
        )
        items.splice(index, 1)
        _.set(newState, ['rate', chargesType, tableType, prop], items)
      }

      return newState
    })
  },
  removeRateTableRootItem<
    C extends RateChargesType,
    T extends Extract<TableType, 'perWeight' | 'perType' | 'perValue'>
  >(chargesType: C, tableType: T, index: number) {
    set(state => {
      const newState = _.cloneDeep(state)

      if (newState) {
        const items = _.get(newState, ['rate', chargesType, tableType], [])
        items.splice(index, 1)
        _.set(newState, ['rate', chargesType, tableType], items)
      }

      return newState
    })
  },

  setRateTableItemValue<
    C extends RateChargesType,
    T extends Exclude<TableType, 'perWeight' | 'perType' | 'perValue'>,
    I extends keyof NonNullable<RateCharges[T]>,
    P extends keyof ArrayElement<NonNullable<RateCharges[T]>[I]>,
    V extends ArrayElement<NonNullable<RateCharges[T]>[I]>[P]
  >(chargesType: C, tableType: T, item: I, prop: P, index: number, value: V) {
    set(state => {
      const newState = _.cloneDeep(state)

      if (newState) {
        _.set(
          newState,
          ['rate', chargesType, tableType, item, index, prop],
          value
        )
      }

      return newState
    })
  },

  setRateTableRootItemValue<
    C extends RateChargesType,
    T extends Extract<TableType, 'perWeight' | 'perType' | 'perValue'>,
    P extends keyof ArrayElement<NonNullable<RateCharges[T]>>,
    V extends ArrayElement<NonNullable<RateCharges[T]>>[P]
  >(chargesType: C, tableType: T, prop: P, index: number, value: V) {
    set(state => {
      const newState = _.cloneDeep(state)

      if (newState) {
        _.set(newState, ['rate', chargesType, tableType, index, prop], value)
      }

      return newState
    })
  },

  setDefaultState() {
    set(() => ({
      step: RateSteps.NAME,
      fullFilled: false,
      rate: getDefaultRate(),
    }))
  },

  setState(rate: Pick<RateState, 'step' | 'fullFilled' | 'rate'>) {
    set(() => rate)
  },
}))

export const generalInfoSelector = ({
  fullFilled,
  step,
  rate,
  setStep,
  setRateValue,
}: RateState) => ({
  fullFilled,
  step,
  name: rate.name,
  shippingType: rate.shippingType,
  startDate: rate.startDate,
  endDate: rate.endDate,
  carrierId: rate.carrierId,
  companyId: rate.companyId,
  setStep,
  setRateValue,
})

export const fixedPriceTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    setRateTableValue,
    addRateTableItem,
    removeRateTableItem,
    setRateTableItemValue,
  }: RateState
) => ({
  fixedPrices: rate[chargesType]?.fixedPriced,
  setRateTableValue,
  addRateTableItem,
  removeRateTableItem,
  setRateTableItemValue,
})

export const perWeightTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    addRateTableRootItem,
    removeRateTableRootItem,
    setRateTableRootItemValue,
  }: RateState
) => ({
  perWeight: rate[chargesType]?.perWeight,
  addRateTableRootItem,
  removeRateTableRootItem,
  setRateTableRootItemValue,
})

export const perTypeTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    addRateTableRootItem,
    removeRateTableRootItem,
    setRateTableRootItemValue,
  }: RateState
) => ({
  perType: rate[chargesType]?.perType,
  addRateTableRootItem,
  removeRateTableRootItem,
  setRateTableRootItemValue,
})

export const perValueTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    addRateTableRootItem,
    removeRateTableRootItem,
    setRateTableRootItemValue,
  }: RateState
) => ({
  shippingType: rate.shippingType,
  perValue: rate[chargesType]?.perValue,
  addRateTableRootItem,
  removeRateTableRootItem,
  setRateTableRootItemValue,
})

export const airFreightTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    setRateTableValue,
    addRateAirFreightItem,
    removeRateAirFreightItem,
    setRateAirFreightItemValue,
    addRateAirFreightPriceItem,
    removeRateAirFreightPriceItem,
    setRateAirFreightPriceItemValue,
    setRateAirFreightPriceItemValues,
    addRateRuleItem,
    removeRateRuleItem,
    setRateRuleItemValue,
  }: RateState
) => ({
  airFreight: rate[chargesType]?.airFreight,
  setRateTableValue,
  addRateAirFreightItem,
  removeRateAirFreightItem,
  setRateAirFreightItemValue,
  addRateAirFreightPriceItem,
  removeRateAirFreightPriceItem,
  setRateAirFreightPriceItemValue,
  setRateAirFreightPriceItemValues,
  addRateRuleItem,
  removeRateRuleItem,
  setRateRuleItemValue,
})

export const inLandTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    setRateTableValue,
    addRateInLandZoneItem,
    removeRateInLandZoneItem,
    setRateInLandZoneItemValue,
    addRateInLandPriceItem,
    removeRateInLandPriceItem,
    setRateInLandPriceItemValue,
    setRateInLandPriceItemValues,
    addRateRuleItem,
    removeRateRuleItem,
    setRateRuleItemValue,
  }: RateState
) => ({
  inLand: rate[chargesType]?.inLand,
  setRateTableValue,
  addRateInLandZoneItem,
  removeRateInLandZoneItem,
  setRateInLandZoneItemValue,
  addRateInLandPriceItem,
  removeRateInLandPriceItem,
  setRateInLandPriceItemValue,
  setRateInLandPriceItemValues,
  addRateRuleItem,
  removeRateRuleItem,
  setRateRuleItemValue,
})

export const oceanFreightLCLTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    setRateTableValue,
    addRateTableItem,
    removeRateTableItem,
    setRateTableItemValue,
  }: RateState
) => ({
  oceanFreightLCL: rate[chargesType]?.oceanFreightLCL,
  setRateTableValue,
  addRateTableItem,
  removeRateTableItem,
  setRateTableItemValue,
})

export const oceanFreightFCLTableSelector = (
  chargesType: RateChargesType,
  {
    rate,
    setRateTableValue,
    addRateTableItem,
    removeRateTableItem,
    setRateTableItemValue,
  }: RateState
) => ({
  oceanFreightFCL: rate[chargesType]?.oceanFreightFCL,
  setRateTableValue,
  addRateTableItem,
  removeRateTableItem,
  setRateTableItemValue,
})
