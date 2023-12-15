import { useCallback, useEffect, useMemo } from 'react'

import { shallow } from 'zustand/shallow'

import { useGetRateById, useGetRateCharges } from 'fetchers'
import {
  CalculationOption,
  CurrencyType,
  RateCharges,
  RateChargesInfoDto,
  RateSteps,
  WeightFormat,
} from 'models'
import { useRateStore } from 'stores/rate'

import { convertToUniqueCollection } from 'utils/uniqueCollection'

export const useInitRate = (id?: string) => {
  const { setState, setDefaultState } = useRateStore(
    ({ setState, setDefaultState }) => ({
      setState,
      setDefaultState,
    }),
    shallow
  )

  const { data: rate, isLoading: isRateLoading } = useGetRateById(
    Number(id || 0),
    { enabled: Boolean(id) }
  )

  const { data: charges, isLoading: isChargesLoading } = useGetRateCharges(
    Number(id || 0),
    { enabled: Boolean(id) }
  )

  const isLoading = useMemo(
    () => Boolean(id) && (isRateLoading || isChargesLoading),
    [id, isRateLoading, isChargesLoading]
  )

  const parseTables = useCallback(
    (charges?: RateChargesInfoDto | null): RateCharges => {
      const fixedPriced: RateCharges['fixedPriced'] = JSON.parse(
        charges?.fixedPriced || '{}'
      )
      const perType: RateCharges['perType'] = JSON.parse(
        charges?.perType || '[]'
      )
      const perWeight: RateCharges['perWeight'] = JSON.parse(
        charges?.perWeight || '[]'
      )
      const perValue: RateCharges['perValue'] = JSON.parse(
        charges?.perValue || '[]'
      )
      const inLand: RateCharges['inLand'] = JSON.parse(charges?.inLand || '{}')
      const airFreight: RateCharges['airFreight'] = JSON.parse(
        charges?.airFreight || '{}'
      )
      const oceanFreightFCL: RateCharges['oceanFreightFCL'] = JSON.parse(
        charges?.oceanFreightFcl || '{}'
      )
      const oceanFreightLCL: RateCharges['oceanFreightLCL'] = JSON.parse(
        charges?.oceanFreightLcl || '{}'
      )

      return {
        fixedPriced: {
          currency: CurrencyType.USD,
          ...fixedPriced,
          items: convertToUniqueCollection(fixedPriced?.items || []),
        },
        perType: convertToUniqueCollection(perType || []),
        perWeight: convertToUniqueCollection(perWeight || []),
        perValue: convertToUniqueCollection(perValue || []),
        inLand: {
          unitType: CalculationOption.TotalShipment,
          weightFormat: WeightFormat.KG,
          volume: 0,
          ...inLand,
          zones: convertToUniqueCollection(inLand?.zones || []),
          prices: convertToUniqueCollection(inLand?.prices || []),
          rules: convertToUniqueCollection(inLand?.rules || []),
        },
        airFreight: {
          weightFormat: WeightFormat.KG,
          volume: 0,
          ...airFreight,
          items: convertToUniqueCollection(airFreight?.items || []),
          prices: convertToUniqueCollection(airFreight?.prices || []),
          rules: convertToUniqueCollection(airFreight?.rules || []),
        },
        oceanFreightFCL: {
          ...airFreight,
          items: convertToUniqueCollection(oceanFreightFCL?.items || []),
          overweight: convertToUniqueCollection(
            oceanFreightFCL?.overweight || []
          ),
        },
        oceanFreightLCL: {
          weightFormat: WeightFormat.KG,
          volume: 0,
          ...oceanFreightLCL,
          items: convertToUniqueCollection(oceanFreightLCL?.items || []),
        },
      }
    },
    []
  )

  const initRate = useCallback(() => {
    if (rate) {
      setState({
        step: RateSteps.CHARGES,
        fullFilled: true,
        rate: {
          remarks: '',
          ...rate,
          startDate: rate.startDate || undefined,
          endDate: rate.endDate || undefined,
          freightCharges: parseTables(charges?.freightCharges),
          originCharges: parseTables(charges?.originCharges),
          destinationCharges: parseTables(charges?.destinationCharges),
        },
      })
    }
  }, [rate, charges])

  useEffect(() => {
    if (!rate || !charges) {
      setDefaultState()
    } else {
      initRate()
    }

    return () => {
      setDefaultState()
    }
  }, [rate, charges, initRate])

  return { rate, charges, isLoading }
}
