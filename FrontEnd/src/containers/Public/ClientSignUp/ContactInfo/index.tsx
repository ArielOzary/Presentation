import React, { useCallback } from 'react'

import { Form } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormButtons from 'components/AuthorizationWrapper/FormButtons'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'

import {
  ContactInfoSchemaType,
  useContactInfoForm,
} from './hooks/contactInfoForm'

import { useClientSignUpStore } from 'stores/clientSignUp'

import styles from './styles.module.scss'

interface Props {
  onNext: () => void
  onPrev: () => void
}

const ContactInfo: React.FC<Props> = ({ onNext, onPrev }) => {
  const { t } = useTranslation(['global', 'signUp'])
  const { contactInfo, setContactInfo } = useClientSignUpStore()

  const { control, formState, handleSubmit, getValues } = useContactInfoForm({
    defaultValues: { ...contactInfo },
  })

  const { renderInputControl } = useInputControl<ContactInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<ContactInfoSchemaType>()

  const handleForm = (data: ContactInfoSchemaType) => {
    setContactInfo(data)
    onNext()
  }

  const handlePrev = useCallback(() => {
    const data = getValues()
    setContactInfo(data)
    onPrev()
  }, [])

  return (
    <Form
      onSubmitCapture={handleSubmit(handleForm)}
      layout="vertical"
      size="large"
      className={styles.form}
    >
      <FormRow>
        <Controller
          control={control}
          name="name"
          render={renderInputControl(
            { label: t('signUp:contactInfo.contactName') },
            { placeholder: 'John Doe' }
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
      <FormRow>
        <Controller
          control={control}
          name="email"
          render={renderInputControl(
            { label: t('signUp:contactInfo.contactEmail') },
            { placeholder: 'johndoe@gmail.com' }
          )}
        />
        <Controller
          control={control}
          name="jobTitle"
          render={renderInputControl(
            { label: t('signUp:contactInfo.jobTitle') },
            { placeholder: 'Head Of Operations' }
          )}
        />
      </FormRow>
      <FormButtons
        loading={formState.isValidating}
        disabled={formState.isValidating}
        onPrev={handlePrev}
        nextText={t('global:next')}
      />
    </Form>
  )
}

export default ContactInfo
