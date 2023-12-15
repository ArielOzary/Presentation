import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export const postShipmentFile = async (dto: FormData): Promise<string> => {
  const { data } = await api.post('shipment-files', dto)
  return data
}

export const usePostShipmentFile = () => {
  return useMutation<string, AxiosError, FormData>(postShipmentFile)
}
