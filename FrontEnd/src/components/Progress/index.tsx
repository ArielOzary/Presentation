import React from 'react'

import cn from 'classnames'

import styles from './styles.module.scss'

interface Props {
  value: number
}

const ProgressBar: React.FC<Props> = ({ value }) => {
  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.track, value === 100 && styles.finished)}>
        <div className={styles.progress} style={{ width: `${value}%` }}>
          <div className={styles.pin} />
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
