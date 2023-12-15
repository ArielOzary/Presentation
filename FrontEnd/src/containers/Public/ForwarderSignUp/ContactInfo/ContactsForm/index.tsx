import React from 'react'

import { Form } from 'antd'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'

import { ContactInfoSchemaType } from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'

import styles from '../styles.module.scss'

interface Props {
  onSubmitCapture?: () => void
  form: UseFormReturn<ContactInfoSchemaType>
  title: string
  disabled?: boolean
}

const ContactsFrom: React.FC<Props> = ({
  onSubmitCapture,
  form,
  title,
  disabled = false,
}) => {
  const { t } = useTranslation(['signUp'])

  const { renderInputControl } = useInputControl<ContactInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<ContactInfoSchemaType>()

  return (
    <Form
      onSubmitCapture={onSubmitCapture}
      layout="vertical"
      size="large"
      className={styles.form}
      disabled={disabled}
    >
      <span className={styles.titleText}>{title}</span>
      <div className={styles.box}>
        <FormRow>
          <Controller
            control={form.control}
            name="name"
            render={renderInputControl(
              { label: t('signUp:contactInfo.contactName') },
              { placeholder: 'John Doe' }
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={renderInputControl(
              { label: t('signUp:contactInfo.contactEmail') },
              { placeholder: 'johndoe@gmail.com' }
            )}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={form.control}
            name="phoneNumber"
            render={renderInputPhoneControl({
              label: t('signUp:contactInfo.phoneNumber'),
            })}
          />
          <Controller
            control={form.control}
            name="jobTitle"
            render={renderInputControl(
              { label: t('signUp:contactInfo.jobTitle') },
              { placeholder: 'Head Of Operations' }
            )}
          />
        </FormRow>
      </div>
    </Form>
  )
}

export default ContactsFrom
