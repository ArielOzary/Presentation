import React from 'react'

import { Form } from 'antd'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import PhoneNumber from 'components/PhoneNumber'

import { ContactInfoSchemaType } from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'

import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  onSubmitCapture?: () => void
  form: UseFormReturn<ContactInfoSchemaType>
  title: string
}

const ForwarderContactsForm: React.FC<Props> = ({
  onSubmitCapture,
  form,
  title,
}) => {
  const { t } = useTranslation(['global', 'signUp'])

  const isEditing = useProfileStore(store => store.isEditing)

  const { renderInputControl } = useInputControl<ContactInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<ContactInfoSchemaType>()

  return (
    <Form
      onSubmitCapture={onSubmitCapture}
      layout="vertical"
      size="large"
      className={styles.form}
    >
      <span className={styles.titleText}>{title}</span>
      <div className={styles.box}>
        <FormRow>
          {!isEditing ? (
            <div className={styles.fieldBlock}>
              <span className={styles.label}>
                {t('signUp:basicInfo.companyNameEnglish')}
              </span>
              <span className={styles.field}>
                {form.getValues('name') ?? '-'}
              </span>
            </div>
          ) : (
            <Controller
              control={form.control}
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
                {t('signUp:contactInfo.contactEmail')}
              </span>
              <span className={styles.field}>
                {form.getValues('email') ?? '-'}
              </span>
            </div>
          ) : (
            <Controller
              control={form.control}
              name="email"
              render={renderInputControl(
                { label: t('signUp:contactInfo.contactEmail') },
                { placeholder: 'johndoe@gmail.com' }
              )}
            />
          )}
        </FormRow>
        <FormRow>
          {!isEditing ? (
            <div className={styles.fieldBlock}>
              <span className={styles.label}>
                {t('signUp:contactInfo.phoneNumber')}
              </span>
              <PhoneNumber
                number={form.getValues('phoneNumber') ?? '-'}
                className={styles.field}
              />
            </div>
          ) : (
            <Controller
              control={form.control}
              name="phoneNumber"
              render={renderInputPhoneControl({
                label: t('signUp:contactInfo.phoneNumber'),
              })}
            />
          )}
          {!isEditing ? (
            <div className={styles.fieldBlock}>
              <span className={styles.label}>
                {t('signUp:contactInfo.jobTitle')}
              </span>
              <span className={styles.field}>
                {form.getValues('jobTitle') ?? '-'}
              </span>
            </div>
          ) : (
            <Controller
              control={form.control}
              name="jobTitle"
              render={renderInputControl(
                { label: t('signUp:contactInfo.jobTitle') },
                { placeholder: 'Head Of Operations' }
              )}
            />
          )}
        </FormRow>
      </div>
    </Form>
  )
}

export default ForwarderContactsForm
