import React from 'react'

import { CheckOutlined } from '@ant-design/icons'
import cn from 'classnames'

import styles from './styles.module.scss'

interface Props {
  current: number
  steps: string[]
}

const Stepper: React.FC<Props> = ({ current, steps }) => {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const isCurrent = index === current
        const isComplete = index < current

        return (
          <div
            key={step}
            className={cn(
              styles.step,
              isComplete && styles.complete,
              isCurrent && styles.current
            )}
          >
            <div className={styles.point}>
              {current > index ? (
                <CheckOutlined
                  style={{ fontSize: '1.15rem', color: '#20C745' }}
                />
              ) : (
                index + 1
              )}
            </div>
            <span className={styles.label}>{step}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
