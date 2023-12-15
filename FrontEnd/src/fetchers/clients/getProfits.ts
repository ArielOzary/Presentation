import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ClientProfitsDto } from 'models'

import { api } from 'utils/api'

interface GetClientsProfitsRequestParams {
  id: string
}

export const defaultClientProfits: ClientProfitsDto = {
  lcl: 0,
  fcl: 0,
  air: 0,
  customClearance: 0,
  originCharges: 0,
  destinationCharges: 0,
}

export const getClientProfits = async ({
  id,
}: GetClientsProfitsRequestParams): Promise<ClientProfitsDto> => {
  const { data } = await api.get(`clients/${id}/profits`)

  return data ? data : defaultClientProfits
}

export const useGetClientProfits = (
  params: GetClientsProfitsRequestParams,
  options?: UseQueryOptions<ClientProfitsDto, AxiosError>
) => {
  return useQuery<ClientProfitsDto, AxiosError>(
    ['FETCH_CLIENT_PROFITS', ...Object.values(params)],
    getClientProfits.bind(null, params),
    options
  )
}
