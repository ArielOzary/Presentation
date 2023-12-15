import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateClientProfitsCommand } from 'models'

import { api } from 'utils/api'

export interface PutClientProfitsRequestParams {
  id: string
  dto: UpdateClientProfitsCommand
}

export const putClientProfits = async ({
  id,
  dto,
}: PutClientProfitsRequestParams): Promise<void> => {
  await api.put(`clients/${id}/profits`, dto)
}

export const usePutClientProfits = () => {
  return useMutation<void | never, AxiosError, PutClientProfitsRequestParams>(
    putClientProfits
  )
}
