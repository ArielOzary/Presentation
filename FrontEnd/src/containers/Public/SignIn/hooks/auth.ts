import { useEffect, useMemo } from 'react'

import { Modal, message } from 'antd'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { SignInSchemaType } from './signInForm'

import { useGetUserMe } from 'fetchers'
import { usePostAuthenticationLogin } from 'fetchers/authentication'
import { usePutUserLocale } from 'fetchers/user/putLocale'
import { UserDto } from 'models'
import { useEnvStore } from 'stores/env'

import { setAuthorizationHeader } from 'utils/api'
import { getDefaultUserRoute } from 'utils/defaultUserRoute'
import { useQueryString } from 'utils/hooks/useQueryString'
import securedStorage from 'utils/secureStorage'

export const useAuth = () => {
  const { t, i18n } = useTranslation([
    'global',
    'forgotPassword',
    'serverErrors',
  ])
  const navigate = useNavigate()
  const envStore = useEnvStore()
  const { queryParams } = useQueryString()
  const sourceQueryParam = useMemo(
    () => queryParams.get('source'),
    [queryParams]
  )

  const {
    refetch,
    isFetching: isUserMeFetching,
    error: userMeError,
  } = useGetUserMe({ enabled: false })
  const {
    mutateAsync,
    isLoading: isAuthLoginLoading,
    error: authLoginError,
    reset,
  } = usePostAuthenticationLogin()

  const { mutateAsync: putUserLocale, isLoading: isLocaleLoading } =
    usePutUserLocale()

  const askToChangePassword = () => {
    Modal.confirm({
      title: t('forgotPassword:doYouWantChangePasswordNow'),
      okText: t('global:yes'),
      cancelText: t('global:later'),
      onOk: () => navigate('/change-password'),
      onCancel: () => undefined,
    })
  }

  const handleSignIn = async (form: SignInSchemaType) => {
    try {
      const { accessToken } = await mutateAsync(form)

      if (!accessToken) throw new AxiosError(t('serverErrors:UNKNOWN'))

      securedStorage.setAccessToken(accessToken)
      setAuthorizationHeader(accessToken)

      if (!securedStorage.getLoggedBefore()) {
        await putUserLocale({ locale: i18n.language })
        securedStorage.setLoggedBefore(true)
      }

      const { data } = await refetch()
      envStore.setUser(data as UserDto)

      if (sourceQueryParam && sourceQueryParam === 'email') {
        askToChangePassword()
      }
    } catch (e) {
      if (e instanceof AxiosError && e.code === 'USER_NOT_VERIFIED') {
        const sub = e.message.split(' ').join('+')

        navigate(`/verification?sub=${sub}`)
      } else if (e instanceof AxiosError) {
        message.error(e.message)
      }
    }
  }

  useEffect(() => {
    if (envStore.user) {
      navigate(getDefaultUserRoute(envStore.user))
    }
  }, [envStore.user?.roles])

  const isLoading = isAuthLoginLoading || isUserMeFetching || isLocaleLoading
  const error = userMeError || authLoginError

  return { handleSignIn, reset, isLoading, error }
}
