import React from 'react'

import { useTranslation } from 'react-i18next'

import RecentSearches from './RecentSearches'
import Specifications from './Specifications'

import styles from './styles.module.scss'

import { ReactComponent as DeliveryIcon } from 'assets/delivery.svg'

const SearchQuote: React.FC = () => {
  const { t } = useTranslation(['searchQuote'])

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <div className={styles.content}>
          <DeliveryIcon className={styles.icon} />
          <div className={styles.textBlock}>
            <p className={styles.title}>{t('searchQuote:hero.title')}</p>
            <p className={styles.text}>{t('searchQuote:hero.text')}</p>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <Specifications />
        <RecentSearches />
      </div>
    </div>
  )
}

export default SearchQuote
