import { useEffect, useState } from 'react'

import { useGetPorts } from 'fetchers'
import { SelectOption } from 'models'

const usePortOptions = (portType: number) => {
  const [options, setOptions] = useState<SelectOption<number>[]>([])
  const { data, isLoading } = useGetPorts({})

  useEffect(() => {
    if (data) {
      const updatedOptions = data
        .filter(port => port.portType === portType && port.id !== undefined)
        .map(port => ({
          label: `${port.name} (${port.country})`,
          value: port.id as number,
          country: `${port.country}`,
        }))

      setOptions(updatedOptions)
    } else {
      setOptions([])
    }
  }, [data])

  return {
    options,
    isLoading,
  }
}

export default usePortOptions
