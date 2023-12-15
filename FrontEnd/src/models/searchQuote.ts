import { RcFile, UploadFile } from 'antd/es/upload'

import { QuoteGoodDto, ShippingLocationDto } from './api'

export enum QuoteSteps {
  SHIPPING_TYPE = 1,
  ORIGIN = 2,
  DESTINATION = 3,
  LOAD = 4,
  GOODS = 5,
  COMPLETED = 6,
  DEFAULT = 0,
}
export interface ShippingLocationPostDto extends ShippingLocationDto {
  isKnownSupplier?: boolean
}
export interface QuoteGoodPostDto extends QuoteGoodDto {
  file?: {
    file: RcFile
    fileList: UploadFile[]
  }
}
