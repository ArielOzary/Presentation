import React, { useCallback, useEffect, useMemo } from 'react'

import { Alert, Button, Spin, message } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import { useContactsInfoForm } from '../../../Admin/FreightForwarders/ContactInfo/hooks/contactsInfoForm'
import Wrapper from '../Wrapper'
import ForwarderContactsForm from './ForwarderContactsForm'

import { useGetOwnBasicInfo, usePutOwnContacts } from 'fetchers'
import { FreightForwarderContactsDto } from 'models'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  data: FreightForwarderContactsDto | undefined
  isLoading: boolean
  refetch: () => void
}

const ContactInfo: React.FC<Props> = ({ data, isLoading, refetch }) => {
  const { t } = useTranslation([
    'global',
    'signUp',
    'freightForwardersManagement',
  ])

  const {
    oceanForm,
    airForm,
    customsForm,
    paymentForm,
    init,
    createCompanyContacts,
    createTriggers,
  } = useContactsInfoForm()

  const [isEditing, setIsEditing] = useProfileStore(store => [
    store.isEditing,
    store.setIsEditing,
  ])

  const { data: basicInfo, isLoading: basicInfoLoading } = useGetOwnBasicInfo()
  const {
    mutate,
    isLoading: putContactsLoading,
    isError,
    error,
  } = usePutOwnContacts()

  const handleSuccess = useCallback(() => {
    message.success(t('freightForwardersManagement:contactsUpdated'))
    setIsEditing(false)
    refetch()
  }, [])

  const updateContacts = useCallback(() => {
    const companyContacts = basicInfo && createCompanyContacts(basicInfo)

    mutate({ companyContacts }, { onSuccess: handleSuccess })
  }, [basicInfo])

  const handleSubmit = useCallback(async () => {
    const triggersArr = createTriggers(basicInfo)
    const results = await Promise.all(triggersArr)

    if (results.every(Boolean)) {
      updateContacts()
    }
  }, [basicInfo])

  useEffect(() => {
    data && init(data)

    setIsEditing(false)
  }, [data])

  const loading = useMemo(
    () => isLoading || basicInfoLoading || putContactsLoading,
    [isLoading, basicInfoLoading, putContactsLoading]
  )

  return (
    <Wrapper>
      <div className={styles.wrapper}>
        <p className={styles.title}>
          {t('freightForwardersManagement:contactInfoTab')}
        </p>
        <Spin spinning={isLoading}>
          {isError && <Alert message={error.message} type="error" showIcon />}
          {basicInfo?.providerInfo?.ocean && (
            <ForwarderContactsForm
              form={oceanForm}
              title={t('signUp:contactsInfoForwarder.oceanRep')}
            />
          )}

          {basicInfo?.providerInfo?.air && (
            <ForwarderContactsForm
              form={airForm}
              title={t('signUp:contactsInfoForwarder.airRep')}
            />
          )}

          {basicInfo?.providerInfo?.customs && (
            <ForwarderContactsForm
              form={customsForm}
              title={t('signUp:contactsInfoForwarder.customsRep')}
            />
          )}
          {basicInfo?.providerInfo?.payment && (
            <ForwarderContactsForm
              form={paymentForm}
              title={t('signUp:contactsInfoForwarder.paymentRep')}
            />
          )}
          {isEditing ? (
            <Button
              type="primary"
              className={cn(styles.btn, 'bold')}
              onClick={handleSubmit}
              size="large"
              loading={loading}
            >
              {t('global:saveChanges')}
            </Button>
          ) : null}
        </Spin>
      </div>
    </Wrapper>
  )
}

export default ContactInfo
