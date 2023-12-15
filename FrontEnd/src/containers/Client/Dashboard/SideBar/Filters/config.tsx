import { useCallback } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'

import { Option } from 'components/FilterBlock'

import { getClients } from 'fetchers'
import { getCompaniesFreightForwarderNames } from 'fetchers/companies'

export const useGetProviders = () => {
  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    useInfiniteQuery(
      ['PROVIDERS_LIST'],
      ({ pageParam = 1 }) =>
        getCompaniesFreightForwarderNames({
          PageNumber: pageParam,
          PageSize: 5,
        }),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage =
            lastPage.items?.length !== 0 ? allPages.length + 1 : undefined

          return nextPage
        },
      }
    )

  const providers = useCallback(() => {
    const providersArr: Option[] = []

    if (data?.pages.length) {
      data.pages.forEach(page =>
        page?.items?.forEach(elem => {
          if (elem.id && elem.companyNameEn) {
            providersArr.push({ label: elem.companyNameEn, value: elem.id })
          }
        })
      )
    }

    return providersArr
  }, [data?.pages])

  return {
    providers,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  }
}

export const useGetClients = () => {
  const { pathname } = useLocation()

  if (!pathname.includes('all-shipments')) return

  const { data, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage } =
    useInfiniteQuery(
      ['CLIENTS_LIST'],
      ({ pageParam = 1 }) =>
        getClients({
          PageNumber: pageParam,
          PageSize: 5,
        }),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage =
            lastPage.items?.length !== 0 ? allPages.length + 1 : undefined

          return nextPage
        },
      }
    )

  const clients = useCallback(() => {
    const clientsArr: Option[] = []

    if (data?.pages.length) {
      data.pages.forEach(page =>
        page?.items?.forEach(elem => {
          if (elem.id && elem.companyNameEn) {
            clientsArr.push({ label: elem.companyNameEn, value: elem.id })
          }
        })
      )
    }

    return clientsArr
  }, [data?.pages])

  return {
    clients,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  }
}
