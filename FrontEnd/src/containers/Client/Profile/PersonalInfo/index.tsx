import React, { useEffect } from 'react'

import { Button, Form, Spin, message } from 'antd'
import cn from 'classnames'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import PhoneNumber from 'components/PhoneNumber'

import Wrapper from 'containers/FreightForwarder/Profile/Wrapper'
import {
  ContactInfoSchemaType,
  useContactInfoForm,
} from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'

import { usePutOwnProfile } from 'fetchers/clients/putOwnProfile'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  isLoading: boolean
  refetch: () => void
}

const PersonalInfo: React.FC<Props> = ({ isLoading, refetch }) => {
  const { t } = useTranslation([
    'global',
    'freightForwardersManagement',
    'clientProfile',
    'signUp',
  ])

  const [isEditing, clientProfile, setIsEditing] = useProfileStore(store => [
    store.isEditing,
    store.clientProfile,
    store.setIsEditing,
  ])

  const { mutate, isLoading: mutateLoading } = usePutOwnProfile()

  const { control, formState, handleSubmit, reset } = useContactInfoForm()

  const { renderInputControl } = useInputControl<ContactInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<ContactInfoSchemaType>()

  const handleSuccess = () => {
    message.success(t('clientProfile:personalInfoUpdated'))
    setIsEditing(false)
    refetch()
  }

  const handleForm = (formsData: ContactInfoSchemaType) => {
    delete clientProfile?.totalProfit
    const id = clientProfile?.companyContacts?.[0].id
    const contactType = clientProfile?.companyContacts?.[0].contactType

    mutate(
      {
        ...clientProfile,
        companyContacts: [{ ...formsData, id, contactType }],
      },
      {
        onSuccess: handleSuccess,
        onError: error => message.error(error.message),
      }
    )
  }

  useEffect(() => {
    clientProfile && reset(clientProfile.companyContacts?.[0])
    setIsEditing(false)
  }, [clientProfile])

  useEffect(() => {
    clientProfile && reset(clientProfile.companyContacts?.[0])
  }, [clientProfile, isEditing])

  return (
    <Wrapper>
      <p className={styles.title}>{t('clientProfile:personalInfo')}</p>
      <Spin spinning={isLoading}>
        <Form
          onSubmitCapture={handleSubmit(handleForm)}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:contactInfo.contactName')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyContacts?.[0].name}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="name"
                render={renderInputControl(
                  { label: t('signUp:contactInfo.contactName') },
                  { placeholder: 'John Doe' }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:contactInfo.phoneNumber')}
                </span>
                <PhoneNumber
                  number={clientProfile?.companyContacts?.[0].phoneNumber}
                  className={styles.field}
                />
              </div>
            ) : (
              <Controller
                control={control}
                name="phoneNumber"
                render={renderInputPhoneControl({
                  label: t('signUp:contactInfo.phoneNumber'),
                })}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:contactInfo.contactEmail')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyContacts?.[0].email}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="email"
                render={renderInputControl(
                  { label: t('signUp:contactInfo.contactEmail') },
                  { placeholder: 'johndoe@gmail.com' }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:contactInfo.jobTitle')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyContacts?.[0].jobTitle}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="jobTitle"
                render={renderInputControl(
                  { label: t('signUp:contactInfo.jobTitle') },
                  { placeholder: 'Head Of Operations' }
                )}
              />
            )}
          </FormRow>
          {isEditing ? (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={mutateLoading || formState.isValidating}
                size="large"
                className={cn(styles.btn, 'bold')}
              >
                {t('global:saveChanges')}
              </Button>
            </Form.Item>
          ) : null}
        </Form>
      </Spin>
    </Wrapper>
  )
}

export default PersonalInfo
