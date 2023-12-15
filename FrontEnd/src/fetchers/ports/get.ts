import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { PortDto, ShipmentOption } from 'models'

import { api } from 'utils/api'

interface PortsRequestDto {
  Country?: string
  PortType?: ShipmentOption
  Search?: string
}

export const getFetchPorts = async ({
  Country = undefined,
  PortType = undefined,
  Search = undefined,
}: PortsRequestDto): Promise<PortDto[]> => {
  const { data } = await api.get('ports', {
    params: { Country, PortType, Search },
  })

  return data
}

export const useGetPorts = (
  { Country, PortType, Search }: PortsRequestDto,
  options?: UseQueryOptions<PortDto[], AxiosError>
) => {
  return useQuery<PortDto[], AxiosError>(
    ['FETCH_PORTS', { Country, PortType, Search }],
    getFetchPorts.bind(null, { Country, PortType, Search }),
    options
  )
}
