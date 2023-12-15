import React from 'react'

import styles from './styles.module.scss'

interface Props {
  children: React.ReactNode
}

const Wrapper: React.FC<Props> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>
}

export default Wrapper
