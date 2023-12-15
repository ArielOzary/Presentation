import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ClientProfileDto } from 'models'

import { api } from 'utils/api'

interface GetClientsProfileRequestParams {
  id: string
}

export const getClientProfile = async ({
  id,
}: GetClientsProfileRequestParams): Promise<ClientProfileDto> => {
  const { data } = await api.get(`clients/${id}/profile`)

  return data
}

export const useGetClientProfile = (
  params: GetClientsProfileRequestParams,
  options?: UseQueryOptions<ClientProfileDto, AxiosError>
) => {
  return useQuery<ClientProfileDto, AxiosError>(
    ['FETCH_CLIENT_PROFILE', ...Object.values(params)],
    getClientProfile.bind(null, params),
    options
  )
}
