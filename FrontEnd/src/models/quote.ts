import { ShipmentOption } from './api'

export interface QuoteDtoF {
  id: string
  shipment: ShipmentOption
  estimatedDays: number[]
  origin: string
  transfer: string | null
  destination: string
  providerName: string
  estimatedPrice: string
  dateExpires: Date
}

export interface ChargesDto {
  id: string
  origin: string
  transfer: string
  destination: string
  type: string
  remark?: string
  details: DetailsDto[]
}

export interface DetailsDto {
  feeCode: string
  feeName: string
  comment: string
  units: number | null
  unitPrice: number | null
  price: number | null
  kg: number | null
  amount: number
}
