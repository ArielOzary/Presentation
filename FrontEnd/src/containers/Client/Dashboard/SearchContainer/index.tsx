import React, { useCallback } from 'react'

import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

interface Props {
  setValue: (value: string) => void
  handleBtnClick: () => void
  loading?: boolean
  label?: string
  className?: string
  title?: string
  value?: string
}

const SearchBlock: React.FC<Props> = ({
  setValue,
  handleBtnClick,
  loading,
  label,
  className,
  title,
  value,
}) => {
  const { t } = useTranslation(['clientDashboard'])

  const handleInputClick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value),
    []
  )

  return (
    <div className={cn(className ? className : styles.searchBlock)}>
      <span className={cn(title ? title : styles.label)}>
        {label ? label : t('clientDashboard:searchNumber')}
      </span>
      <div className={styles.inputBlock}>
        <Input
          value={value ? value : ''}
          placeholder="VX690FLKMOW53"
          className={styles.input}
          onChange={handleInputClick}
        />
        <Button
          type="primary"
          className={styles.btn}
          icon={<ArrowRightOutlined className={styles.icon} />}
          onClick={handleBtnClick}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default SearchBlock
