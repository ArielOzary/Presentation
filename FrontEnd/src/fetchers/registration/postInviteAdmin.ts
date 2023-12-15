import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { api } from 'utils/api'

interface AdminInvitationCommand {
  email: string
}

export const postRegistrationInviteAdmin = async (
  dto: AdminInvitationCommand
): Promise<string> => {
  const { data } = await api.post('registration/invite-admin', dto)

  return data
}

export const usePostRegistrationInviteAdmin = () => {
  return useMutation<string, AxiosError, AdminInvitationCommand>(
    postRegistrationInviteAdmin
  )
}
