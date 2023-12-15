import { useCallback, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { usePostRate, usePostRateOwn, usePutRate } from 'fetchers'
import { CreateRateCommand, Rate, RateCharges } from 'models'
import { useRateStore } from 'stores/rate'

import { useRole } from 'utils/hooks/roleHook'
import { convertFromUniqueCollection } from 'utils/uniqueCollection'

export const useSaveRate = (id?: string) => {
  const navigate = useNavigate()
  const { setDefaultState } = useRateStore(
    ({ setDefaultState }) => ({ setDefaultState }),
    shallow
  )
  const { freightForwarder } = useRole()

  const {
    mutate: create,
    error: creationError,
    isError: isCreationError,
    isLoading: isCreationLoading,
  } = usePostRate()
  const {
    mutate: createOwn,
    error: creationOwnError,
    isError: isCreationOwnError,
    isLoading: isCreationOwnLoading,
  } = usePostRateOwn()
  const {
    mutate: update,
    error: updateError,
    isError: isUpdateError,
    isLoading: isUpdateLoading,
  } = usePutRate()

  const stringifyTables = useCallback(
    (
      charges: RateCharges
    ): NonNullable<CreateRateCommand['freightCharges']> => ({
      fixedPriced: JSON.stringify({
        ...charges.fixedPriced,
        items: convertFromUniqueCollection(charges.fixedPriced?.items || []),
      }),
      perType: JSON.stringify(
        convertFromUniqueCollection(charges.perType || [])
      ),
      perWeight: JSON.stringify(
        convertFromUniqueCollection(charges.perWeight || [])
      ),
      perValue: JSON.stringify(
        convertFromUniqueCollection(charges.perValue || [])
      ),
      inLand: JSON.stringify({
        ...charges.inLand,
        zones: convertFromUniqueCollection(charges.inLand?.zones || []),
        prices: convertFromUniqueCollection(charges.inLand?.prices || []),
        rules: convertFromUniqueCollection(charges.inLand?.rules || []),
      }),
      airFreight: JSON.stringify({
        ...charges.airFreight,
        items: convertFromUniqueCollection(charges.airFreight?.items || []),
        prices: convertFromUniqueCollection(charges.airFreight?.prices || []),
        rules: convertFromUniqueCollection(charges.airFreight?.rules || []),
      }),
      oceanFreightFcl: JSON.stringify({
        ...charges.oceanFreightFCL,
        items: convertFromUniqueCollection(
          charges.oceanFreightFCL?.items || []
        ),
        overweight: convertFromUniqueCollection(
          charges.oceanFreightFCL?.overweight || []
        ),
      }),
      oceanFreightLcl: JSON.stringify({
        ...charges.oceanFreightLCL,
        items: convertFromUniqueCollection(
          charges.oceanFreightLCL?.items || []
        ),
      }),
    }),
    []
  )

  const handleSuccess = useCallback(() => {
    navigate(id ? `/rates/${id}` : '/rates')
    setDefaultState()
  }, [id])

  const createRate = useCallback(
    (isDraft: boolean) => {
      const { rate } = useRateStore.getState()

      if (rate.name && rate.startDate && rate.endDate && rate.shippingType) {
        const newRate = {
          ...(rate as Required<Rate>),
          isDraft,
          name: rate.name,
          freightCharges: stringifyTables(rate.freightCharges || {}),
          originCharges: stringifyTables(rate.originCharges || {}),
          destinationCharges: stringifyTables(rate.destinationCharges || {}),
        }

        if (freightForwarder) {
          createOwn(newRate, { onSuccess: handleSuccess })
        } else {
          create(newRate, { onSuccess: handleSuccess })
        }
      }
    },
    [freightForwarder]
  )

  const updateRate = useCallback((id: number, isDraft: boolean) => {
    const { rate } = useRateStore.getState()

    if (rate.name && rate.startDate && rate.endDate && rate.shippingType) {
      update(
        {
          id,
          dto: {
            ...(rate as Required<Rate>),
            isDraft,
            name: rate.name,
            freightCharges: stringifyTables(rate.freightCharges || {}),
            originCharges: stringifyTables(rate.originCharges || {}),
            destinationCharges: stringifyTables(rate.destinationCharges || {}),
          },
        },
        { onSuccess: handleSuccess }
      )
    }
  }, [])

  const saveRate = useCallback(
    (isDraft = false) => {
      if (id) {
        updateRate(Number(id), isDraft)
      } else {
        createRate(isDraft)
      }
    },
    [id]
  )

  const error = useMemo(
    () => creationError || creationOwnError || updateError,
    [creationError, creationOwnError, updateError]
  )
  const isError = useMemo(
    () => isCreationError || isCreationOwnError || isUpdateError,
    [isCreationError, isCreationOwnError, isUpdateError]
  )
  const isLoading = useMemo(
    () => isCreationLoading || isCreationOwnLoading || isUpdateLoading,
    [isCreationLoading, isCreationOwnLoading, isUpdateLoading]
  )

  return { saveRate, error, isError, isLoading }
}
