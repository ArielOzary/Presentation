import React from 'react'

import styles from './styles.module.scss'

interface Props {
  children?: JSX.Element | JSX.Element[]
}

const FormRow: React.FC<Props> = ({ children }) => {
  return <div className={styles.row}>{children}</div>
}

export default FormRow
