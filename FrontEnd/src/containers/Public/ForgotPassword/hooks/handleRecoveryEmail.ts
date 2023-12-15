import { useEffect, useMemo } from 'react'

import { Modal, message } from 'antd'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { getUserMe, usePostPasswordExchangeToken } from 'fetchers'
import { useEnvStore } from 'stores/env'

import { removeAuthorizationHeader, setAuthorizationHeader } from 'utils/api'
import { getDefaultUserRoute } from 'utils/defaultUserRoute'
import { useQueryString } from 'utils/hooks/useQueryString'
import securedStorage from 'utils/secureStorage'

export const useHandleRecoveryEmail = () => {
  const { t } = useTranslation(['global', 'forgotPassword', 'serverErrors'])
  const navigate = useNavigate()
  const setUser = useEnvStore(({ setUser }) => setUser)
  const { queryParams } = useQueryString()
  const subQueryParam = useMemo(() => queryParams.get('sub'), [queryParams])

  const { mutateAsync } = usePostPasswordExchangeToken()

  const handleSubQueryParam = async () => {
    try {
      const { accessToken } = await mutateAsync({ token: subQueryParam || '' })
      if (!accessToken) {
        throw new AxiosError(t('serverErrors:UNKNOWN'))
      }

      setAuthorizationHeader(accessToken)
      securedStorage.setAccessToken(accessToken)

      const user = await getUserMe()
      setUser(user)

      Modal.confirm({
        title: t('forgotPassword:doYouWantChangePasswordNow'),
        okText: t('global:yes'),
        cancelText: t('global:later'),
        onOk: () => navigate('/change-password'),
        onCancel: () => {
          navigate(getDefaultUserRoute(user))
        },
      })
    } catch (e) {
      removeAuthorizationHeader()
      securedStorage.removeAccessToken()

      navigate('/')

      if (e instanceof AxiosError) {
        message.error(e.message)
      }
    }
  }

  useEffect(() => {
    if (subQueryParam) {
      handleSubQueryParam()
    }
  }, [subQueryParam])

  return { isLoading: subQueryParam !== null }
}
