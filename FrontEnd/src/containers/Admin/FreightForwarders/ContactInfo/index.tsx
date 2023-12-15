import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { EditOutlined } from '@ant-design/icons'
import { Alert, Button, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import Wrapper from 'components/ForwarderTabsWrapper'

import ContactsFrom from 'containers/Public/ForwarderSignUp/ContactInfo/ContactsForm'

import { useContactsInfoForm } from './hooks/contactsInfoForm'

import {
  useGetFreightForwarderProfileBasicInfo,
  useGetFreightForwarderProfileContacts,
  usePutFreightForwarderProfileContacts,
} from 'fetchers'

import styles from './styles.module.scss'

interface Props {
  refetchList: () => void
}

const ContactInfo: React.FC<Props> = ({ refetchList }) => {
  const { t } = useTranslation([
    'global',
    'signUp',
    'freightForwardersManagement',
  ])
  const params = useParams<{ id: string }>()

  const [isEditing, setIsEditing] = useState(false)

  const {
    data: contacts,
    isLoading: isContactsLoading,
    refetch: refetchContacts,
  } = useGetFreightForwarderProfileContacts(params.id || '', {
    enabled: Boolean(params.id),
  })
  const { data: basicInfo, isLoading: isBasicInfoLoading } =
    useGetFreightForwarderProfileBasicInfo(params.id || '')

  const {
    mutate,
    isLoading: isUpdateLoading,
    isError,
    error,
  } = usePutFreightForwarderProfileContacts()

  const {
    oceanForm,
    airForm,
    customsForm,
    paymentForm,
    init,
    createCompanyContacts,
    createTriggers,
  } = useContactsInfoForm()

  const handleSuccess = useCallback(() => {
    message.success(t('freightForwardersManagement:contactsUpdated'))

    refetchContacts()
    refetchList()
    setIsEditing(false)
  }, [])

  const updateContacts = useCallback(() => {
    const companyContacts = basicInfo && createCompanyContacts(basicInfo)

    mutate(
      {
        id: params.id || '',
        dto: { companyContacts },
      },
      { onSuccess: handleSuccess }
    )
  }, [basicInfo])

  const handleSubmit = useCallback(async () => {
    const triggers = createTriggers(basicInfo)
    const results = await Promise.all(triggers)

    if (results.every(Boolean)) {
      updateContacts()
    }
  }, [basicInfo])

  const handleEditToggle = useCallback(() => {
    setIsEditing(isEditing => !isEditing)
  }, [])

  useEffect(() => {
    contacts && init(contacts)
  }, [contacts])

  const isLoading = useMemo(
    () => isContactsLoading || isBasicInfoLoading || isUpdateLoading,
    [isContactsLoading, isBasicInfoLoading, isUpdateLoading]
  )

  return (
    <Wrapper>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Button
            onClick={handleEditToggle}
            className={styles.editToggleBtn}
            icon={<EditOutlined />}
            size="large"
            type="text"
          />
        </div>

        {isError && <Alert message={error.message} type="error" showIcon />}

        {basicInfo?.providerInfo?.ocean && (
          <ContactsFrom
            form={oceanForm}
            title={t('signUp:contactsInfoForwarder.oceanRep')}
            disabled={!isEditing}
          />
        )}
        {basicInfo?.providerInfo?.air && (
          <ContactsFrom
            form={airForm}
            title={t('signUp:contactsInfoForwarder.airRep')}
            disabled={!isEditing}
          />
        )}
        {basicInfo?.providerInfo?.customs && (
          <ContactsFrom
            form={customsForm}
            title={t('signUp:contactsInfoForwarder.customsRep')}
            disabled={!isEditing}
          />
        )}
        {basicInfo?.providerInfo?.payment && (
          <ContactsFrom
            form={paymentForm}
            title={t('signUp:contactsInfoForwarder.paymentRep')}
            disabled={!isEditing}
          />
        )}

        {isEditing && (
          <Button
            type="primary"
            className={styles.btn}
            size="large"
            onClick={handleSubmit}
            loading={isLoading}
          >
            {t('global:saveChanges')}
          </Button>
        )}
      </div>
    </Wrapper>
  )
}

export default ContactInfo
