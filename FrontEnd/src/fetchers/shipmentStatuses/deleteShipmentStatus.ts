import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const deleteShipmentStatus = async (id: number): Promise<string> => {
  const { data } = await api.delete(`shipmentStatuses/${id}`)
  return data
}

export const useDeleteShipmentStatus = () => {
  return useMutation<string, AxiosError, number>(deleteShipmentStatus)
}
