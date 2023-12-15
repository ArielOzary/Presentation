import React from 'react'

import { Button, Form } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'

import {
  CompanyInfoSchemaType,
  useCompanyInfoForm,
} from './hooks/companyInfoForm'

import { useSupplierStore } from 'stores/suppliers'

import styles from './styles.module.scss'

interface Props {
  setIsNext: (value: boolean) => void
}

const CompanyInformation: React.FC<Props> = ({ setIsNext }) => {
  const { t } = useTranslation(['adminSignUp', 'signUp', 'createSupplier'])

  const setCompanyInfo = useSupplierStore(store => store.setCompanyInfo)

  const { renderInputControl } = useInputControl<CompanyInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<CompanyInfoSchemaType>()

  const { control, formState, handleSubmit } = useCompanyInfoForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const handleForm = (data: CompanyInfoSchemaType) => {
    setCompanyInfo(data)
    setIsNext(true)
  }

  return (
    <div>
      <p className={styles.title}>{t('createSupplier:companyInformation')}</p>
      <Form
        onSubmitCapture={handleSubmit(handleForm)}
        layout="vertical"
        size="large"
      >
        <FormRow>
          <Controller
            control={control}
            name="companyName"
            render={renderInputControl(
              { label: t('adminSignUp:companyName') },
              { placeholder: t('adminSignUp:companyName') }
            )}
          />
          <Controller
            control={control}
            name="companyPhoneNumber"
            render={renderInputPhoneControl({
              label: t('signUp:contactInfo.phoneNumber'),
            })}
          />
        </FormRow>
        <FormEmailRow>
          <Controller
            control={control}
            name="companyAddress"
            render={renderInputControl(
              { label: t('createSupplier:address') },
              { placeholder: 'Shpigelman 16, Netanya' }
            )}
          />
          <Controller
            control={control}
            name="companyApartment"
            render={renderInputControl(
              { label: t('signUp:companyLocation.apartment') },
              { placeholder: '5', maxLength: 5 }
            )}
          />
          <Controller
            control={control}
            name="companyPostalCode"
            render={renderInputControl(
              { label: t('signUp:companyLocation.postalCode') },
              { placeholder: '40300', maxLength: 5 }
            )}
          />
        </FormEmailRow>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            loading={formState.isValidating}
            disabled={formState.isValidating}
            className={styles.btn}
          >
            {t('createSupplier:continue')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CompanyInformation
