import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { AddContainerNumberOrVesselNameCommand } from 'models'

import { api } from 'utils/api'

interface RequestDto extends AddContainerNumberOrVesselNameCommand {
  id: string
}

export const putContainerNumber = async (dto: RequestDto): Promise<string> => {
  const { id, ...rest } = dto
  const { data } = await api.put(`shipments/${id}/tracking-name`, { ...rest })

  return data
}

export const usePutContainerNumber = () => {
  return useMutation<string, AxiosError, RequestDto>(putContainerNumber)
}
