import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import {
  ShipmentIncoterms,
  ShipmentOption,
  ShipmentType,
  ShippingTypeCreateDto,
} from 'models'

import Air from 'assets/image/Air.svg'
import CIF from 'assets/image/CIF.svg'
import DDP from 'assets/image/DDP.svg'
import EXW from 'assets/image/EXW.svg'
import FCL from 'assets/image/FCL.svg'
import FOB from 'assets/image/FOB.svg'
import LCL from 'assets/image/LCL.svg'
import Ocean from 'assets/image/Ocean.svg'

const useRateShipmentOptions = (
  shipmentType?: Partial<ShippingTypeCreateDto>
) => {
  const { t, i18n } = useTranslation(['newRate'])

  const incoterms = useMemo(
    () => [
      { type: ShipmentIncoterms.EXW, value: t('newRate:EXW') },
      { type: ShipmentIncoterms.FOB, value: t('newRate:FOB') },
      { type: ShipmentIncoterms.CIF, value: t('newRate:CIF') },
      { type: ShipmentIncoterms.DDP, value: t('newRate:DDP') },
    ],
    [i18n.language]
  )

  const options = useMemo(
    () => [
      { type: ShipmentOption.Air, value: t('newRate:air') },
      { type: ShipmentOption.Ocean, value: t('newRate:ocean') },
    ],
    [i18n.language]
  )

  const types = useMemo(
    () => [
      { type: ShipmentType.LCL, value: t('newRate:LCL') },
      { type: ShipmentType.FCL, value: t('newRate:FCL') },
    ],
    [i18n.language]
  )

  const incotermsOptions = useMemo(
    () => [
      { value: ShipmentIncoterms.EXW, title: t('newRate:EXW'), image: EXW },
      { value: ShipmentIncoterms.FOB, title: t('newRate:FOB'), image: FOB },
      { value: ShipmentIncoterms.CIF, title: t('newRate:CIF'), image: CIF },
      { value: ShipmentIncoterms.DDP, title: t('newRate:DDP'), image: DDP },
    ],
    [i18n.language]
  )

  const shipmentOptions = useMemo(
    () => [
      { value: ShipmentOption.Ocean, title: t('newRate:ocean'), image: Ocean },
      { value: ShipmentOption.Air, title: t('newRate:air'), image: Air },
    ],
    [i18n.language]
  )

  const typeOptions = useMemo(
    () => [
      { value: ShipmentType.LCL, title: t('newRate:LCL'), image: LCL },
      {
        value: ShipmentType.FCL,
        title: t('newRate:FCL'),
        image: FCL,
        disabled: shipmentType?.shipmentOption === ShipmentOption.Air,
      },
    ],
    [shipmentType, i18n.language]
  )

  return {
    incoterms,
    options,
    types,
    incotermsOptions,
    shipmentOptions,
    typeOptions,
  }
}

export default useRateShipmentOptions
