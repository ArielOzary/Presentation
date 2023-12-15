import React, { useEffect } from 'react'

import { Alert, Button, Form, Spin, Switch, message } from 'antd'
import cn from 'classnames'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'
import PhoneNumber from 'components/PhoneNumber'

import {
  BasicInfoSchemaType,
  useBasicInfoForm,
} from 'containers/Public/ForwarderSignUp/BasicInfo/hooks/basicInfoForm'

import DeleteProfile from '../Delete'
import Wrapper from '../Wrapper'

import { usePutOwnBasicInfo } from 'fetchers'
import { FreightForwarderBasicInfoDto } from 'models'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  data: FreightForwarderBasicInfoDto | undefined
  isLoading: boolean
  refetch: () => void
}

const BasicInfo: React.FC<Props> = ({ data, isLoading, refetch }) => {
  const { t } = useTranslation([
    'global',
    'freightForwardersManagement',
    'signUp',
  ])

  const [isEditing, setIsEditing] = useProfileStore(store => [
    store.isEditing,
    store.setIsEditing,
  ])

  const { renderInputControl } = useInputControl<BasicInfoSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<BasicInfoSchemaType>()
  const { renderSwitchControl } = useSwitchControl<BasicInfoSchemaType>()

  const { control, formState, handleSubmit, reset } = useBasicInfoForm()

  const { mutate, isLoading: putLoading, isError, error } = usePutOwnBasicInfo()

  const handleSuccess = () => {
    message.success(t('freightForwardersManagement:basicInfoUpdated'))
    setIsEditing(false)
    refetch()
  }

  const handleForm = (data: BasicInfoSchemaType) => {
    const { payment, air, ocean, customs, ...companyProfile } = data
    mutate(
      {
        companyProfile: { ...companyProfile, legalNumber: '' },
        providerInfo: { payment, air, ocean, customs },
      },
      { onSuccess: handleSuccess }
    )
  }

  useEffect(() => {
    data && reset({ ...data.companyProfile, ...data.providerInfo })
    setIsEditing(false)
  }, [data])

  useEffect(() => {
    data && reset({ ...data.companyProfile, ...data.providerInfo })
  }, [data, isEditing])

  return (
    <Wrapper>
      <p className={styles.title}>
        {t('freightForwardersManagement:basicInfoTab')}
      </p>
      <Spin spinning={isLoading}>
        {isEditing ? (
          <Alert
            message={t('freightForwardersManagement:editProfileWarning')}
            type="info"
            showIcon
          />
        ) : null}
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
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.companyNameEnglish')}
                </span>
                <span className={styles.field}>
                  {data?.companyProfile?.nameEn}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="nameEn"
                render={renderInputControl(
                  { label: t('signUp:basicInfo.companyNameEnglish') },
                  { placeholder: 'Company Name' }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.vatNumber')}
                </span>
                <span className={styles.field}>
                  {data?.companyProfile?.vatNumber}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="vatNumber"
                render={renderInputControl(
                  { label: t('signUp:basicInfo.vatNumber') },
                  { placeholder: 'שם חברה' }
                )}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.generalPhone')}
                </span>
                <PhoneNumber
                  number={data?.companyProfile?.phoneNumber}
                  className={styles.field}
                />
              </div>
            ) : (
              <Controller
                control={control}
                name="phoneNumber"
                render={renderInputPhoneControl({
                  label: t('signUp:basicInfo.generalPhone'),
                })}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.faxNumber')}
                </span>
                <span className={styles.field}>
                  {data?.companyProfile?.fax}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="fax"
                render={renderInputPhoneControl({
                  label: t('signUp:basicInfo.faxNumber'),
                })}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.email')}
                </span>
                <span className={styles.field}>
                  {data?.companyProfile?.email}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="email"
                render={renderInputControl(
                  { label: t('signUp:basicInfo.email') },
                  { placeholder: 'johndoe@gmail.com' }
                )}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.customs')}
                </span>
                <span className={styles.field}>
                  <Switch
                    checked={data?.providerInfo?.customs}
                    checkedChildren={t('global:yes')}
                    unCheckedChildren={t('global:no')}
                    disabled
                  />
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="customs"
                render={renderSwitchControl({
                  label: t('signUp:basicInfo.customs'),
                })}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.air')}
                </span>
                <span className={styles.field}>
                  <Switch
                    checked={data?.providerInfo?.air}
                    checkedChildren={t('global:yes')}
                    unCheckedChildren={t('global:no')}
                    disabled
                  />
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="air"
                render={renderSwitchControl({
                  label: t('signUp:basicInfo.air'),
                })}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.ocean')}
                </span>
                <span className={styles.field}>
                  <Switch
                    checked={data?.providerInfo?.ocean}
                    checkedChildren={t('global:yes')}
                    unCheckedChildren={t('global:no')}
                    disabled
                  />
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="ocean"
                render={renderSwitchControl({
                  label: t('signUp:basicInfo.ocean'),
                })}
              />
            )}
          </FormRow>
          {isEditing ? (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={putLoading || formState.isValidating}
                size="large"
                className={cn(styles.btn, 'bold')}
              >
                {t('global:saveChanges')}
              </Button>
            </Form.Item>
          ) : null}
        </Form>
        <DeleteProfile />
      </Spin>
    </Wrapper>
  )
}

export default BasicInfo
