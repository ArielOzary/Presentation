import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { MergeShipmentsCommand } from 'models'

import { api } from 'utils/api'

export const shipmentsMerge = async (
  dto: MergeShipmentsCommand
): Promise<string> => {
  const { data } = await api.put('shipments/merge', dto)
  return data
}

export const useShipmentsMerge = () => {
  return useMutation<string, AxiosError, MergeShipmentsCommand>(shipmentsMerge)
}
