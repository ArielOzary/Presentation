import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const deleteShipmentFile = async (id: string): Promise<string> => {
  const { data } = await api.delete(`shipment-files/${id}`)
  return data
}

export const useDeleteShipmentFile = () => {
  return useMutation<string, AxiosError, string>(deleteShipmentFile)
}
