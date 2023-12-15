import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { SetReminderStatusCommand } from 'models'

import { api } from 'utils/api'

export const remindSetStatus = async (
  dto: SetReminderStatusCommand
): Promise<string> => {
  const { data } = await api.put('remind/set-status', dto)
  return data
}
export const useRemindSetStatus = () => {
  return useMutation<string, AxiosError, SetReminderStatusCommand>(
    remindSetStatus
  )
}
