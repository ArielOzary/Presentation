import { useMemo } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { getRates, getRatesOwn } from 'fetchers'
import { UserRole } from 'models'
import { useEnvStore } from 'stores/env'

export const useRatesList = (search: string) => {
  const envStore = useEnvStore()

  const isAdmin = useMemo(
    () => envStore.user?.roles?.map(role => role.name).includes(UserRole.Admin),
    [envStore.user]
  )

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    ['RATES_LIST', search],
    ({ pageParam = 1 }) =>
      isAdmin
        ? getRates({
            PageNumber: pageParam,
            NameQuery: search || undefined,
          })
        : getRatesOwn({
            PageNumber: pageParam,
            NameQuery: search || undefined,
          }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.items?.length === 10 ? allPages.length + 1 : undefined

        return nextPage
      },
    }
  )

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    refetch,
  }
}
