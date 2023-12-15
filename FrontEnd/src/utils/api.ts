import axios, { AxiosError, AxiosResponse } from 'axios'
import { config } from 'config'
import { t } from 'i18next'

import securedStorage from './secureStorage'

import {
  FormErrorMessage,
  ServerErrors,
  ServerResponse,
  TokenResultDto,
} from 'models'

const state = {
  retry: false,
}

export const api = axios.create({
  baseURL: config.API_URL,
  validateStatus: status => status >= 200 && status < 500,
})

export const identity = axios.create({
  baseURL: config.IDENTITY_URL,
  validateStatus: status => status >= 200 && status < 500,
  withCredentials: true,
})

export const postAuthenticationRefresh = async (): Promise<TokenResultDto> => {
  const { data } = await identity.post<TokenResultDto>('authentication/refresh')

  return data
}

export const setAcceptLanguageHeader = (language: string) => {
  api.defaults.headers['Accept-Language'] = language
}

export const removeAcceptLanguageHeader = () => {
  delete api.defaults.headers['Accept-Language']
}

export const setAuthorizationHeader = (accessToken: string) => {
  api.defaults.headers.Authorization = `Bearer ${accessToken}`
}

export const removeAuthorizationHeader = () => {
  delete api.defaults.headers.Authorization
}

// translation error handler
const errorCodeHandler = (config: AxiosResponse<ServerResponse>) => {
  const { code, reason, verificationToken } = config.data

  switch (code) {
    case 'USER_IS_DEACTIVATED':
      throw new AxiosError(
        t('serverErrors:USER_IS_DEACTIVATED', { reason }),
        code
      )
    case 'USER_IS_DELETED':
      throw new AxiosError(t('serverErrors:USER_IS_DELETED', { reason }), code)
    case 'USER_NOT_VERIFIED':
      throw new AxiosError(verificationToken, code)
    default:
      throw new AxiosError(t(`serverErrors:${code}` as FormErrorMessage), code)
  }
}

const multipleErrorsHandler = (errors: ServerErrors) => {
  const data = Object.keys(errors).map(key => {
    const prop = key.charAt(0).toLowerCase() + key.slice(1)

    return {
      key,
      prop,
      message: t(`serverErrors:${errors[key].code}` as FormErrorMessage),
      originMessage: errors[key].message,
    }
  })

  const combinedErrorsMessage = data
    .map(({ key, message }) => `${key}: ${message}`)
    .join('\n')
  const message = `${t('serverErrors:multipleError')}\n${combinedErrorsMessage}`

  return { message, data }
}

export const onAxiosResponseFullFilled = async (config: AxiosResponse) => {
  const { code, message, errors }: ServerResponse = config.data
  if (!code && !message && config.status < 400) {
    return config
  }

  const headersResUrl = config.config.url === 'authentication/login'

  if (config.status === 401 && !state.retry && !headersResUrl) {
    state.retry = true

    const { accessToken } = await postAuthenticationRefresh()

    setAuthorizationHeader(accessToken || '')
    securedStorage.setAccessToken(accessToken || '')

    config.config.headers.Authorization = `Bearer ${accessToken}`

    state.retry = false

    return api(config.config)
  }

  if (errors) {
    const { message, data } = multipleErrorsHandler(errors)

    throw new AxiosError(
      message,
      '',
      config.config,
      config.request,
      data as AxiosResponse['data']
    )
  } else if (code) {
    return errorCodeHandler(config)
  } else if (message) {
    throw new AxiosError(message)
  } else {
    throw new AxiosError(t('serverErrors:UNKNOWN') as FormErrorMessage)
  }
}

export const onAxiosResponseRejected = (error: AxiosError) => {
  return Promise.reject(
    new AxiosError(t('serverErrors:UNKNOWN') as FormErrorMessage, error.code)
  )
}

api.interceptors.response.use(
  onAxiosResponseFullFilled,
  onAxiosResponseRejected
)

identity.interceptors.response.use(
  onAxiosResponseFullFilled,
  onAxiosResponseRejected
)
