import React, { useEffect, useState } from 'react'

import { Button, Form, Spin, Switch, message } from 'antd'
import cn from 'classnames'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useSelectPortControl } from 'components/FormControls/hooks/selectPortControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'

import Wrapper from 'containers/FreightForwarder/Profile/Wrapper'

import {
  CompanyLocationWithoutTerms,
  useCompanyLocationWithoutTerms,
} from './hooks/companyLocationForm'

import { useGetPortById } from 'fetchers'
import { usePutOwnProfile } from 'fetchers/clients/putOwnProfile'
import { useProfileStore } from 'stores/userProfile'

import styles from './styles.module.scss'

interface Props {
  isLoading: boolean
  refetch: () => void
}

const CompanyLocation: React.FC<Props> = ({ isLoading, refetch }) => {
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

  const { mutate, isLoading: mutateLoading } = usePutOwnProfile()

  const [portName, setPortName] = useState<string | undefined>(undefined)
  const [portId, setPortId] = useState<number>(0)

  const { data, isLoading: portLoading } = useGetPortById(portId, {
    enabled: Boolean(portId) && !isEditing,
  })

  const { control, formState, handleSubmit, reset, watch, setValue } =
    useCompanyLocationWithoutTerms()

  const { renderInputControl } = useInputControl<CompanyLocationWithoutTerms>()
  const { renderSwitchControl } =
    useSwitchControl<CompanyLocationWithoutTerms>()
  const { renderSelectPortControl } =
    useSelectPortControl<CompanyLocationWithoutTerms>()
  const { renderTextAreaControl } =
    useTextAreaControl<CompanyLocationWithoutTerms>()

  const inLandByAutoLog = watch('inLandByAutoLog')

  const handleSuccess = () => {
    message.success(t('freightForwardersManagement:locationUpdated'))
    setIsEditing(false)
    refetch()
  }

  const handleForm = (formsData: CompanyLocationWithoutTerms) => {
    delete clientProfile?.totalProfit

    mutate(
      { ...clientProfile, companyLocation: formsData },
      {
        onSuccess: handleSuccess,
        onError: error => message.error(error.message),
      }
    )
  }

  useEffect(() => {
    setValue(
      'whoIsInChargeOfInLand',
      inLandByAutoLog
        ? 'Autolog'
        : clientProfile?.companyLocation?.whoIsInChargeOfInLand === 'Autolog'
        ? ''
        : clientProfile?.companyLocation?.whoIsInChargeOfInLand || ''
    )
  }, [inLandByAutoLog])

  useEffect(() => {
    setPortName(data?.name)
  }, [data])

  useEffect(() => {
    clientProfile?.companyLocation?.destinationPortId &&
      setPortId(clientProfile?.companyLocation?.destinationPortId)
  }, [clientProfile])

  useEffect(() => {
    clientProfile && reset(clientProfile.companyLocation)
    setIsEditing(false)
  }, [clientProfile])

  useEffect(() => {
    clientProfile && reset(clientProfile.companyLocation)
  }, [clientProfile, isEditing])

  return (
    <Wrapper>
      <p className={styles.title}>
        {t('freightForwardersManagement:companyLocationTab')}
      </p>
      <Spin spinning={isLoading || portLoading}>
        <Form
          onSubmitCapture={handleSubmit(handleForm)}
          layout="vertical"
          size="large"
          className={styles.form}
        >
          <FormEmailRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.mailingAddress')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyLocation?.mailingAddress}
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
                  {clientProfile?.companyLocation?.mailingApartment}
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
                  {clientProfile?.companyLocation?.mailingPostalCode}
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
                  {clientProfile?.companyLocation?.inLandAddress}
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
                  {clientProfile?.companyLocation?.inLandApartment}
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
                  {clientProfile?.companyLocation?.inLandPostalCode}
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
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.inlandMadeByAutolog')}
                </span>
                <span className={styles.field}>
                  <Switch
                    checked={clientProfile?.companyLocation?.inLandByAutoLog}
                    checkedChildren={t('global:yes')}
                    unCheckedChildren={t('global:no')}
                    disabled
                  />
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="inLandByAutoLog"
                render={renderSwitchControl({
                  label: t('signUp:companyLocation.inlandMadeByAutolog'),
                })}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.insurance')}
                </span>
                <span className={styles.field}>
                  <Switch
                    checked={clientProfile?.companyLocation?.insurance}
                    checkedChildren={t('global:yes')}
                    unCheckedChildren={t('global:no')}
                    disabled
                  />
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="insurance"
                render={renderSwitchControl({
                  label: t('signUp:companyLocation.insurance'),
                })}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.whoIsInChargeOfInLand')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyLocation?.whoIsInChargeOfInLand}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="whoIsInChargeOfInLand"
                render={renderInputControl(
                  { label: t('signUp:companyLocation.whoIsInChargeOfInLand') },
                  { disabled: inLandByAutoLog }
                )}
              />
            )}
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.portOfDestination')}
                </span>
                <span className={styles.field}>{portName}</span>
              </div>
            ) : (
              <Controller
                control={control}
                name="destinationPortId"
                render={renderSelectPortControl()}
              />
            )}
          </FormRow>
          <FormRow>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.customClearanceByAutolog')}
                </span>
                <span className={styles.field}>
                  <Switch
                    checked={clientProfile?.companyLocation?.insurance}
                    checkedChildren={t('global:yes')}
                    unCheckedChildren={t('global:no')}
                    disabled
                  />
                  {clientProfile?.companyLocation?.customClearenceByAutoLog}
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="customClearenceByAutoLog"
                render={renderSwitchControl({
                  label: t('signUp:companyLocation.customClearanceByAutolog'),
                })}
              />
            )}
            <div />
          </FormRow>
          <div className={styles.comment}>
            {!isEditing ? (
              <div className={styles.fieldBlock}>
                <span className={styles.label}>
                  {t('signUp:companyLocation.comments')}
                </span>
                <span className={styles.field}>
                  {clientProfile?.companyLocation?.comments}
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
          </div>
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
      </Spin>
    </Wrapper>
  )
}

export default CompanyLocation
