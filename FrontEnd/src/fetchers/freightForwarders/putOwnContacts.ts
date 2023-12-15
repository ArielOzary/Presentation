import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { SetOwnFreightForwarderContactsCommand } from 'models'

import { api } from 'utils/api'

export const putOwnContacts = async (
  dto: SetOwnFreightForwarderContactsCommand
): Promise<string> => {
  const { data } = await api.put('freight-forwarders/own-profile/contacts', dto)
  return data
}

export const usePutOwnContacts = () => {
  return useMutation<string, AxiosError, SetOwnFreightForwarderContactsCommand>(
    putOwnContacts
  )
}
