import React from 'react'

import { Form } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormButtons from 'components/AuthorizationWrapper/FormButtons'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPasswordControl } from 'components/FormControls/hooks/inputPasswordControl'
import { useSelectIndustryControl } from 'components/FormControls/hooks/selectIndustryControl'

import {
  CompanyInfoSchemaType,
  useCompanyInfoForm,
} from './hooks/companyInfoForm'

import { useClientSignUpStore } from 'stores/clientSignUp'

import styles from './styles.module.scss'

interface Props {
  onNext: () => void
}

const CompanyInfo: React.FC<Props> = ({ onNext }) => {
  const { t } = useTranslation(['global', 'signUp'])
  const { companyInfo, setCompanyInfo } = useClientSignUpStore()

  const { control, handleSubmit } = useCompanyInfoForm({
    defaultValues: companyInfo || undefined,
  })

  const handleForm = (data: CompanyInfoSchemaType) => {
    setCompanyInfo(data)
    onNext()
  }

  const { renderInputControl } = useInputControl<CompanyInfoSchemaType>()
  const { renderInputPasswordControl } =
    useInputPasswordControl<CompanyInfoSchemaType>()
  const { renderSelectIndustryControl } =
    useSelectIndustryControl<CompanyInfoSchemaType>()

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
            { label: t('signUp:companyInfo.companyNameEnglish') },
            { placeholder: 'Company Name' }
          )}
        />
        <Controller
          control={control}
          name="nameHe"
          render={renderInputControl(
            { label: t('signUp:companyInfo.companyNameHebrew') },
            { placeholder: 'שם חברה', style: { textAlign: 'right' } }
          )}
        />
      </FormRow>
      <FormRow>
        <Controller
          control={control}
          name="industryTypeId"
          render={renderSelectIndustryControl()}
        />
        <Controller
          control={control}
          name="legalNumber"
          render={renderInputControl(
            { label: t('signUp:companyInfo.legalNumber') },
            { placeholder: '305931782' }
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
        <div />
      </FormRow>
      <FormRow>
        <Controller
          control={control}
          name="password"
          render={renderInputPasswordControl({ label: t('global:password') })}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={renderInputPasswordControl({
            label: t('signUp:companyInfo.confirmPassword'),
          })}
        />
      </FormRow>

      <FormButtons nextText={t('global:next')} />
    </Form>
  )
}

export default CompanyInfo
