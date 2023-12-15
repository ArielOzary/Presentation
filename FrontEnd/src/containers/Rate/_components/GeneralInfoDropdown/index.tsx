import React, { useCallback, useMemo } from 'react'

import { Dropdown } from 'antd'
import cn from 'classnames'
import { useLocation } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { QuoteSteps, RateSteps } from 'models'
import { useRateStore } from 'stores/rate'
import { useSearchQuoteStore } from 'stores/searchQuote'

import styles from './styles.module.scss'

interface Props {
  step: number
  setStep: (value: number) => void
  currentStep: number
  title: string | JSX.Element
  value: string
  children: React.ReactNode
  autoAdjustOverflow?: boolean
}

const GeneralInfoDropdown: React.FC<Props> = ({
  step,
  setStep,
  currentStep,
  title,
  value,
  children,
}) => {
  const { pathname } = useLocation()

  const { fullFilled } = useRateStore(
    ({ fullFilled }) => ({ fullFilled }),
    shallow
  )
  const isChanging = useSearchQuoteStore(store => store.isChanging)

  const isEditable = useMemo(
    () => fullFilled && currentStep !== RateSteps.CHARGES,
    [fullFilled, currentStep]
  )
  const isActive = useMemo(() => currentStep === step, [step, currentStep])

  const handleClick = useCallback(() => {
    if (isEditable) {
      setStep(currentStep)
    }
    if (pathname.includes('results') && isChanging) {
      setStep(currentStep)
    }
    if (
      !pathname.includes('results') &&
      currentStep === QuoteSteps.SHIPPING_TYPE
    ) {
      setStep(currentStep)
    }
  }, [step, isEditable, isChanging])

  const dropdown = useCallback(
    () => <div className={styles.dropdown}>{children}</div>,
    []
  )

  return (
    <Dropdown
      open={isActive}
      dropdownRender={dropdown}
      placement="bottomLeft"
      destroyPopupOnHide
    >
      <button
        style={{
          opacity: pathname.includes('results') ? (isChanging ? 1 : 0.5) : 1,
        }}
        className={cn(
          isActive ? styles.containerActive : styles.container,
          (isEditable || isChanging) && styles.fullFilled
        )}
        onClick={handleClick}
      >
        <div className={styles.border}>
          <p className={styles.header}>{title}</p>
          <p className={styles.title}>{value}</p>
        </div>
      </button>
    </Dropdown>
  )
}

export default GeneralInfoDropdown
