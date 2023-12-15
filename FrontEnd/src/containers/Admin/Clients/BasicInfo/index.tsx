import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { EditOutlined } from '@ant-design/icons'
import { Button, Card, Form, Spin, Typography, message } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useInputPhoneControl } from 'components/FormControls/hooks/inputPhoneControl'
import { useSelectIndustryControl } from 'components/FormControls/hooks/selectIndustryControl'
import { useSelectPortControl } from 'components/FormControls/hooks/selectPortControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'

import RejectButton from './RejectButton'
import {
  ClientProfileSchemaType,
  convertClientProfileToForm,
  useClientProfileForm,
} from './hooks/basicInfoForm'

import {
  useGetClientProfile,
  useGetUserById,
  usePutClientProfile,
} from 'fetchers'
import { UpdateClientProfileCommand, UserVerificationStatus } from 'models'

import styles from './styles.module.scss'

interface Props {
  refetchList: () => void
}

const BasicInfo: React.FC<Props> = ({ refetchList }) => {
  const { t } = useTranslation(['global', 'signUp', 'clientsManagement'])
  const params = useParams<{ id: string }>()

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useGetClientProfile(
    { id: params.id || '' },
    {
      enabled: Boolean(params.id),
    }
  )
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetUserById(params.id || '', {
    enabled: Boolean(params.id),
  })

  const { mutate, isLoading: isUpdateLoading } = usePutClientProfile()

  const { control, handleSubmit, setValue, watch, reset } =
    useClientProfileForm({
      defaultValues: convertClientProfileToForm(profile),
    })

  const inLandByAutoLog = watch('companyLocation.inLandByAutoLog')

  const { renderInputControl } = useInputControl<ClientProfileSchemaType>()
  const { renderSelectIndustryControl } =
    useSelectIndustryControl<ClientProfileSchemaType>()
  const { renderInputPhoneControl } =
    useInputPhoneControl<ClientProfileSchemaType>()
  const { renderSwitchControl } = useSwitchControl<ClientProfileSchemaType>()
  const { renderSelectPortControl } =
    useSelectPortControl<ClientProfileSchemaType>()
  const { renderTextAreaControl } =
    useTextAreaControl<ClientProfileSchemaType>()

  const handleEditToggle = useCallback(
    () => setIsEditing(isEditing => !isEditing),
    []
  )

  const handleForm = ({
    companyProfile,
    companyContact,
    companyLocation,
  }: ClientProfileSchemaType) => {
    if (!params.id || !profile) {
      return
    }

    const dto: UpdateClientProfileCommand = {
      companyProfile,
      companyContact: {
        ...companyContact,
        id: profile?.companyContact?.id,
        contactType: profile?.companyContact?.contactType,
      },
      companyLocation: {
        ...companyLocation,
        comments: companyLocation.comments || '',
      },
    }

    mutate(
      { id: params.id, dto },
      {
        onSuccess: () => {
          message.success(t('clientsManagement:basicInformationUpdated'))

          handleEditToggle()
          refetchProfile()
          refetchList()
        },
      }
    )
  }

  const onSuccessReject = useCallback(() => {
    refetchUser()
    refetchList()
    setIsEditing(false)
  }, [])

  useEffect(() => {
    reset(convertClientProfileToForm(profile))
  }, [profile])

  useEffect(() => {
    setValue(
      'companyLocation.whoIsInChargeOfInLand',
      inLandByAutoLog
        ? 'Autolog'
        : profile?.companyLocation?.whoIsInChargeOfInLand || ''
    )
  }, [inLandByAutoLog])

  const isLoading = useMemo(
    () => isUserLoading || isProfileLoading || isUpdateLoading,
    [isUserLoading, isProfileLoading, isUpdateLoading]
  )

  return user && profile ? (
    <Card>
      <div className={styles.header}>
        <span className={styles.title}>{t('signUp:companyInfo.title')}</span>
        {user.status !== UserVerificationStatus.Rejected && (
          <Button
            onClick={handleEditToggle}
            className={styles.editToggleBtn}
            icon={<EditOutlined />}
            size="large"
            type="text"
          />
        )}
      </div>
      <Form
        layout="vertical"
        onFinish={handleSubmit(handleForm)}
        disabled={!isEditing || isLoading}
      >
        <FormRow>
          <Controller
            control={control}
            name="companyProfile.nameEn"
            render={renderInputControl(
              { label: t('signUp:companyInfo.companyNameEnglish') },
              { placeholder: 'Company Name' }
            )}
          />
          <Controller
            control={control}
            name="companyProfile.nameHe"
            render={renderInputControl(
              { label: t('signUp:companyInfo.companyNameHebrew') },
              { placeholder: 'שם חברה', style: { textAlign: 'right' } }
            )}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="companyProfile.industryTypeId"
            render={renderSelectIndustryControl()}
          />
          <Controller
            control={control}
            name="companyProfile.legalNumber"
            render={renderInputControl(
              { label: t('signUp:companyInfo.legalNumber') },
              { placeholder: '305931782' }
            )}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="companyProfile.email"
            render={renderInputControl(
              { label: t('global:email') },
              { placeholder: 'johndoe@gmail.com' }
            )}
          />
        </FormRow>
        <Form.Item className={styles.subTitle}>
          <span className={styles.title}>{t('signUp:contactInfo.title')}</span>
        </Form.Item>
        <FormRow>
          <Controller
            control={control}
            name="companyContact.name"
            render={renderInputControl(
              { label: t('signUp:contactInfo.contactName') },
              { placeholder: 'John Doe' }
            )}
          />
          <Controller
            control={control}
            name="companyContact.phoneNumber"
            render={renderInputPhoneControl({
              label: t('signUp:contactInfo.phoneNumber'),
            })}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="companyContact.email"
            render={renderInputControl(
              { label: t('signUp:contactInfo.contactEmail') },
              { placeholder: 'johndoe@gmail.com' }
            )}
          />
          <Controller
            control={control}
            name="companyContact.jobTitle"
            render={renderInputControl(
              { label: t('signUp:contactInfo.jobTitle') },
              { placeholder: 'Head Of Operations' }
            )}
          />
        </FormRow>
        <Form.Item className={styles.subTitle}>
          <span className={styles.title}>
            {t('signUp:companyLocation.title')}
          </span>
        </Form.Item>
        <FormEmailRow>
          <Controller
            control={control}
            name="companyLocation.mailingAddress"
            render={renderInputControl(
              { label: t('signUp:companyLocation.mailingAddress') },
              { placeholder: 'Shpigelman 16, Netanya' }
            )}
          />
          <Controller
            control={control}
            name="companyLocation.mailingApartment"
            render={renderInputControl(
              { label: t('signUp:companyLocation.apartment') },
              { placeholder: '5', maxLength: 5 }
            )}
          />
          <Controller
            control={control}
            name="companyLocation.mailingPostalCode"
            render={renderInputControl(
              { label: t('signUp:companyLocation.postalCode') },
              { placeholder: '40300', maxLength: 5 }
            )}
          />
        </FormEmailRow>
        <FormEmailRow>
          <Controller
            control={control}
            name="companyLocation.inLandAddress"
            render={renderInputControl(
              { label: t('signUp:companyLocation.inLandAddress') },
              { placeholder: 'Florentine 20, Tel Aviv' }
            )}
          />
          <Controller
            control={control}
            name="companyLocation.inLandApartment"
            render={renderInputControl(
              { label: t('signUp:companyLocation.apartment') },
              { placeholder: '7', maxLength: 5 }
            )}
          />
          <Controller
            control={control}
            name="companyLocation.inLandPostalCode"
            render={renderInputControl(
              { label: t('signUp:companyLocation.postalCode') },
              { placeholder: '40300', maxLength: 5 }
            )}
          />
        </FormEmailRow>
        <FormRow>
          <Controller
            control={control}
            name="companyLocation.inLandByAutoLog"
            render={renderSwitchControl({
              label: t('signUp:companyLocation.inlandMadeByAutolog'),
            })}
          />
          <Controller
            control={control}
            name="companyLocation.insurance"
            render={renderSwitchControl({
              label: t('signUp:companyLocation.insurance'),
            })}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="companyLocation.whoIsInChargeOfInLand"
            render={renderInputControl(
              { label: t('signUp:companyLocation.whoIsInChargeOfInLand') },
              { disabled: inLandByAutoLog || undefined }
            )}
          />
          <Controller
            control={control}
            name="companyLocation.destinationPortId"
            render={renderSelectPortControl()}
          />
        </FormRow>
        <FormRow>
          <Controller
            control={control}
            name="companyLocation.customClearenceByAutoLog"
            render={renderSwitchControl({
              label: t('signUp:companyLocation.customClearanceByAutolog'),
            })}
          />
        </FormRow>
        <Controller
          control={control}
          name="companyLocation.comments"
          render={renderTextAreaControl(
            { label: t('signUp:companyLocation.comments') },
            {
              autoSize: { minRows: 2, maxRows: 6 },
              maxLength: 100,
              showCount: true,
            }
          )}
        />
        {user.status === UserVerificationStatus.Rejected && (
          <Typography.Text className={styles.rejected}>
            {t('global:clientWasRejected')}
          </Typography.Text>
        )}
        <div className={styles.buttons}>
          <RejectButton user={user} onSuccess={onSuccessReject} />
          {isEditing && (
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="bold"
              size="large"
            >
              {t('global:saveChanges')}
            </Button>
          )}
        </div>
      </Form>
    </Card>
  ) : (
    <Spin spinning={isLoading} />
  )
}

export default BasicInfo
