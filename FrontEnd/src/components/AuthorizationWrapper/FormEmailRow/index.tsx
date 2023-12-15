import React from 'react'

import styles from './styles.module.scss'

interface Props {
  children?: JSX.Element | JSX.Element[]
}

const FormEmailRow: React.FC<Props> = ({ children }) => {
  return <div className={styles.addressRow}>{children}</div>
}

export default FormEmailRow
