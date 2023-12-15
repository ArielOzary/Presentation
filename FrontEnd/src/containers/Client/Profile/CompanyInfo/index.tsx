import React, { useEffect } from 'react'

import { Alert, Button, Form, Spin, message } from 'antd'
import cn from 'classnames'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useSelectIndustryControl } from 'components/FormControls/hooks/selectIndustryControl'

import DeleteProfile from 'containers/FreightForwarder/Profile/Delete'
import Wrapper from 'containers/FreightForwarder/Profile/Wrapper'

import {
  CompanyInfoWithoutPassword,
  useCompanyInfoWithoutPassword,
} from './hooks/companyInfoForm'

import { useGetIndustryTypes } from 'fetchers'
import { usePutOwnProfile } from 'fetchers/clients/putOwnProfile'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  isLoading: boolean
  refetch: () => void
}

const CompanyInfo: React.FC<Props> = ({ isLoading, refetch }) => {
  const { t } = useTranslation([
    'global',
    'freightForwardersManagement',
    'clientProfile',
    'signUp',
  ])

  const [isEditing, clientProfile, setIsEditing] = useProfileStore(store => [
    store.isEditing,
    store.clientProfile,
    store.setIsEditing,
  ])

  const { data: industries, isLoading: industryLoading } = useGetIndustryTypes()
  const { mutate, isLoading: mutateLoading } = usePutOwnProfile()

  const industry = industries?.find(
    it => it.id === clientProfile?.companyProfile?.industryTypeId
  )?.name

  const { control, formState, handleSubmit, reset } =
    useCompanyInfoWithoutPassword()

  const { renderInputControl } = useInputControl<CompanyInfoWithoutPassword>()
  const { renderSelectIndustryControl } =
    useSelectIndustryControl<CompanyInfoWithoutPassword>()

  const handleSuccess = () => {
    message.success(t('clientProfile:companyInfoUpdated'))
    setIsEditing(false)
    refetch()
  }

  const handleForm = (formsData: CompanyInfoWithoutPassword) => {
    delete clientProfile?.totalProfit

    mutate(
      { ...clientProfile, companyProfile: formsData },
      {
        onSuccess: handleSuccess,
        onError: error => message.error(error.message),
      }
    )
  }

  useEffect(() => {
    clientProfile && reset(clientProfile.companyProfile)
    setIsEditing(false)
  }, [clientProfile])

  useEffect(() => {
    clientProfile && reset({ ...clientProfile.companyProfile })
  }, [clientProfile, isEditing])

  return (
    <Wrapper>
      <p className={styles.title}>{t('signUp:companyInfo.title')}</p>
      <Spin spinning={isLoading || industryLoading}>
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
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:basicInfo.companyNameEnglish')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyProfile?.nameEn}
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
                  {t('signUp:companyInfo.companyNameHebrew')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyProfile?.nameHe}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="nameHe"
                render={renderInputControl(
                  { label: t('signUp:companyInfo.companyNameHebrew') },
                  { placeholder: 'שם חברה', style: { textAlign: 'right' } }
                )}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyInfo.industry')}
                </span>
                <span className={styles.field}>{industry}</span>
              </div>
            ) : (
              <Controller
                control={control}
                name="industryTypeId"
                render={renderSelectIndustryControl()}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyInfo.legalNumber')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyProfile?.legalNumber}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="legalNumber"
                render={renderInputControl(
                  { label: t('signUp:companyInfo.legalNumber') },
                  { placeholder: '305931782' }
                )}
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
                  {clientProfile?.companyProfile?.email}
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
          {isEditing ? (
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={mutateLoading || formState.isValidating}
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

export default CompanyInfo
