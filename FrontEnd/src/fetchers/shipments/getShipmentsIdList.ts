import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PaginatedListOfString } from 'models'

import { api } from 'utils/api'

interface ShipmentIdsDto {
  PageNumber: number
  PageSize: number
}

export const getShipmentIdsList = async (
  dto: ShipmentIdsDto
): Promise<PaginatedListOfString> => {
  const { data } = await api.get('shipments/ids', { params: dto })
  return data
}

export const useGetShipmentIdsList = (dto: ShipmentIdsDto) => {
  return useQuery<PaginatedListOfString, AxiosError>(
    ['SHIPMENTS_IDS', ...Object.values(dto)],
    getShipmentIdsList.bind(null, dto)
  )
}
