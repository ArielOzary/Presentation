import React, { useEffect } from 'react'

import { Alert, Button, Form } from 'antd'
import { Helmet } from 'react-helmet'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import AuthorizationWrapper from 'components/AuthorizationWrapper'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPasswordControl } from 'components/FormControls/hooks/inputPasswordControl'

import { useAuth } from './hooks/auth'
import { SignInSchemaType, useSignInForm } from './hooks/signInForm'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const SignIn: React.FC = () => {
  const { t } = useTranslation(['global', 'signIn'])

  const { control, handleSubmit, setError } = useSignInForm()
  const { renderInputControl } = useInputControl<SignInSchemaType>()
  const { renderInputPasswordControl } =
    useInputPasswordControl<SignInSchemaType>()

  const { handleSignIn, reset, isLoading, error } = useAuth()

  useEffect(() => {
    if (error?.response && Array.isArray(error.response)) {
      error.response.forEach(({ prop, message }) => setError(prop, { message }))
    }
  }, [error])

  return (
    <>
      <Helmet>
        <title>{t('global:signIn')}</title>
      </Helmet>
      <AuthorizationWrapper
        sidebar={
          <div className={styles.sidebar}>
            <DeliveryIcon className={styles.icon} />
            <span className={styles.title}>{t('signIn:welcomeBack')}</span>
            <span className={styles.text}>{t('signIn:momentsAway')}</span>
          </div>
        }
      >
        <Form
          onSubmitCapture={handleSubmit(handleSignIn)}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          <span className={styles.title}>{t('signIn:login')}</span>

          {error && (
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
            name="email"
            render={renderInputControl(
              { label: t('email') },
              { placeholder: 'johndoe@gmail.com' }
            )}
          />
          <Controller
            control={control}
            name="password"
            render={renderInputPasswordControl({ label: t('password') })}
          />
          <Form.Item>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              {t('signIn:forgotPassword')}
            </Link>
          </Form.Item>
          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className="bold"
            >
              {t('send')}
            </Button>
          </Form.Item>
        </Form>
      </AuthorizationWrapper>
    </>
  )
}

export default SignIn
