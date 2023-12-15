import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { AddShipmentStatusChildCommand } from 'models'

import { api } from 'utils/api'

export const postShipmentStatus = async (
  dto: AddShipmentStatusChildCommand
): Promise<string> => {
  const { data } = await api.post('shipmentStatuses', dto)
  return data
}

export const usePostShipmentStatus = () => {
  return useMutation<string, AxiosError, AddShipmentStatusChildCommand>(
    postShipmentStatus
  )
}
