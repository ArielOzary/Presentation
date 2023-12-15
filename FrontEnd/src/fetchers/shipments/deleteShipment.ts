import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

interface DeleteShipmentRequestDto {
  id: string
  reason: string
}

export const deleteShipment = async (
  dto: DeleteShipmentRequestDto
): Promise<string> => {
  const { data } = await api.delete(`shipments/${dto.id}`, {
    data: { reason: dto.reason },
  })

  return data
}

export const useDeleteShipment = () => {
  return useMutation<string, AxiosError, DeleteShipmentRequestDto>(
    deleteShipment
  )
}
