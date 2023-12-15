import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { CreateRateCommand } from 'models'

import { api } from 'utils/api'

export const postRate = async (dto: CreateRateCommand): Promise<string> => {
  const { data } = await api.post('rates', dto)

  console.log(data.originCharges)
  console.log(data.freightCharges)
  console.log(data.destinationCharges)
  console.log(data)
  return data
}

export const usePostRate = () => {
  return useMutation<string, AxiosError, CreateRateCommand>(postRate)
}
