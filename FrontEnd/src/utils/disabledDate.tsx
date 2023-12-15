import React, { useCallback } from 'react'

import dayjs, { Dayjs } from 'dayjs'

export const useDisabledDate = () => {
  const disabledStartDate = useCallback((current: Dayjs) => {
    return current < dayjs().startOf('day')
  }, [])
  const disabledTodayInclusive = useCallback((current: Dayjs) => {
    return current <= dayjs()
  }, [])
  return { disabledStartDate, disabledTodayInclusive }
}
