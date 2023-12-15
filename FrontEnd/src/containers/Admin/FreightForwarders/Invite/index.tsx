import React, { useCallback, useState } from 'react'

import { Alert, Button, Form, Modal, message } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useInputControl } from 'components/FormControls/hooks/inputControl'

import {
  ForgotPasswordSchemaType,
  useForgotPasswordForm,
} from 'containers/Public/ForgotPassword/hooks/forgotPasswordForm'

import { usePostRegistrationInviteFreightForwarder } from 'fetchers'

import styles from './styles.module.scss'

const Invite: React.FC = () => {
  const { t } = useTranslation(['global', 'freightForwardersManagement'])

  const { control, handleSubmit, reset: resetForm } = useForgotPasswordForm()
  const { renderInputControl } = useInputControl<ForgotPasswordSchemaType>()

  const { mutate, reset, isLoading, isError, error } =
    usePostRegistrationInviteFreightForwarder()

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

  return (
    <div className={styles.wrapper}>
      <Button
        type="primary"
        className="bold"
        size="large"
        onClick={handleClick}
      >
        {t('freightForwardersManagement:addFreightForwarder')}
      </Button>
      <Modal
        open={isOpen}
        centered
        title={t('freightForwardersManagement:inviteForwarder')}
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
            render={renderInputControl(
              { label: t('global:email') },
              { placeholder: 'johndoe@gmail.com' }
            )}
          />
        </Form>
      </Modal>
    </div>
  )
}

export default Invite
