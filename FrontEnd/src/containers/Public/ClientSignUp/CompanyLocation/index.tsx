import React, { useCallback, useEffect, useMemo } from 'react'

import { Form, Typography } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormButtons from 'components/AuthorizationWrapper/FormButtons'
import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import FormRow from 'components/AuthorizationWrapper/FormRow'
import { useCheckboxControl } from 'components/FormControls/hooks/checkboxControl'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useSelectPortControl } from 'components/FormControls/hooks/selectPortControl'
import { useSwitchControl } from 'components/FormControls/hooks/switchControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'

import {
  CompanyLocationSchemaType,
  useCompanyLocationForm,
} from './hooks/companyLocationForm'

import { useClientSignUpStore } from 'stores/clientSignUp'

import styles from './styles.module.scss'

interface Props {
  onNext: () => void
  onPrev: () => void
}

const CompanyLocation: React.FC<Props> = ({ onNext, onPrev }) => {
  const { t, i18n } = useTranslation(['global', 'signUp'])
  const { companyLocation, setCompanyLocation } = useClientSignUpStore()

  const { control, handleSubmit, getValues, setValue, watch } =
    useCompanyLocationForm({
      defaultValues: {
        insurance: false,
        inLandByAutoLog: false,
        customClearenceByAutoLog: false,
        termsAndConditions: true,
        ...(companyLocation || {}),
      },
    })
  const inLandByAutoLog = watch('inLandByAutoLog')
  const termsAndConditions = watch('termsAndConditions')

  const { renderInputControl } = useInputControl<CompanyLocationSchemaType>()
  const { renderSwitchControl } = useSwitchControl<CompanyLocationSchemaType>()
  const { renderSelectPortControl } =
    useSelectPortControl<CompanyLocationSchemaType>()
  const { renderTextAreaControl } =
    useTextAreaControl<CompanyLocationSchemaType>()
  const { renderCheckboxControl } =
    useCheckboxControl<CompanyLocationSchemaType>()

  const handleForm = (data: CompanyLocationSchemaType) => {
    setCompanyLocation(data)
    onNext()
  }

  const handlePrev = useCallback(() => {
    const data = getValues()
    setCompanyLocation(data)
    onPrev()
  }, [])

  useEffect(() => {
    setValue(
      'whoIsInChargeOfInLand',
      inLandByAutoLog
        ? 'Autolog'
        : companyLocation?.whoIsInChargeOfInLand === 'Autolog'
        ? ''
        : companyLocation?.whoIsInChargeOfInLand || ''
    )
  }, [inLandByAutoLog])

  const termsAndConditionsText = useMemo(
    () => (
      <>
        <Typography.Text>
          {t('signUp:companyLocation.readAndAgreed')}
        </Typography.Text>{' '}
        <Typography.Link href="/terms" target="_blank">
          {t('signUp:companyLocation.termsAndConditions')}
        </Typography.Link>
      </>
    ),
    [i18n.language]
  )

  return (
    <Form
      onSubmitCapture={handleSubmit(handleForm)}
      layout="vertical"
      size="large"
      className={styles.form}
    >
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

      <FormRow>
        <Controller
          control={control}
          name="inLandByAutoLog"
          render={renderSwitchControl({
            label: t('signUp:companyLocation.inlandMadeByAutolog'),
          })}
        />
        <Controller
          control={control}
          name="insurance"
          render={renderSwitchControl({
            label: t('signUp:companyLocation.insurance'),
          })}
        />
      </FormRow>

      <FormRow>
        <Controller
          control={control}
          name="whoIsInChargeOfInLand"
          render={renderInputControl(
            { label: t('signUp:companyLocation.whoIsInChargeOfInLand') },
            { disabled: inLandByAutoLog }
          )}
        />
        <Controller
          control={control}
          name="destinationPortId"
          render={renderSelectPortControl()}
        />
      </FormRow>

      <FormRow>
        <Controller
          control={control}
          name="customClearenceByAutoLog"
          render={renderSwitchControl({
            label: t('signUp:companyLocation.customClearanceByAutolog'),
          })}
        />
        <div />
      </FormRow>

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

      <div className={styles.termsCheckbox}>
        <Controller
          control={control}
          name="termsAndConditions"
          render={renderCheckboxControl(
            {},
            {
              children: termsAndConditionsText,
            }
          )}
        />
      </div>

      <FormButtons
        onPrev={handlePrev}
        nextText={t('global:create')}
        disabledNext={!termsAndConditions}
      />
    </Form>
  )
}

export default CompanyLocation
