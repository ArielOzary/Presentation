import React, { useCallback, useEffect, useMemo } from 'react'

import { Alert, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import AuthorizationWrapper, {
  WrapperType,
} from 'components/AuthorizationWrapper'
import Stepper from 'components/AuthorizationWrapper/Stepper'

import { useStep } from '../ClientSignUp/hooks/useStep'
import BasicInfo from './BasicInfo'
import CompanyLocation from './CompanyLocation'
import ContactsInfo from './ContactInfo'

import { usePostRegistrationFreightForwarder } from 'fetchers'
import {
  CompanyContactType,
  ContactFreightForwarderRegistrationCommand,
} from 'models'
import { useForwarderSingUpStore } from 'stores/forwarderSingUp'

import { useQueryString } from 'utils/hooks/useQueryString'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const ForwarderSignUp: React.FC = () => {
  const { t, i18n } = useTranslation(['global', 'signUp', 'adminSignUp'])
  const navigate = useNavigate()

  const { queryParams } = useQueryString()
  const subQueryParam = useMemo(() => queryParams.get('sub'), [queryParams])

  const getState = useForwarderSingUpStore(({ getState }) => getState)
  // const { mutate, isLoading, isError, error, reset } = useClientRegistration()
  const { mutate, isLoading, isSuccess, isError, error, reset } =
    usePostRegistrationFreightForwarder()

  const { step, nextStep, prevStep } = useStep(0)

  const handleFormSubmit = useCallback(() => {
    const {
      basicInfo,
      companyLocation,
      oceanContactInfo,
      airContactInfo,
      customsContactInfo,
      paymentContactInfo,
    } = getState()

    if (
      !subQueryParam ||
      !basicInfo ||
      !paymentContactInfo ||
      !companyLocation
    ) {
      return
    }

    const { customs, ocean, air, payment, ...company } = basicInfo
    const contacts: ContactFreightForwarderRegistrationCommand[] = [
      {
        ...paymentContactInfo,
        contactType: CompanyContactType.Payment,
      },
    ]
    if (customs && customsContactInfo) {
      contacts.push({
        ...customsContactInfo,
        contactType: CompanyContactType.Customs,
      })
    }
    if (air && airContactInfo) {
      contacts.push({
        ...airContactInfo,
        contactType: CompanyContactType.Air,
      })
    }
    if (ocean && oceanContactInfo) {
      contacts.push({
        ...oceanContactInfo,
        contactType: CompanyContactType.Ocean,
      })
    }

    mutate({
      registrationToken: subQueryParam.split(' ').join('+'),
      company: {
        // TODO: Remove legalNumber after fix
        ...company,
        legalNumber: '0000000',
      },
      providerInfo: {
        customs,
        ocean,
        air,
        payment,
      },
      contacts,
      companyLocation: {
        ...companyLocation,
        comments: companyLocation.comments || '',
      },
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
      t('signUp:basicInfo.title'),
      t('signUp:contactInfo.title'),
      t('signUp:companyLocation.title'),
    ],
    [i18n.language]
  )

  useEffect(() => {
    if (subQueryParam === null) {
      navigate('/')
    }
  }, [subQueryParam])

  return (
    <>
      <Helmet>
        <title>
          {t('global:signUp')}({steps[step]})
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
          {isSuccess && (
            <Alert
              className={styles.error}
              message={t('adminSignUp:successMessage')}
              type="success"
              showIcon
            />
          )}
          <Spin spinning={isLoading}>
            {step === 0 ? (
              <BasicInfo onNext={handleNextStep} />
            ) : step === 1 ? (
              <ContactsInfo onNext={handleNextStep} onPrev={prevStep} />
            ) : (
              <CompanyLocation
                onNext={handleNextStep}
                onPrev={prevStep}
                isSuccess={isSuccess}
                isLoading={isLoading}
              />
            )}
          </Spin>
        </div>
      </AuthorizationWrapper>
    </>
  )
}

export default ForwarderSignUp
