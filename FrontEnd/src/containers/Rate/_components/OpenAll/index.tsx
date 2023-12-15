import React, { useCallback, useMemo } from 'react'

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
    onChange(isAnyOpen ? [] : ['0', '1', '2', '3', '4'])
  }, [isAnyOpen])

  return (
    <button onClick={handleClick} className={styles.button}>
      {t(isAnyOpen ? 'newRate:table.closeAll' : 'newRate:table.openAll')}
    </button>
  )
}

export default OpenAll
