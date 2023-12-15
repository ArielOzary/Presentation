import React from 'react'

import { Alert, Form, message } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormButtons from 'components/AuthorizationWrapper/FormButtons'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'

import { ContactUsSchemaType, useContactUsForm } from '../hooks/contactUsForm'

import { usePostContactUsMessage } from 'fetchers/contactUs/postContactUsMessage'
import { useContactStore } from 'stores/contactUs'

import styles from './styles.module.scss'

const ContactForm = () => {
  const { t } = useTranslation([
    'global',
    'adminSignUp',
    'signUp',
    'clientContactUs',
  ])

  const { setIsSended } = useContactStore()

  const { control, handleSubmit, formState } = useContactUsForm({})

  const { renderInputControl } = useInputControl<ContactUsSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<ContactUsSchemaType>()
  const { renderTextAreaControl } = useTextAreaControl<ContactUsSchemaType>()

  const { mutate, isLoading, isError, error } = usePostContactUsMessage()

  const handleSuccess = () => {
    setIsSended(true)
    message.success(t('clientContactUs:success'))
  }

  const handleForm = (data: ContactUsSchemaType) => {
    mutate(
      {
        FirstName: data.name,
        CompanyName: data.companyName,
        Email: data.email,
        Phone: data.phoneNumber,
        Message: data.message,
      },
      { onSuccess: handleSuccess }
    )
  }

  return (
    <Form
      onSubmitCapture={handleSubmit(handleForm)}
      layout="vertical"
      size="large"
      className={styles.form}
    >
      {isError && (
        <Form.Item>
          <Alert message={error.message} type="error" showIcon />
        </Form.Item>
      )}
      <FormRow>
        <Controller
          control={control}
          name="name"
          render={renderInputControl(
            { label: t('clientContactUs:firstAndSecond') },
            { placeholder: t('clientContactUs:firstAndSecond') }
          )}
        />
        <Controller
          control={control}
          name="companyName"
          render={renderInputControl(
            { label: t('adminSignUp:companyName') },
            { placeholder: t('adminSignUp:companyName') }
          )}
        />
      </FormRow>
      <FormRow>
        <Controller
          control={control}
          name="email"
          render={renderInputControl(
            { label: t('global:email') },
            { placeholder: 'johndoe@gmail.com' }
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          render={renderInputPhoneControl({
            label: t('signUp:contactInfo.phoneNumber'),
          })}
        />
      </FormRow>
      <div className={styles.message}>
        <Controller
          control={control}
          name="message"
          render={renderTextAreaControl(
            { label: t('clientContactUs:message') },
            {
              autoSize: { minRows: 2, maxRows: 6 },
              maxLength: 100,
              showCount: true,
              placeholder: t('clientContactUs:messagePlaceholder'),
              style: {
                minHeight: '6.4rem',
                fontSize: '0.875rem',
              },
            }
          )}
        />
      </div>
      <FormButtons
        nextText={t('clientContactUs:send')}
        loading={formState.isValidating || isLoading}
      />
    </Form>
  )
}

export default ContactForm
