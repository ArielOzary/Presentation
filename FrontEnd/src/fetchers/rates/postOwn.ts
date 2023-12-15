import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { CreateOwnRateCommand } from 'models'

import { api } from 'utils/api'

export const postRateOwn = async (
  dto: CreateOwnRateCommand
): Promise<string> => {
  const { data } = await api.post('rates/own', dto)

  return data
}

export const usePostRateOwn = () => {
  return useMutation<string, AxiosError, CreateOwnRateCommand>(postRateOwn)
}
