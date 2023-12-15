import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

interface SetOwnLocaleCommand {
  locale: string
}

export const putUserLocale = async (
  dto: SetOwnLocaleCommand
): Promise<string> => {
  const { data } = await api.put('users/locale', dto)

  return data
}

export const usePutUserLocale = () => {
  return useMutation<string, AxiosError, SetOwnLocaleCommand>(putUserLocale)
}
