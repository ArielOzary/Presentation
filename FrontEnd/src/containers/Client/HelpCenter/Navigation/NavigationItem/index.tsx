import React, { useCallback } from 'react'

import styles from './styles.module.scss'

interface IProps {
  clickPage: (value: number) => void
  name: string
  id: number
  page: number
}
const NavigationItem: React.FC<IProps> = ({ clickPage, name, id, page }) => {
  const handleChangePage = useCallback(() => {
    clickPage(id)
  }, [id])
  return (
    <div>
      <p
        role="presentation"
        onClick={handleChangePage}
        className={id === page ? styles.active : styles.title}
      >
        {name}
      </p>
    </div>
  )
}

export default NavigationItem
