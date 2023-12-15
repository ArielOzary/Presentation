import React, { useEffect, useMemo } from 'react'

import { Alert, Form } from 'antd'
import { Helmet } from 'react-helmet'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import AuthorizationWrapper, {
  WrapperType,
} from 'components/AuthorizationWrapper'
import FormButtons from 'components/AuthorizationWrapper/FormButtons'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'

import {
  AdminSignUpSchemaType,
  useAdminSignUpForm,
} from './hooks/adminSignUpForm'

import { usePostRegistrationAdmin } from 'fetchers'

import { useQueryString } from 'utils/hooks/useQueryString'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const AdminSignUp: React.FC = () => {
  const { t } = useTranslation(['global', 'signUp', 'adminSignUp'])
  const navigate = useNavigate()

  const { queryParams } = useQueryString()
  const subQueryParam = useMemo(() => queryParams.get('sub'), [queryParams])

  const { mutate, isSuccess, isLoading, isError, error, reset } =
    usePostRegistrationAdmin()

  const { control, formState, handleSubmit } = useAdminSignUpForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })
  const { renderInputControl } = useInputControl<AdminSignUpSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<AdminSignUpSchemaType>()

  const handleForm = (data: AdminSignUpSchemaType) => {
    if (!subQueryParam) {
      return
    }

    const registrationToken = subQueryParam.split(' ').join('+')

    mutate({ ...data, registrationToken })
  }

  useEffect(() => {
    if (subQueryParam === null) {
      navigate('/')
    }
  }, [subQueryParam])

  return (
    <>
      <Helmet>
        <title>{t('global:signUp')}</title>
      </Helmet>
      <AuthorizationWrapper
        sidebar={
          <div className={styles.sidebar}>
            <DeliveryIcon className={styles.icon} />
            <span className={styles.title}>
              {t('adminSignUp:welcomeToAutolog')}
            </span>
            <span className={styles.text}>{t('adminSignUp:welcomeText')}</span>
          </div>
        }
        type={WrapperType.SIGN_UP}
      >
        <div className={styles.forms}>
          <span className={styles.title}>
            {t('signUp:createYourFreeAccount')}
          </span>
          <span className={styles.subtitle}>
            {t('adminSignUp:personOfContact')}
          </span>
          {isError && (
            <Alert
              className={styles.error}
              message={error.message}
              onClose={reset}
              type="error"
              showIcon
              closable
            />
          )}
          {isSuccess && (
            <Form.Item>
              <Alert
                message={t('adminSignUp:successMessage')}
                type="success"
                showIcon
              />
            </Form.Item>
          )}

          <Form
            onSubmitCapture={handleSubmit(handleForm)}
            layout="vertical"
            size="large"
            disabled={isSuccess}
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
                name="phoneNumber"
                render={renderInputPhoneControl({
                  label: t('signUp:contactInfo.phoneNumber'),
                })}
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
            <FormRow>
              <Controller
                control={control}
                name="fax"
                render={renderInputPhoneControl({
                  label: t('adminSignUp:fax'),
                })}
              />
              <div />
            </FormRow>

            <FormButtons
              loading={formState.isValidating || isLoading}
              disabled={formState.isValidating || isSuccess}
              nextText={t('global:send')}
            />
          </Form>
        </div>
      </AuthorizationWrapper>
    </>
  )
}

export default AdminSignUp
