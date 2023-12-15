import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { GetShipmentsForMapQuery, ShipmentMapDto } from 'models'

import { api } from 'utils/api'

export const getShipmentsMapList = async (
  dto: GetShipmentsForMapQuery
): Promise<ShipmentMapDto[]> => {
  const { data } = await api.post('shipments/map-list', dto)

  return data
}

export const useGetShipmentsMapList = (
  dto: GetShipmentsForMapQuery,
  options?: UseQueryOptions<ShipmentMapDto[], AxiosError>
) => {
  return useQuery<ShipmentMapDto[], AxiosError>(
    ['FETCH_SHIPMENT_MAP_LIST', ...Object.values(dto)],
    getShipmentsMapList.bind(null, dto),
    options
  )
}
