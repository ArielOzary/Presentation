import React from 'react'

import { Form } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormButtons from 'components/AuthorizationWrapper/FormButtons'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'

import { BasicInfoSchemaType, useBasicInfoForm } from './hooks/basicInfoForm'

import { useForwarderSingUpStore } from 'stores/forwarderSingUp'

import styles from './styles.module.scss'

interface Props {
  onNext: () => void
}
const BasicInfo: React.FC<Props> = ({ onNext }) => {
  const { t } = useTranslation(['global', 'signUp'])
  const { basicInfo, setBasicInfo } = useForwarderSingUpStore()

  const {
    control,
    formState: { isValidating },
    handleSubmit,
  } = useBasicInfoForm({
    defaultValues: {
      customs: false,
      air: false,
      ocean: false,
      payment: true,
      ...(basicInfo || {}),
    },
  })
  const { renderInputControl } = useInputControl<BasicInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<BasicInfoSchemaType>()
  const { renderSwitchControl } = useSwitchControl<BasicInfoSchemaType>()

  const handleForm = (data: BasicInfoSchemaType) => {
    setBasicInfo(data)
    onNext()
  }

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
          name="nameEn"
          render={renderInputControl(
            { label: t('signUp:basicInfo.companyNameEnglish') },
            { placeholder: 'Company Name' }
          )}
        />
        <Controller
          control={control}
          name="vatNumber"
          render={renderInputControl(
            { label: t('signUp:basicInfo.vatNumber') },
            { placeholder: 'שם חברה' }
          )}
        />
      </FormRow>
      <FormRow>
        <Controller
          control={control}
          name="phoneNumber"
          render={renderInputPhoneControl({
            label: t('signUp:basicInfo.generalPhone'),
          })}
        />
        <Controller
          control={control}
          name="fax"
          render={renderInputPhoneControl({
            label: t('signUp:basicInfo.faxNumber'),
          })}
        />
      </FormRow>
      <FormRow>
        <Controller
          control={control}
          name="email"
          render={renderInputControl(
            { label: t('signUp:basicInfo.email') },
            { placeholder: 'johndoe@gmail.com' }
          )}
        />
        <div />
      </FormRow>
      <FormRow>
        <Controller
          control={control}
          name="customs"
          render={renderSwitchControl({ label: t('signUp:basicInfo.customs') })}
        />
        <Controller
          control={control}
          name="air"
          render={renderSwitchControl({ label: t('signUp:basicInfo.air') })}
        />
      </FormRow>
      <FormRow>
        <Controller
          control={control}
          name="ocean"
          render={renderSwitchControl({ label: t('signUp:basicInfo.ocean') })}
        />
        <Controller
          control={control}
          name="payment"
          render={renderSwitchControl(
            { label: t('signUp:basicInfo.payment') },
            { disabled: true }
          )}
        />
      </FormRow>
      <FormButtons loading={isValidating} nextText={t('global:next')} />
    </Form>
  )
}

export default BasicInfo
