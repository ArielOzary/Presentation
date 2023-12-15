import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { EditOutlined } from '@ant-design/icons'
import { Alert, Button, Form, message } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'
import Wrapper from 'components/ForwarderTabsWrapper'

import {
  BasicInfoSchemaType,
  useBasicInfoForm,
} from 'containers/Public/ForwarderSignUp/BasicInfo/hooks/basicInfoForm'

import {
  useGetFreightForwarderProfileBasicInfo,
  usePutFreightForwardersProfileBasicInfo,
} from 'fetchers'

import styles from './styles.module.scss'

interface Props {
  refetchList: () => void
}

const BasicInfo: React.FC<Props> = ({ refetchList }) => {
  const { t, i18n } = useTranslation([
    'global',
    'signUp',
    'freightForwardersManagement',
  ])
  const params = useParams<{ id: string }>()

  const [isEditing, setIsEditing] = useState(false)

  const {
    data: basicInfo,
    isLoading: isBasicInfoLoading,
    refetch: refetchBasicInfo,
  } = useGetFreightForwarderProfileBasicInfo(params.id || '')

  const {
    mutate,
    isLoading: isUpdateLoading,
    isError,
    error,
  } = usePutFreightForwardersProfileBasicInfo()

  const { control, handleSubmit, reset } = useBasicInfoForm()
  const { renderInputControl } = useInputControl<BasicInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<BasicInfoSchemaType>()
  const { renderSwitchControl } = useSwitchControl<BasicInfoSchemaType>()

  const handleSuccess = useCallback(() => {
    message.success(t('freightForwardersManagement:basicInfoUpdated'))

    setIsEditing(false)
    refetchBasicInfo()
    refetchList()
  }, [i18n.language])

  const handleForm = (data: BasicInfoSchemaType) => {
    const { payment, air, ocean, customs, ...companyProfile } = data

    mutate(
      {
        id: params.id || '',
        dto: {
          companyProfile: { ...companyProfile, legalNumber: '' },
          providerInfo: { payment, air, ocean, customs },
        },
      },
      {
        onSuccess: handleSuccess,
      }
    )
  }

  const handleEditToggle = useCallback(() => {
    setIsEditing(isEditing => !isEditing)
  }, [])

  useEffect(() => {
    if (basicInfo) {
      reset({ ...basicInfo.companyProfile, ...basicInfo.providerInfo })
    } else {
      reset({})
    }
  }, [basicInfo])

  const isLoading = useMemo(
    () => isBasicInfoLoading || isUpdateLoading,
    [isBasicInfoLoading, isUpdateLoading]
  )

  return (
    <Wrapper>
      <div className={styles.header}>
        <p className={styles.title}>{t('signUp:basicInfo.title')}</p>
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
        <FormRow>
          <Controller
            control={control}
            name="nameEn"
            render={renderInputControl(
              { label: t('signUp:basicInfo.companyNameEnglish') },
              { placeholder: 'Company Name' }
            )}
          />
          <Controller
            control={control}
            name="vatNumber"
            render={renderInputControl(
              { label: t('signUp:basicInfo.vatNumber') },
              { placeholder: 'שם חברה' }
            )}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="phoneNumber"
            render={renderInputPhoneControl({
              label: t('signUp:basicInfo.generalPhone'),
            })}
          />
          <Controller
            control={control}
            name="fax"
            render={renderInputPhoneControl({
              label: t('signUp:basicInfo.faxNumber'),
            })}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="email"
            render={renderInputControl(
              { label: t('signUp:basicInfo.email') },
              { placeholder: 'johndoe@gmail.com' }
            )}
          />
          <div />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="customs"
            render={renderSwitchControl({
              label: t('signUp:basicInfo.customs'),
            })}
          />
          <Controller
            control={control}
            name="air"
            render={renderSwitchControl({ label: t('signUp:basicInfo.air') })}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="ocean"
            render={renderSwitchControl({ label: t('signUp:basicInfo.ocean') })}
          />
          <Controller
            control={control}
            name="payment"
            render={renderSwitchControl(
              {
                label: t('signUp:basicInfo.payment'),
              },
              { disabled: true }
            )}
          />
        </FormRow>
        {isEditing ? (
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
        ) : null}
      </Form>
    </Wrapper>
  )
}

export default BasicInfo
