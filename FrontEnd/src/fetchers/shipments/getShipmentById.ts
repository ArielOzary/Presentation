import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ShipmentDetailDto } from 'models'

import { api } from 'utils/api'

export const getShipmentById = async (
  id: string
): Promise<ShipmentDetailDto> => {
  const { data } = await api.get(`shipments/${id}`)

  return data
}

export const useGetShipmentById = (
  id: string,
  options?: UseQueryOptions<ShipmentDetailDto, AxiosError>
) => {
  return useQuery<ShipmentDetailDto, AxiosError>(
    ['SHIPMENT_BY_ID', id],
    getShipmentById.bind(null, id),
    options
  )
}
