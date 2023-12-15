import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { CreateCompanySupplierCommand } from 'models'

import { api } from 'utils/api'

export const postSupplier = async (
  dto: CreateCompanySupplierCommand
): Promise<number> => {
  const { data } = await api.post('suppliers', dto)
  return data
}

export const usePostSupplier = () => {
  return useMutation<number, AxiosError, CreateCompanySupplierCommand>(
    postSupplier
  )
}
