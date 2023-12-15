import { useEffect, useState } from 'react'

import { message } from 'antd'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { getUserMe } from 'fetchers/user/getMe'
import { useEnvStore } from 'stores/env'

import { removeAuthorizationHeader, setAuthorizationHeader } from 'utils/api'
import securedStorage from 'utils/secureStorage'

export const useAuth = () => {
  const { i18n } = useTranslation()
  const envStore = useEnvStore()
  const navigate = useNavigate()

  const [initialized, setInitialized] = useState(false)

  const authorize = async (): Promise<void> => {
    const accessToken = securedStorage.getAccessToken()
    if (!accessToken) {
      setInitialized(true)
      return
    }

    setAuthorizationHeader(accessToken)

    try {
      const user = await getUserMe()
      envStore.setUser(user)
      i18n.changeLanguage(user.locale)
    } catch (e) {
      removeAuthorizationHeader()
      securedStorage.removeAccessToken()

      navigate('/sign-in')

      if (e instanceof Error || e instanceof AxiosError) {
        message.error(e.message)
      }
    } finally {
      setInitialized(true)
    }
  }

  useEffect(() => {
    authorize().then(
      () => undefined,
      () => undefined
    )
  }, [])

  return { initialized }
}
