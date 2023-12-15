import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { UpdateCompanySupplierCommand } from 'models'

import { api } from 'utils/api'

interface UpdateSupplierDto extends UpdateCompanySupplierCommand {
  id: number
}

export const putSupplier = async ({
  id,
  ...rest
}: UpdateSupplierDto): Promise<number> => {
  const { data } = await api.put(`suppliers/${id}`, rest)
  return data
}

export const usePutSupplier = () => {
  return useMutation<number, AxiosError, UpdateSupplierDto>(putSupplier)
}
