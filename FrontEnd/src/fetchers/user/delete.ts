import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

export interface DeleteUserRequestParams {
  id: string
  dto: { reason: string }
}

export const deleteUser = async ({
  id,
  dto,
}: DeleteUserRequestParams): Promise<string> => {
  const { data } = await api.delete(`users/${id}`, { data: dto })

  return data
}

export const useDeleteUser = () => {
  return useMutation<string, AxiosError, DeleteUserRequestParams>(deleteUser)
}
