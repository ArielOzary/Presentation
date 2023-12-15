import React, { useCallback, useMemo } from 'react'

import { Alert, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import AuthorizationWrapper, {
  WrapperType,
} from 'components/AuthorizationWrapper'

import Stepper from '../../../components/AuthorizationWrapper/Stepper'
import CompanyInfo from './CompanyInfo'
import CompanyLocation from './CompanyLocation'
import ContactInfo from './ContactInfo'
import { useStep } from './hooks/useStep'

import { usePostRegistrationClient } from 'fetchers'
import { ClientRegistrationResponseDto } from 'models'
import { useClientSignUpStore } from 'stores/clientSignUp'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const SignUp: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'signUp'])
  const navigate = useNavigate()
  const getState = useClientSignUpStore(({ getState }) => getState)

  const { step, nextStep, prevStep } = useStep(0)

  const { mutate, isLoading, isError, error, reset } =
    usePostRegistrationClient()

  const handleSuccess = ({
    verificationToken = '',
  }: ClientRegistrationResponseDto) => {
    const sub = verificationToken.split(' ').join('+')

    navigate(`/verification?sub=${sub}`)
  }

  const handleFormSubmit = useCallback(() => {
    const { contactInfo, companyInfo, companyLocation } = getState()

    if (!contactInfo || !companyInfo || !companyLocation) {
      return
    }

    const dto = {
      company: companyInfo,
      contact: contactInfo,
      companyLocation: {
        ...companyLocation,
        comments: companyLocation.comments || '',
      },
    }

    mutate(dto, {
      onSuccess: handleSuccess,
    })
  }, [])

  const handleNextStep = useCallback(() => {
    if (step === 2) {
      handleFormSubmit()
      return
    }

    nextStep()
  }, [step])

  const steps = useMemo(
    () => [
      t('signUp:companyInfo.title'),
      t('signUp:contactInfo.title'),
      t('signUp:companyLocation.title'),
    ],
    [i18n.language]
  )

  return (
    <>
      <Helmet>
        <title>
          {t('global:signUp')} ({steps[step]})
        </title>
      </Helmet>
      <AuthorizationWrapper
        sidebar={
          <div className={styles.sidebar}>
            <DeliveryIcon className={styles.icon} />
            <span className={styles.title}>
              {t('signUp:step')} {step + 1}
            </span>
            <span className={styles.subtitle}>
              {t('signUp:tellUsAboutYourCompany')}
            </span>
            <Stepper current={step} steps={steps} />
          </div>
        }
        type={WrapperType.SIGN_UP}
      >
        <div className={styles.forms}>
          <span className={styles.title}>
            {t('signUp:createYourFreeAccount')}
          </span>
          <span className={styles.subtitle}>{steps[step]}</span>

          {isError && (
            <Alert
              className={styles.error}
              message={error.message}
              onClose={reset}
              type="error"
              showIcon
              closable
            />
          )}

          <Spin spinning={isLoading}>
            {step === 0 ? (
              <CompanyInfo onNext={handleNextStep} />
            ) : step === 1 ? (
              <ContactInfo onNext={handleNextStep} onPrev={prevStep} />
            ) : (
              <CompanyLocation onNext={handleNextStep} onPrev={prevStep} />
            )}
          </Spin>
        </div>
      </AuthorizationWrapper>
    </>
  )
}

export default SignUp
