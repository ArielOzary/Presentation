import React, { useCallback } from 'react'

import { useTranslation } from 'react-i18next'

import FormButtons from 'components/AuthorizationWrapper/FormButtons'

import { useContactInfoForm } from 'containers/Public/ClientSignUp/ContactInfo/hooks/contactInfoForm'

import ContactsFrom from './ContactsForm'

import { useForwarderSingUpStore } from 'stores/forwarderSingUp'

import styles from './styles.module.scss'

interface Props {
  onNext: () => void
  onPrev: () => void
}

const ContactsInfo: React.FC<Props> = ({ onNext, onPrev }) => {
  const { t } = useTranslation(['global', 'signUp'])

  const {
    basicInfo,
    oceanContactInfo,
    airContactInfo,
    customsContactInfo,
    paymentContactInfo,
    setContactsInfo,
  } = useForwarderSingUpStore()

  const oceanForm = useContactInfoForm({
    defaultValues: { ...oceanContactInfo },
  })
  const airForm = useContactInfoForm({
    defaultValues: { ...airContactInfo },
  })
  const customsForm = useContactInfoForm({
    defaultValues: { ...customsContactInfo },
  })
  const paymentForm = useContactInfoForm({
    defaultValues: { ...paymentContactInfo },
  })

  const setContacts = useCallback(() => {
    const oceanContactInfo = oceanForm.getValues()
    const airContactInfo = airForm.getValues()
    const customsContactInfo = customsForm.getValues()
    const paymentContactInfo = paymentForm.getValues()

    setContactsInfo({
      oceanContactInfo,
      airContactInfo,
      customsContactInfo,
      paymentContactInfo,
    })
  }, [])

  const handlePrev = useCallback(() => {
    setContacts()
    onPrev()
  }, [])

  const handleNext = useCallback(async () => {
    const triggers = [paymentForm.trigger()]
    if (basicInfo?.customs) {
      triggers.push(customsForm.trigger())
    }
    if (basicInfo?.air) {
      triggers.push(airForm.trigger())
    }
    if (basicInfo?.ocean) {
      triggers.push(oceanForm.trigger())
    }

    const results = await Promise.all(triggers)

    if (results.every(Boolean)) {
      setContacts()
      onNext()
    }
  }, [])

  return (
    <>
      {basicInfo?.ocean && (
        <ContactsFrom
          form={oceanForm}
          title={t('signUp:contactsInfoForwarder.oceanRep')}
        />
      )}
      {basicInfo?.air && (
        <ContactsFrom
          form={airForm}
          title={t('signUp:contactsInfoForwarder.airRep')}
        />
      )}
      {basicInfo?.customs && (
        <ContactsFrom
          form={customsForm}
          title={t('signUp:contactsInfoForwarder.customsRep')}
        />
      )}
      <ContactsFrom
        form={paymentForm}
        title={t('signUp:contactsInfoForwarder.paymentRep')}
      />
      <FormButtons
        className={styles.buttons}
        onPrev={handlePrev}
        onNext={handleNext}
        nextText={t('global:next')}
      />
    </>
  )
}

export default ContactsInfo
