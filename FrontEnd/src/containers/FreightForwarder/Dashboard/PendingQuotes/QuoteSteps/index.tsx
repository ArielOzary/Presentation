import React from 'react'

import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import { useQuoteStepsLabel } from './config'

import { ClientCustomQuoteDto } from 'models'

import styles from './styles.module.scss'

import { ReactComponent as SuccessSvg } from 'assets/searchQuoteIcons/success.svg'

interface Props {
  item: ClientCustomQuoteDto
}
const QuoteSteps: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation(['ffClients', 'searchQuote'])

  const { shippingLabel, originLabel, destinationLabel } =
    useQuoteStepsLabel(item)

  return (
    <div className={styles.quoteSteps}>
      <div className={styles.container}>
        <div className={styles.border}>
          <p className={styles.header}>
            {t('searchQuote:shippingType.title')} <SuccessSvg />
          </p>
          <p className={styles.value}>{shippingLabel}</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.border}>
          <p className={styles.header}>
            {t('searchQuote:origin.title')} <SuccessSvg />
          </p>
          <p className={styles.value}>{originLabel}</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.border}>
          <p className={styles.header}>
            {t('searchQuote:destination.title')} <SuccessSvg />
          </p>
          <p className={styles.value}>{destinationLabel}</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.border}>
          <p className={styles.header}>
            {t('searchQuote:load.title')} <SuccessSvg />
          </p>
          <p className={styles.value}>{t('ffClients:tellAboutGoods')}</p>
        </div>
      </div>
      <div className={cn(styles.container, styles.last)}>
        <div className={cn(styles.border, styles.extra)}>
          <p className={styles.header}>
            {t('searchQuote:goods.title')} <SuccessSvg />
          </p>
          <p className={styles.value}>{t('searchQuote:goods.label')}</p>
        </div>
      </div>
    </div>
  )
}

export default QuoteSteps
