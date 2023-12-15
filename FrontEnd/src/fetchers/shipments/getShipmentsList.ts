import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { GetShipmentsQuery, PaginatedListOfShipmentListDto } from 'models'

import { api } from 'utils/api'

export const getShipmentsList = async (
  dto: GetShipmentsQuery
): Promise<PaginatedListOfShipmentListDto> => {
  const { data } = await api.post('shipments/list', dto)

  return data
}

export const useGetShipmentsList = (
  dto: GetShipmentsQuery,
  options?: UseQueryOptions<PaginatedListOfShipmentListDto, AxiosError>
) => {
  return useQuery<PaginatedListOfShipmentListDto, AxiosError>(
    ['SHIPMENTS_LIST', ...Object.values(dto)],
    getShipmentsList.bind(null, dto),
    options
  )
}
