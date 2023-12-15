import React from 'react'

import LoadFCL from './LoadFCL'
import LoadLCL from './LoadLCL'

import { QuoteSteps, ShipmentType } from 'models'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

interface Props {
  setIsValid: (value: boolean) => void
  setStep: (value: QuoteSteps) => void
}

const Load: React.FC<Props> = ({ setIsValid, setStep }) => {
  const shippingType = useSearchQuoteStore(store => store.shippingType)

  return (
    <div className={styles.wrapper}>
      {shippingType?.shipmentType === ShipmentType.LCL ? (
        <LoadLCL setIsValid={setIsValid} setStep={setStep} />
      ) : (
        <LoadFCL setIsValid={setIsValid} setStep={setStep} />
      )}
    </div>
  )
}

export default Load
