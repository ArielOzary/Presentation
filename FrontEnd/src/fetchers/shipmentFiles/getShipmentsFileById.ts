import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FileDto } from 'models'

import { api } from 'utils/api'

export const getShipmentsFile = async (id: string): Promise<FileDto> => {
  const { data } = await api.get(`shipment-files/${id}`)
  return data
}

export const useGetShipmentsFileById = (
  id: string,
  options?: UseQueryOptions<FileDto, AxiosError>
) => {
  return useQuery<FileDto, AxiosError>(
    ['SHIPMENT_FILE', id],
    getShipmentsFile.bind(null, id),
    options
  )
}
