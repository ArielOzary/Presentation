import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { SetUserVerificationStatusCommand } from 'models'

import { api } from 'utils/api'

interface PutUserVerificationStatusRequestDto {
  id: string
  dto: SetUserVerificationStatusCommand
}

export const putUserVerificationStatus = async ({
  id,
  dto,
}: PutUserVerificationStatusRequestDto): Promise<string> => {
  const { data } = await api.put(`users/${id}/verification-status`, dto)

  return data
}

export const usePutUserVerificationStatus = () => {
  return useMutation<string, AxiosError, PutUserVerificationStatusRequestDto>(
    putUserVerificationStatus
  )
}
