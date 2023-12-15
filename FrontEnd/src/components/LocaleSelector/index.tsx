import React, { useCallback } from 'react'

import { Select, message } from 'antd'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import { useGetUserMe, usePutUserLocale } from 'fetchers'
import { useEnvStore } from 'stores/env'

const options = [
  { value: 'en', label: 'EN' },
  { value: 'he', label: 'HE' },
]

const LocaleSelector: React.FC = () => {
  const { i18n } = useTranslation()
  const envStore = useEnvStore()

  const { mutate, isLoading } = usePutUserLocale()
  const { refetch } = useGetUserMe({ enabled: Boolean(envStore.user) })

  const onSuccess = useCallback(async () => {
    const user = await refetch()

    if (user?.data) {
      envStore.setUser(user.data)
    }
  }, [])

  const onError = useCallback((e: AxiosError) => {
    message.error(e.message)
  }, [])

  const handleChangeLanguage = useCallback((locale: string) => {
    i18n.changeLanguage(locale)

    if (envStore.user) {
      mutate({ locale }, { onSuccess, onError })
    }
  }, [])

  return (
    <Select
      onChange={handleChangeLanguage}
      options={options}
      value={i18n.language}
      bordered={false}
      loading={isLoading}
      size="small"
    />
  )
}

export default LocaleSelector
