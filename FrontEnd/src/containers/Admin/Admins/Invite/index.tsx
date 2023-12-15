import React, { useCallback, useState } from 'react'

import { Alert, Button, Form, Input, Modal, message } from 'antd'
import { Controller, UseControllerReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  ForgotPasswordSchemaType,
  useForgotPasswordForm,
} from 'containers/Public/ForgotPassword/hooks/forgotPasswordForm'

import { usePostRegistrationInviteAdmin } from 'fetchers/registration'
import { FormErrorMessage } from 'models'

import styles from './styles.module.scss'

const Invite: React.FC = () => {
  const { t } = useTranslation([
    'global',
    'adminsManagement',
    'freightForwardersManagement',
  ])

  const { control, handleSubmit, reset: resetForm } = useForgotPasswordForm()

  const { mutate, isLoading, isError, error, reset } =
    usePostRegistrationInviteAdmin()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClick = useCallback(() => {
    reset()
    setIsOpen(!isOpen)
  }, [])

  const handleCancel = useCallback(() => {
    resetForm()
    setIsOpen(false)
  }, [])

  const handleSuccess = () => {
    handleCancel()
    message.success(t('freightForwardersManagement:invitationSentSuccessfully'))
  }

  const handleForm = (data: ForgotPasswordSchemaType) => {
    mutate({ ...data }, { onSuccess: handleSuccess })
  }

  const renderEmailInput = useCallback(
    ({
      field,
      fieldState: { error },
    }: UseControllerReturn<ForgotPasswordSchemaType, 'email'>) => (
      <Form.Item
        label={t('global:email')}
        validateStatus={error && 'error'}
        help={error && t(error.message as FormErrorMessage)}
      >
        <Input {...field} placeholder="johndoe@gmail.com" />
      </Form.Item>
    ),
    []
  )

  return (
    <div className={styles.wrapper}>
      <Button
        type="primary"
        className="bold"
        size="large"
        onClick={handleClick}
      >
        {t('adminsManagement:addAdministrator')}
      </Button>
      <Modal
        open={isOpen}
        centered
        title={t('adminsManagement:inviteAdministrator')}
        onOk={handleSubmit(handleForm)}
        onCancel={handleCancel}
        okButtonProps={{ loading: isLoading }}
        className={styles.modal}
      >
        <Form className={styles.form}>
          {isError && (
            <Form.Item>
              <Alert message={error.message} type="error" showIcon />
            </Form.Item>
          )}
          <Controller
            control={control}
            name="email"
            render={renderEmailInput}
          />
        </Form>
      </Modal>
    </div>
  )
}

export default Invite
