import React, { useMemo } from 'react'

import { Select, SelectProps, Spin } from 'antd'

import { usePlaceAutocomplete } from './hooks/placeAutocomplete'

import { ZoneType } from 'models'

import styles from './styles.module.scss'

interface Props extends SelectProps {
  zoneType?: ZoneType
}

const ZoneSelect: React.FC<Props> = ({
  zoneType = ZoneType.Country,
  ...props
}) => {
  const { options, isLoading, setSearch } = usePlaceAutocomplete(zoneType)

  const notFoundContent = useMemo(
    () =>
      isLoading ? (
        <div className={styles.spinner}>
          <Spin size="small" />
        </div>
      ) : undefined,
    [isLoading]
  )

  return (
    <Select
      {...props}
      mode="multiple"
      loading={isLoading}
      showArrow={false}
      autoClearSearchValue
      placeholder="Zone"
      options={options}
      onSearch={setSearch}
      bordered={false}
      notFoundContent={notFoundContent}
    />
  )
}

export default ZoneSelect
