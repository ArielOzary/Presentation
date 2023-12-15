import React, { useCallback, useMemo } from 'react'

import { Button } from 'antd'
import { isArray } from 'lodash'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

interface Props {
  keys: string | string[]
  onChange: (value: string[]) => void
}
const OpenAll: React.FC<Props> = ({ keys, onChange }) => {
  const { t } = useTranslation(['newRate'])

  const isAnyOpen = useMemo(() => isArray(keys) && keys.length > 0, [keys])

  const handleClick = useCallback(() => {
    onChange(
      isAnyOpen
        ? []
        : [
            'air-freight',
            'ocean-freight-fcl',
            'ocean-freight-lcl',
            'per-type',
            'per-weight',
            'per-value',
            'fixed-prices',
            'in-land',
          ]
    )
  }, [isAnyOpen])

  return (
    <Button onClick={handleClick} className={styles.button} type="text">
      {t(isAnyOpen ? 'newRate:table.closeAll' : 'newRate:table.openAll')}
    </Button>
  )
}

export default OpenAll
