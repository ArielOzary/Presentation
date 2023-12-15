import React from 'react'

import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import Plus from 'assets/image/Plus.svg'

interface IProps {
  onClick: () => void
}

const AddButton: React.FC<IProps> = ({ onClick }) => {
  const { t } = useTranslation(['newRate', 'global'])

  return (
    <button className={styles.button} onClick={onClick}>
      <img src={Plus} alt="plus" />
      {t('newRate:addNew')}
    </button>
  )
}

export default AddButton
