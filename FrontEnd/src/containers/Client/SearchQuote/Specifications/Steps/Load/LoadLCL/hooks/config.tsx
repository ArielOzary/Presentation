import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { CalculationOption, PackageType } from 'models'

export const useConfig = () => {
  const { t, i18n } = useTranslation(['searchQuote'])

  const options = useMemo(
    () => [
      {
        label: t('searchQuote:load.unitType'),
        value: CalculationOption.UnitType,
      },
      {
        label: t('searchQuote:load.totalShipment'),
        value: CalculationOption.TotalShipment,
      },
    ],
    [i18n.language]
  )

  const packageTypes = useMemo(
    () => [
      {
        label: t('searchQuote:load.lclForm.pallets'),
        value: PackageType.Pallets,
      },
      {
        label: t('searchQuote:load.lclForm.boxes'),
        value: PackageType.BoxesOrCrates,
      },
    ],
    [i18n.language]
  )

  return { options, packageTypes }
}
