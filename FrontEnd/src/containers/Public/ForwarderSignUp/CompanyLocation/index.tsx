import React, { useCallback, useMemo } from 'react'

import { Form, Typography } from 'antd'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormButtons from 'components/AuthorizationWrapper/FormButtons'
import FormEmailRow from 'components/AuthorizationWrapper/FormEmailRow'
import { useCheckboxControl } from 'components/FormControls/hooks/checkboxControl'
import { useInputControl } from 'components/FormControls/hooks/inputControl'
import { useTextAreaControl } from 'components/FormControls/hooks/textAreaControl'

import {
  ForwarderCompanyLocationSchemaType,
  useForwarderCompanyLocationForm,
} from './hooks/forwarderCompanyLocationForm'

import { useForwarderSingUpStore } from 'stores/forwarderSingUp'

import styles from './styles.module.scss'

interface Props {
  onNext: () => void
  onPrev: () => void
  isSuccess: boolean
  isLoading: boolean
}

const CompanyLocation: React.FC<Props> = ({
  onNext,
  onPrev,
  isSuccess,
  isLoading,
}) => {
  const { t, i18n } = useTranslation(['global', 'signUp'])

  const { companyLocation, setCompanyLocation } = useForwarderSingUpStore()
  const { control, formState, watch, handleSubmit, getValues } =
    useForwarderCompanyLocationForm({
      defaultValues: {
        termsAndConditions: true,
        ...(companyLocation || {}),
      },
    })
  const termsAndConditions = watch('termsAndConditions')

  const { renderInputControl } =
    useInputControl<ForwarderCompanyLocationSchemaType>()
  const { renderTextAreaControl } =
    useTextAreaControl<ForwarderCompanyLocationSchemaType>()
  const { renderCheckboxControl } =
    useCheckboxControl<ForwarderCompanyLocationSchemaType>()

  const handleForm = (data: ForwarderCompanyLocationSchemaType) => {
    setCompanyLocation(data)
    onNext()
  }

  const handlePrev = useCallback(() => {
    const data = getValues()
    setCompanyLocation(data)
    onPrev()
  }, [])

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
      disabled={isSuccess}
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
        disabled={isSuccess}
        disabledNext={!termsAndConditions}
        loading={isLoading || formState.isValidating}
      />
    </Form>
  )
}

export default CompanyLocation
