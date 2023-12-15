import React from 'react'

import { Radio } from 'antd'
import cn from 'classnames'

import styles from './styles.module.scss'

interface Props {
  title: string
  value: number
  image: string
  disabled?: boolean
}

const ShipmentRadioButton: React.FC<Props> = ({
  title,
  value,
  image,
  disabled,
}) => {
  return (
    <Radio.Button
      value={value}
      className={cn(styles.radioButton, disabled && styles.disabled)}
      disabled={disabled}
    >
      <div className={styles.container}>
        <div className={styles.image}>
          <img src={image} alt={title} />
        </div>
        <p>{title}</p>
      </div>
    </Radio.Button>
  )
}
export default ShipmentRadioButton
