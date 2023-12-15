import { useCallback } from 'react'

import { ValueType } from '@rc-component/mini-decimal'

export const useHelpers = () => {
  const parserDays = useCallback(
    (value: string | undefined): number => value ? Number(value?.replace(' Days', '') || 0) : 0,
    []
  )
  const parserKG = useCallback(
    (value: string | undefined): number => value ? Number(value?.replace(' KG', '') || 0) : 0,
    []
  )
  const parserPercent = useCallback(
    (value: string | undefined): number => value ? Number(value?.replace('%', '') || 0) : 0,
    []
  )

  const formatterDays = useCallback(
    <T extends ValueType | undefined = ValueType>(value: T) => `${value} Days`,
    []
  )
  const formatterKG = useCallback(
    <T extends ValueType | undefined = ValueType>(value: T) => `${value} KG`,
    []
  )
  const formatterPercent = useCallback(
    <T extends ValueType | undefined = ValueType>(value: T) => `${value}%`,
    []
  )

  return {
    parserDays,
    parserKG,
    parserPercent,
    formatterDays,
    formatterKG,
    formatterPercent,
  }
}
