import React, { useEffect } from 'react'

import { Alert, Button, Form, Spin, message } from 'antd'
import cn from 'classnames'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'

import {
  ForwarderProfileLocationSchemaType,
  useForwarderProfileLocationForm,
} from 'containers/Admin/FreightForwarders/CompanyLocation/hooks/profileLocationForm'

import Wrapper from '../Wrapper'

import { useGetOwnLocation, usePutOwnLocation } from 'fetchers'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

const CompanyLocation: React.FC = () => {
  const { t } = useTranslation([
    'global',
    'signUp',
    'freightForwardersManagement',
  ])

  const { data, isLoading, refetch } = useGetOwnLocation()
  const { mutate, isLoading: putLoading, isError, error } = usePutOwnLocation()

  const [isEditing, setIsEditing] = useProfileStore(store => [
    store.isEditing,
    store.setIsEditing,
  ])
  const { control, formState, handleSubmit, reset } =
    useForwarderProfileLocationForm()

  const { renderInputControl } =
    useInputControl<ForwarderProfileLocationSchemaType>()
  const { renderTextAreaControl } =
    useTextAreaControl<ForwarderProfileLocationSchemaType>()

  const handleSuccess = () => {
    message.success(t('freightForwardersManagement:locationUpdated'))
    setIsEditing(false)
    refetch()
  }

  const handleForm = (data: ForwarderProfileLocationSchemaType) => {
    mutate({ companyLocation: data }, { onSuccess: handleSuccess })
  }

  useEffect(() => {
    data && reset({ ...data.companyLocation })
    setIsEditing(false)
  }, [data])

  useEffect(() => {
    data && reset({ ...data.companyLocation })
  }, [data, isEditing])

  return (
    <Wrapper>
      <p className={styles.title}>
        {t('freightForwardersManagement:companyLocationTab')}
      </p>
      <Spin spinning={isLoading}>
        <Form
          onSubmitCapture={handleSubmit(handleForm)}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          {isError && (
            <Form.Item>
              <Alert message={error.message} type="error" showIcon />
            </Form.Item>
          )}
          <FormEmailRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.mailingAddress')}
                </span>
                <span className={styles.field}>
                  {data?.companyLocation?.mailingAddress}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="mailingAddress"
                render={renderInputControl(
                  { label: t('signUp:companyLocation.mailingAddress') },
                  { placeholder: 'Shpigelman 16, Netanya' }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.apartment')}
                </span>
                <span className={styles.field}>
                  {data?.companyLocation?.mailingApartment}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="mailingApartment"
                render={renderInputControl(
                  { label: t('signUp:companyLocation.apartment') },
                  { placeholder: '5', maxLength: 5 }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.postalCode')}
                </span>
                <span className={styles.field}>
                  {data?.companyLocation?.mailingPostalCode}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="mailingPostalCode"
                render={renderInputControl(
                  { label: t('signUp:companyLocation.postalCode') },
                  { placeholder: '40300', maxLength: 5 }
                )}
              />
            )}
          </FormEmailRow>

          <FormEmailRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.inLandAddress')}
                </span>
                <span className={styles.field}>
                  {data?.companyLocation?.inLandAddress}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="inLandAddress"
                render={renderInputControl(
                  { label: t('signUp:companyLocation.inLandAddress') },
                  { placeholder: 'Florentine 20, Tel Aviv' }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.apartment')}
                </span>
                <span className={styles.field}>
                  {data?.companyLocation?.inLandApartment}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="inLandApartment"
                render={renderInputControl(
                  { label: t('signUp:companyLocation.apartment') },
                  { placeholder: '7', maxLength: 5 }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.postalCode')}
                </span>
                <span className={styles.field}>
                  {data?.companyLocation?.inLandPostalCode}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="inLandPostalCode"
                render={renderInputControl(
                  { label: t('signUp:companyLocation.postalCode') },
                  { placeholder: '40300', maxLength: 5 }
                )}
              />
            )}
          </FormEmailRow>
          {!isEditing ? (
            <div className={styles.fieldBlock}>
              <span className={styles.label}>
                {t('signUp:companyLocation.comments')}
              </span>
              <span className={styles.field}>
                {data?.companyLocation?.comments || '-'}
              </span>
            </div>
          ) : (
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
          )}
          {isEditing ? (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={putLoading || formState.isValidating}
                size="large"
                className={cn('bold', styles.btn)}
              >
                {t('global:saveChanges')}
              </Button>
            </Form.Item>
          ) : null}
        </Form>
      </Spin>
    </Wrapper>
  )
}

export default CompanyLocation
