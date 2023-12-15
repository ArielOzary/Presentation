import { create } from 'zustand'

import { GoodsSchemaType } from 'containers/Client/SearchQuote/Specifications/Steps/Goods/hooks/goodsForm'
import { FCLSchemaType } from 'containers/Client/SearchQuote/Specifications/Steps/Load/LoadFCL/hooks/fclFormSchema'
import { LCLShipmentSchemaType } from 'containers/Client/SearchQuote/Specifications/Steps/Load/LoadLCL/LCLShipmentForm/hooks/lclShipmentSchema'
import { LCLSchemaType } from 'containers/Client/SearchQuote/Specifications/Steps/Load/LoadLCL/LCLUnitsForm/hook/lclFormSchema'
import { ShippingTypeSchemaType } from 'containers/Client/SearchQuote/Specifications/Steps/ShippingType/hooks/shippingTypeForm'

import {
  AvailableQuotesListDto,
  AvailableQuotesSortOption,
  CalculationOption,
  CurrencyType,
  QuoteDto,
  ShippingLocationDto,
  ShippingLocationPostDto,
} from 'models'

interface SearchQuoteStore {
  shippingType: ShippingTypeSchemaType | undefined
  originInfo: ShippingLocationPostDto
  portName: string
  originState: string
  destinationState: string
  destinationInfo: ShippingLocationDto
  portOfDestination: string
  calculationOption: CalculationOption
  lclUnitForm: LCLSchemaType | undefined
  lclShipmentForm: LCLShipmentSchemaType | undefined
  fclFormInfo: FCLSchemaType | undefined
  goodsInfo: GoodsSchemaType | undefined
  completed: boolean
  availableList: AvailableQuotesListDto | undefined
  currency: CurrencyType
  sortingFilter: AvailableQuotesSortOption
  sortQuotes: string
  sortDescending: boolean
  isChanging: boolean
  isSuccess: boolean
  selectedQuote: QuoteDto
  isDisabled: boolean
  requestedCustomQuote: boolean
  setShippingType: (shippingType: ShippingTypeSchemaType) => void
  setOriginInfo: (originInfo: ShippingLocationPostDto) => void
  setPortName: (portName: string) => void
  setOriginState: (originState: string) => void
  setDestinationState: (destinationState: string) => void
  setDestinationInfo: (destinationInfo: ShippingLocationDto) => void
  setPortOfDestination: (portOfDestination: string) => void
  setLclUnitForm: (lclUnitForm: LCLSchemaType) => void
  setLclShipmentForm: (lclShipmentForm: LCLShipmentSchemaType) => void
  setFclFormInfo: (fclForm: FCLSchemaType) => void
  setGoodsInfo: (goodsInfo: GoodsSchemaType) => void
  setCompleted: (completed: boolean) => void
  setAvailableList: (availableList: AvailableQuotesListDto) => void
  setCurrency: (currency: CurrencyType) => void
  setSortingFilter: () => void
  setSortQuotes: (sortQuotes: string) => void
  setSortDescending: () => void
  setIsChanging: (isChanging: boolean) => void
  setSuccess: (isSuccess: boolean) => void
  setSelectedQuote: (selectedQuote: QuoteDto) => void
  setDisabled: (isDisabled: boolean) => void
  setCalculationOption: (calculationOption: CalculationOption) => void
  setRequestedCustomQuote: (requestedCustomQuote: boolean) => void
  setDefault: () => void
}

export const useSearchQuoteStore = create<SearchQuoteStore>(set => ({
  shippingType: undefined,
  originInfo: {},
  portName: '',
  portOfDestination: '',
  originState: '',
  destinationState: '',
  destinationInfo: {},
  calculationOption: CalculationOption.UnitType,
  lclUnitForm: undefined,
  lclShipmentForm: undefined,
  fclFormInfo: undefined,
  goodsInfo: undefined,
  completed: false,
  availableList: undefined,
  currency: CurrencyType.USD,
  sortingFilter: AvailableQuotesSortOption.LastModified,
  sortQuotes: 'lastUpdated',
  sortDescending: true,
  isChanging: false,
  isSuccess: false,
  selectedQuote: {},
  isDisabled: true,
  requestedCustomQuote: false,
  setShippingType: (shippingType: ShippingTypeSchemaType) => {
    set(() => ({ shippingType }))
  },
  setSuccess: (isSuccess: boolean) => {
    set(() => ({ isSuccess }))
  },
  setOriginInfo: (originInfo: ShippingLocationPostDto) => {
    set(() => ({ originInfo }))
  },
  setPortName: (portName: string) => {
    set(() => ({ portName }))
  },
  setPortOfDestination: (portOfDestination: string) => {
    set(() => ({ portOfDestination }))
  },
  setOriginState: (originState: string) => {
    set(() => ({ originState }))
  },
  setDestinationState: (destinationState: string) => {
    set(() => ({ destinationState }))
  },
  setDestinationInfo: (destinationInfo: ShippingLocationDto) => {
    set(() => ({ destinationInfo }))
  },
  setLclUnitForm: (lclUnitForm: LCLSchemaType) => {
    set(() => ({ lclUnitForm }))
  },
  setLclShipmentForm: (lclShipmentForm: LCLShipmentSchemaType) => {
    set(() => ({ lclShipmentForm }))
  },
  setFclFormInfo: (fclFormInfo: FCLSchemaType) => {
    set(() => ({ fclFormInfo }))
  },
  setGoodsInfo: (goodsInfo: GoodsSchemaType) => {
    set(() => ({ goodsInfo }))
  },
  setCompleted: (completed: boolean) => {
    set(() => ({ completed }))
  },
  setAvailableList: (availableList: AvailableQuotesListDto) => {
    set({ availableList })
  },
  setCurrency: (currency: CurrencyType) => {
    set({ currency })
  },
  setSortingFilter: () => {
    set(state => ({
      sortingFilter:
        state.sortQuotes === 'lastUpdated'
          ? AvailableQuotesSortOption.LastModified
          : AvailableQuotesSortOption.Price,
    }))
  },
  setSortQuotes: (sortQuotes: string) => {
    set({ sortQuotes })
  },
  setSortDescending: () =>
    set(state => ({
      sortDescending: state.sortQuotes === 'lowPrice' ? false : true,
    })),

  setIsChanging: (isChanging: boolean) => {
    set({ isChanging })
  },
  setSelectedQuote: (selectedQuote: QuoteDto) => {
    set({ selectedQuote })
  },
  setDisabled: (isDisabled: boolean) => {
    set({ isDisabled })
  },
  setCalculationOption: (calculationOption: CalculationOption) => {
    set({ calculationOption })
  },
  setRequestedCustomQuote: (requestedCustomQuote: boolean) =>
    set({ requestedCustomQuote }),
  setDefault: () => {
    set({
      shippingType: undefined,
      originInfo: {},
      portName: '',
      destinationInfo: {},
      portOfDestination: '',
      calculationOption: CalculationOption.UnitType,
      lclUnitForm: undefined,
      lclShipmentForm: undefined,
      fclFormInfo: undefined,
      goodsInfo: undefined,
      completed: false,
      availableList: undefined,
      currency: CurrencyType.USD,
      sortQuotes: 'lastUpdated',
      sortDescending: true,
      isChanging: false,
      isSuccess: false,
      selectedQuote: {},
      isDisabled: true,
      requestedCustomQuote: false,
    })
  },
}))
