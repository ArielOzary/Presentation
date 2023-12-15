import React, { useCallback, useEffect, useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'usehooks-ts'

import styles from './styles.module.scss'

interface Props {
  onSearch: (query: string) => void
}

const Search: React.FC<Props> = ({ onSearch }) => {
  const { t } = useTranslation(['global'])

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  useEffect(() => {
    onSearch(debouncedSearch)
  }, [debouncedSearch])

  return (
    <div className={styles.search}>
      <Input
        bordered={false}
        placeholder={t('global:search')}
        prefix={<SearchOutlined className={styles.icon} />}
        className={styles.input}
        value={search}
        onChange={handleChange}
        allowClear
      />
    </div>
  )
}

export default Search
