import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { SetFreightForwarderContactsCommand } from 'models'

import { api } from 'utils/api'

interface PutFreightForwarderProfileContactsRequestParams {
  dto: SetFreightForwarderContactsCommand
  id: string
}

export const putFreightForwarderProfileContacts = async ({
  id,
  dto,
}: PutFreightForwarderProfileContactsRequestParams): Promise<string> => {
  const { data } = await api.put(
    `freight-forwarders/${id}/profile/contacts`,
    dto
  )

  return data
}

export const usePutFreightForwarderProfileContacts = () => {
  return useMutation<
    string,
    AxiosError,
    PutFreightForwarderProfileContactsRequestParams
  >(putFreightForwarderProfileContacts)
}
