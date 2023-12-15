import React, { useEffect } from 'react'

import { Alert, Button, Form, message } from 'antd'
import { Helmet } from 'react-helmet'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import AuthorizationWrapper, {
  WrapperType,
} from 'components/AuthorizationWrapper'
import { useInputPasswordControl } from 'components/FormControls/hooks/inputPasswordControl'

import {
  ChangePasswordSchemaType,
  useChangePasswordForm,
} from './hooks/changePasswordFrom'

import { usePutUserChangePassword } from 'fetchers'
import { useEnvStore } from 'stores/env'

import { getDefaultUserRoute } from 'utils/defaultUserRoute'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const ChangePassword: React.FC = () => {
  const { t } = useTranslation(['global', 'changePassword', 'signUp'])
  const navigate = useNavigate()
  const user = useEnvStore(state => state.user)

  const { control, handleSubmit } = useChangePasswordForm()
  const { renderInputPasswordControl } =
    useInputPasswordControl<ChangePasswordSchemaType>()

  const { mutate, isLoading, isError, error, reset } =
    usePutUserChangePassword()

  const handleForm = (data: ChangePasswordSchemaType) => {
    if (!user) {
      return
    }

    mutate(data, {
      onSuccess: () => {
        message.success(t('changePassword:passwordSuccessfullyChanged'))
        navigate(getDefaultUserRoute(user))
      },
    })
  }

  useEffect(() => {
    if (!user) {
      navigate('/sign-up')
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{t('changePassword:title')}</title>
      </Helmet>
      <AuthorizationWrapper
        type={WrapperType.SIGN_UP}
        sidebar={
          <div className={styles.sidebar}>
            <DeliveryIcon className={styles.icon} />
            <span className={styles.title}>
              {t('changePassword:strongPassword')}
            </span>
            <span className={styles.text}>
              {t('signUp:errors.companyInfo.passwordInvalid')}
            </span>
          </div>
        }
      >
        <Form
          onSubmitCapture={handleSubmit(handleForm)}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          <span className={styles.title}>{t('changePassword:title')}</span>

          {isError && (
            <Form.Item>
              <Alert
                message={error.message}
                onClose={reset}
                type="error"
                showIcon
                closable
              />
            </Form.Item>
          )}

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

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className="bold"
            >
              {t('confirm')}
            </Button>
          </Form.Item>
        </Form>
      </AuthorizationWrapper>
    </>
  )
}

export default ChangePassword
