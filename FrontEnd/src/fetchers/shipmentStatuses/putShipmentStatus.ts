import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateShipmentStatusCommand } from 'models'

import { api } from 'utils/api'

interface UpdateShipmentStatusDto extends UpdateShipmentStatusCommand {
  id: number
}

export const putShipmentStatus = async ({
  id,
  ...rest
}: UpdateShipmentStatusDto): Promise<string> => {
  const { data } = await api.put(`shipmentStatuses/${id}`, rest)
  return data
}

export const usePutShipmentStatus = () => {
  return useMutation<string, AxiosError, UpdateShipmentStatusDto>(
    putShipmentStatus
  )
}
