import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { CreateShipmentCommand } from 'models'

import { api } from 'utils/api'

export const createShipment = async (
  dto: CreateShipmentCommand
): Promise<string> => {
  const { data } = await api.post('shipments', dto)

  return data
}

export const useCreateShipment = () => {
  return useMutation<string, AxiosError, CreateShipmentCommand>(createShipment)
}
