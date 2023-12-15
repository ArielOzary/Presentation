import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { FreightForwarderInvitationCommand } from 'models'

import { api } from 'utils/api'

export const postRegistrationInviteFreightForwarder = async (
  dto: FreightForwarderInvitationCommand
): Promise<string> => {
  const { data } = await api.post('registration/invite-freight-forwarder', dto)

  return data
}

export const usePostRegistrationInviteFreightForwarder = () => {
  return useMutation<string, AxiosError, FreightForwarderInvitationCommand>(
    postRegistrationInviteFreightForwarder
  )
}
