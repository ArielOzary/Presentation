import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { EditOutlined } from '@ant-design/icons'
import { Alert, Button, Form, message } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'
import Wrapper from 'components/ForwarderTabsWrapper'

import {
  ForwarderProfileLocationSchemaType,
  useForwarderProfileLocationForm,
} from './hooks/profileLocationForm'

import {
  useGetFreightForwarderProfileLocation,
  usePutFreightForwarderProfileLocation,
} from 'fetchers'

import styles from './styles.module.scss'

const CompanyLocation: React.FC = () => {
  const { t } = useTranslation([
    'global',
    'signUp',
    'freightForwardersManagement',
  ])
  const params = useParams<{ id: string }>()

  const [isEditing, setIsEditing] = useState(false)

  const {
    data: location,
    isLoading: isLocationLoading,
    refetch: refetchLocation,
  } = useGetFreightForwarderProfileLocation(params.id || '')
  const {
    mutate,
    isLoading: isUpdateLoading,
    error,
    isError,
  } = usePutFreightForwarderProfileLocation()

  const { control, handleSubmit, reset } = useForwarderProfileLocationForm()

  const { renderInputControl } =
    useInputControl<ForwarderProfileLocationSchemaType>()
  const { renderTextAreaControl } =
    useTextAreaControl<ForwarderProfileLocationSchemaType>()

  const handleSuccess = useCallback(() => {
    message.success(t('freightForwardersManagement:locationUpdated'))

    refetchLocation()
    setIsEditing(false)
  }, [])

  const handleForm = useCallback((data: ForwarderProfileLocationSchemaType) => {
    mutate(
      {
        dto: { companyLocation: { ...data, comments: data.comments || '' } },
        id: params.id || '',
      },
      {
        onSuccess: handleSuccess,
      }
    )
  }, [])

  const handleEditToggle = useCallback(() => {
    setIsEditing(isEditing => !isEditing)
  }, [])

  useEffect(() => {
    if (location) {
      reset(location.companyLocation || {})
    } else {
      reset({})
    }
  }, [location])

  const isLoading = useMemo(
    () => isLocationLoading || isUpdateLoading,
    [isLocationLoading, isUpdateLoading]
  )

  return (
    <div className={styles.wrapper}>
      <Wrapper>
        <div className={styles.header}>
          <p className={styles.title}>{t('signUp:companyLocation.title')}</p>
          <Button
            onClick={handleEditToggle}
            className={styles.editToggleBtn}
            icon={<EditOutlined />}
            size="large"
            type="text"
          />
        </div>
        <Form
          onSubmitCapture={handleSubmit(handleForm)}
          layout="vertical"
          size="large"
          className={styles.form}
          disabled={!isEditing}
        >
          {isError && (
            <Form.Item>
              <Alert message={error.message} type="error" showIcon />
            </Form.Item>
          )}
          <FormEmailRow>
            <Controller
              control={control}
              name="mailingAddress"
              render={renderInputControl(
                { label: t('signUp:companyLocation.mailingAddress') },
                { placeholder: 'Shpigelman 16, Netanya' }
              )}
            />
            <Controller
              control={control}
              name="mailingApartment"
              render={renderInputControl(
                { label: t('signUp:companyLocation.apartment') },
                { placeholder: '5', maxLength: 5 }
              )}
            />
            <Controller
              control={control}
              name="mailingPostalCode"
              render={renderInputControl(
                { label: t('signUp:companyLocation.postalCode') },
                { placeholder: '40300', maxLength: 5 }
              )}
            />
          </FormEmailRow>

          <FormEmailRow>
            <Controller
              control={control}
              name="inLandAddress"
              render={renderInputControl(
                { label: t('signUp:companyLocation.inLandAddress') },
                { placeholder: 'Florentine 20, Tel Aviv' }
              )}
            />
            <Controller
              control={control}
              name="inLandApartment"
              render={renderInputControl(
                { label: t('signUp:companyLocation.apartment') },
                { placeholder: '7', maxLength: 5 }
              )}
            />
            <Controller
              control={control}
              name="inLandPostalCode"
              render={renderInputControl(
                { label: t('signUp:companyLocation.postalCode') },
                { placeholder: '40300', maxLength: 5 }
              )}
            />
          </FormEmailRow>

          <div className={styles.comment}>
            <Controller
              control={control}
              name="comments"
              render={renderTextAreaControl(
                { label: t('signUp:companyLocation.comments') },
                {
                  autoSize: { minRows: 2, maxRows: 6 },
                  maxLength: 100,
                  showCount: true,
                }
              )}
            />
          </div>
          {isEditing && (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className={styles.btn}
                size="large"
              >
                {t('global:saveChanges')}
              </Button>
            </Form.Item>
          )}
        </Form>
      </Wrapper>
    </div>
  )
}

export default CompanyLocation
