import { useEffect, useState } from 'react'

import { useGetCompaniesFreightForwarderNames } from 'fetchers'
import { SelectOption } from 'models'

const useFreightForwarderOptions = () => {
  const [options, setOptions] = useState<SelectOption<number>[]>([])

  const { data, isLoading } = useGetCompaniesFreightForwarderNames({
    PageNumber: 1,
    PageSize: 1000,
  })

  useEffect(() => {
    setOptions(
      data?.items?.map(({ id, companyNameEn }) => ({
        label: companyNameEn || '<UNNAMED COMPANY>',
        value: id || 0,
      })) || []
    )
  }, [data])

  return { options, isLoading }
}

export default useFreightForwarderOptions
