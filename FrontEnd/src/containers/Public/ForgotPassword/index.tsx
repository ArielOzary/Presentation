import React from 'react'

import { Alert, Button, Form } from 'antd'
import { Helmet } from 'react-helmet'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import AuthorizationWrapper, {
  WrapperType,
} from 'components/AuthorizationWrapper'
import { useInputControl } from 'components/FormControls/hooks/inputControl'

import {
  ForgotPasswordSchemaType,
  useForgotPasswordForm,
} from './hooks/forgotPasswordForm'
import { useHandleRecoveryEmail } from './hooks/handleRecoveryEmail'

import { usePostPasswordRecovery } from 'fetchers'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation(['global', 'forgotPassword'])

  const { control, handleSubmit } = useForgotPasswordForm()
  const { renderInputControl } = useInputControl<ForgotPasswordSchemaType>()

  const {
    mutate,
    isLoading: isForgotPasswordLoading,
    isError,
    isSuccess,
    error,
    reset,
  } = usePostPasswordRecovery()

  const { isLoading: isRecoveryEmailLoading } = useHandleRecoveryEmail()

  const handleForm = (data: ForgotPasswordSchemaType) => {
    mutate(data)
  }

  const isLoading = isForgotPasswordLoading || isRecoveryEmailLoading

  return (
    <>
      <Helmet>
        <title>{t('forgotPassword:title')}</title>
      </Helmet>
      <AuthorizationWrapper
        type={WrapperType.SIGN_UP}
        sidebar={
          <div className={styles.sidebar}>
            <DeliveryIcon className={styles.icon} />
            <span className={styles.title}>
              {t('forgotPassword:restoreAccessTitle')}
            </span>
            <span className={styles.text}>
              {t('forgotPassword:restoreAccessDescription')}
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
          <span className={styles.title}>{t('forgotPassword:title')}</span>

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

          {isSuccess && (
            <Form.Item>
              <Alert
                message={t('forgotPassword:recoveryInstructions')}
                type="success"
                showIcon
              />
            </Form.Item>
          )}

          <Controller
            control={control}
            name="email"
            render={renderInputControl(
              { label: t('forgotPassword:label') },
              {
                placeholder: 'johndoe@gmail.com',
                disabled: isSuccess || isLoading,
              }
            )}
          />

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className="bold"
              disabled={isSuccess}
            >
              {t('send')}
            </Button>
          </Form.Item>
        </Form>
      </AuthorizationWrapper>
    </>
  )
}

export default ForgotPassword
