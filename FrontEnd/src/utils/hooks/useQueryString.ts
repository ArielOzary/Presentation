import { useMemo } from 'react'

import { useLocation } from 'react-router-dom'

export const useQueryString = () => {
  const { search } = useLocation()

  const queryParams = useMemo(() => new URLSearchParams(search), [search])

  return { queryParams }
}
