import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ShipmentTrackingRoot } from 'models'

import { api } from 'utils/api'

export const getTrackContainer = async (
  ContainerNumber: string
): Promise<ShipmentTrackingRoot> => {
  const { data } = await api.get('track/container', { params: ContainerNumber })
  return data
}

export const useGetTrackContainer = (
  ContainerNumber: string,
  options?: UseQueryOptions<ShipmentTrackingRoot, AxiosError>
) => {
  return useQuery<ShipmentTrackingRoot, AxiosError>(
    ['TRACK_CONTAINER', ContainerNumber],
    getTrackContainer.bind(null, ContainerNumber),
    options
  )
}
