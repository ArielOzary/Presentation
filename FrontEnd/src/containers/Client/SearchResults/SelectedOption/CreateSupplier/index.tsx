import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'

import CompanyInformation from './CompanyInformation'
import PersonOfContact from './PersonOfContact'

import styles from './styles.module.scss'

const CreateSupplier: React.FC = () => {
  const { t } = useTranslation(['createSupplier'])

  const [isNext, setIsNext] = useState<boolean>(false)

  return (
    <div>
      <p className={styles.title}>{t('createSupplier:title')}</p>
      {!isNext ? (
        <CompanyInformation setIsNext={setIsNext} />
      ) : (
        <PersonOfContact />
      )}
    </div>
  )
}

export default CreateSupplier
