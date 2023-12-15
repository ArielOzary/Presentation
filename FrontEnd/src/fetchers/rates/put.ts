import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateRateCommand } from 'models'

import { api } from 'utils/api'

interface PutRateRequestParams {
  id: number
  dto: UpdateRateCommand
}

export const putRate = async ({
  id,
  dto,
}: PutRateRequestParams): Promise<string> => {
  const { data } = await api.put(`rates/${id}`, dto)

  return data
}

export const usePutRate = () => {
  return useMutation<string, AxiosError, PutRateRequestParams>(putRate)
}
