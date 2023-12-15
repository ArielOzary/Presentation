/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PaginatedListOfAdminDto {
  items?: AdminDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface AdminDto {
  id?: string
  isDeactivated?: boolean
  companyNameEn?: string
  contactName?: string
  contactPhoneNumber?: string
  contactEmail?: string
  contactJobTitle?: string
}

export interface ClientProfileDto {
  /** @format double */
  totalProfit?: number
  companyProfile?: CompanyProfileDto | null
  companyContact?: CompanyContactClientProfileDto | null
  companyLocation?: CompanyLocationProfileDto | null
}

export interface CompanyProfileDto {
  nameEn?: string
  nameHe?: string
  /** @format int32 */
  industryTypeId?: number
  legalNumber?: string
  email?: string
}

export interface CompanyContactClientProfileDto {
  /** @format int32 */
  id?: number
  name?: string
  phoneNumber?: string
  email?: string
  jobTitle?: string
  contactType?: CompanyContactType
}

export enum CompanyContactType {
  Basic = 0,
  Customs = 1,
  Ocean = 2,
  Air = 3,
  Payment = 4,
}

export interface CompanyLocationProfileDto {
  mailingAddress?: string
  mailingApartment?: string
  mailingPostalCode?: string
  inLandAddress?: string
  inLandApartment?: string
  inLandPostalCode?: string
  inLandByAutoLog?: boolean
  insurance?: boolean
  whoIsInChargeOfInLand?: string
  /** @format int32 */
  destinationPortId?: number
  customClearenceByAutoLog?: boolean
  comments?: string
}

export interface UpdateClientProfileCommand {
  companyProfile?: CompanyProfileUpdateDto
  companyLocation?: CompanyLocationProfileUpdateDto
  companyContact?: CompanyContactClientProfileUpdateDto
}

export type CompanyProfileUpdateDto = CompanyProfileDto & object

export type CompanyLocationProfileUpdateDto = CompanyLocationProfileDto & object

export type CompanyContactClientProfileUpdateDto =
  CompanyContactClientProfileDto & object

export interface ClientProfitsDto {
  /** @format double */
  lcl?: number
  /** @format double */
  fcl?: number
  /** @format double */
  air?: number
  /** @format double */
  customClearance?: number
  /** @format double */
  originCharges?: number
  /** @format double */
  destinationCharges?: number
}

export interface PaginatedListOfClientShipmentDto {
  items?: ClientShipmentDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface ClientShipmentDto {
  id?: string
  companyNameEn?: string
}

export interface GetClientsWithShipmentsQuery {
  /**
   * @format int32
   * @min 0
   * @exclusiveMin true
   */
  pageNumber?: number
  /**
   * @format int32
   * @min 0
   * @exclusiveMin true
   */
  pageSize?: number
}

export interface UpdateClientProfitsCommand {
  /** @format double */
  lcl?: number
  /** @format double */
  fcl?: number
  /** @format double */
  air?: number
  /** @format double */
  customClearance?: number
  /** @format double */
  originCharges?: number
  /** @format double */
  destinationCharges?: number
}

export interface PaginatedListOfClientDto {
  items?: ClientDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface ClientDto {
  id?: string
  /** @format double */
  totalProfit?: number
  status?: UserVerificationStatus
  isDeactivated?: boolean
  companyNameEn?: string
  contactName?: string
  contactPhoneNumber?: string
  contactEmail?: string
  contactJobTitle?: string
  hasCustomQuote?: boolean
}

export enum UserVerificationStatus {
  Pending = 0,
  Verified = 1,
  Rejected = 2,
}

export interface OwnClientProfileDto {
  /** @format double */
  totalProfit?: number
  companyProfile?: CompanyProfileDto
  companyContacts?: CompanyContactClientProfileDto[]
  companyLocation?: CompanyLocationProfileDto
}

export interface UpdateOwnClientProfileCommand {
  companyProfile?: CompanyProfileUpdateDto
  companyLocation?: CompanyLocationProfileUpdateDto
  companyContacts?: CompanyContactClientProfileUpdateDto
}

export interface PaginatedListOfClientQuoteDto {
  items?: ClientQuoteDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export type ClientQuoteDto = ClientSearchQuoteDto & {
  /** @format int32 */
  id?: number
  files?: QuoteFileDto[]
}

export type QuoteFileDto = BaseAttachmentFileDto & object

export interface BaseAttachmentFileDto {
  id?: string
  name?: string
  extension?: string
  mediaType?: string
}

export interface ClientSearchQuoteDto {
  quoteGood?: QuoteGoodDto
  quoteLoads?: QuoteLoadDto[]
  shippingType?: ShippingTypeDto
  destination?: ShippingLocationDto
  origin?: ShippingLocationDto
  userId?: string
}

export interface QuoteGoodDto {
  currencyType?: CurrencyType
  /** @format double */
  value?: number
  dangerous?: boolean
  /** @format int32 */
  un?: number
  description?: string
  /** @format date-time */
  shippingDate?: string | null
  isKnownShipper?: boolean
}

export enum CurrencyType {
  USD = 0,
  EUR = 1,
  NIS = 2,
}

export interface QuoteLoadDto {
  /** @format int32 */
  unitsQuantity?: number
  weightFormat?: WeightFormat
  /** @format double */
  weight?: number
  /** @format double */
  weightPerUnit?: number
  volumeFormat?: VolumeFormat
  /** @format double */
  volume?: number
  dimensionsFormat?: DimensionsFormat
  /** @format double */
  length?: number
  /** @format double */
  width?: number
  /** @format double */
  height?: number
  containerType?: ContainerType
  packageType?: PackageType
  calculationOption?: CalculationOption
}

export enum WeightFormat {
  KG = 0,
  TON = 1,
  Lbs = 2,
}

export enum VolumeFormat {
  CBM = 0,
}

export enum DimensionsFormat {
  Cm = 0,
  Inch = 1,
  Feet = 2,
  Meters = 3,
}

export enum ContainerType {
  CTR20 = 0,
  CTR40 = 1,
  CTR40HC = 2,
  CTR45HC = 3,
}

export enum PackageType {
  Pallets = 0,
  BoxesOrCrates = 1,
}

export enum CalculationOption {
  UnitType = 0,
  TotalShipment = 1,
}

export interface ShippingTypeDto {
  shipmentType?: ShipmentType
  shipmentIncoterms?: ShipmentIncoterms
  shipmentOption?: ShipmentOption
  insurance?: boolean
  customs?: boolean
}

export enum ShipmentType {
  LCL = 0,
  FCL = 1,
}

export enum ShipmentIncoterms {
  EXW = 0,
  FOB = 1,
  CIF = 2,
  DDP = 3,
}

export enum ShipmentOption {
  Air = 0,
  Ocean = 1,
}

export interface ShippingLocationDto {
  country?: string
  city?: string
  zip?: string
  address?: string
  /** @format int32 */
  portId?: number
  portName?: string
}

export interface PaginatedListOfClientCustomQuoteDto {
  items?: ClientCustomQuoteDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export type ClientCustomQuoteDto = ClientQuoteDto & {
  remarks?: string
  /** @format int32 */
  quoteId?: number
  /** @format int32 */
  rateId?: number | null
}

export interface PaginatedListOfFreightForwarderCompanyNameDto {
  items?: FreightForwarderCompanyNameDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface FreightForwarderCompanyNameDto {
  /** @format int32 */
  id?: number
  companyNameEn?: string
}

export interface FreightForwarderCompanyDto {
  id?: string
  /** @format int32 */
  companyId?: number
  companyNameEn?: string
  phoneNumber?: string
  fax?: string
  email?: string
}

export interface ContactUsCommand {
  /** @minLength 1 */
  firstName: string
  /** @minLength 1 */
  companyName: string
  /** @minLength 1 */
  email: string
  /** @minLength 1 */
  phone: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  message: string
}

export interface ReadMessagesRangeCommand {
  messagesIds?: string[]
  unread?: boolean
}

export interface ConversationDto {
  id?: string
  shipmentId?: string
  userIds?: string[]
  messages?: MessageDto[]
  /** @format date-time */
  created?: string
}

export interface MessageDto {
  id?: string
  body?: string
  unread?: boolean
  userId?: string
  /** @format date-time */
  created?: string
  files?: MessageFileDto[]
}

export type MessageFileDto = BaseAttachmentFileDto & object

export interface BaseCurrencyRatesDto {
  name?: string
  baseCurrencyType?: CurrencyType
  currencyRates?: CurrencyRateDto[]
}

export interface CurrencyRateDto {
  name?: string
  type?: CurrencyType
  /** @format double */
  rate?: number
}

export interface PaginatedListOfFreightForwarderDto {
  items?: FreightForwarderDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface FreightForwarderDto {
  id?: string
  isDeactivated?: boolean
  companyNameEn?: string
  phoneNumber?: string
  fax?: string
  email?: string
  paymentContact?: CompanyContactProfileDto
  providerInfo?: ProviderInfoDisplayDto
}

export interface CompanyContactProfileDto {
  /** @format int32 */
  id?: number
  name?: string
  phoneNumber?: string
  email?: string
  jobTitle?: string
  contactType?: CompanyContactType
}

export interface ProviderInfoDisplayDto {
  customs?: boolean
  ocean?: boolean
  air?: boolean
  payment?: boolean
}

export interface FreightForwarderBasicInfoDto {
  companyProfile?: CompanyFFProfileDto
  providerInfo?: ProviderInfoDisplayDto
}

export interface CompanyFFProfileDto {
  nameEn?: string
  legalNumber?: string
  email?: string
  vatNumber?: string
  fax?: string
  phoneNumber?: string
}

export interface FreightForwarderContactsDto {
  companyContacts?: CompanyContactProfileDto[]
}

export interface FreightForwarderLocationDto {
  companyLocation?: CompanyLocationFFProfileDto | null
}

export interface CompanyLocationFFProfileDto {
  mailingAddress?: string
  mailingApartment?: string
  mailingPostalCode?: string
  inLandAddress?: string
  inLandApartment?: string
  inLandPostalCode?: string
  comments?: string
}

export interface UpdateFreightForwarderBasicInfoCommand {
  companyProfile?: CompanyFFProfileUpdateDto
  providerInfo?: ProviderInfoUpdateDto
}

export type CompanyFFProfileUpdateDto = CompanyFFProfileDto & object

export type ProviderInfoUpdateDto = ProviderInfoDisplayDto & object

export interface SetFreightForwarderContactsCommand {
  companyContacts?: CompanyContactProfileUpdateDto[]
}

export type CompanyContactProfileUpdateDto = CompanyContactProfileDto & object

export interface UpdateFreightForwarderLocationCommand {
  companyLocation?: CompanyLocationFFProfileUpdateDto
}

export type CompanyLocationFFProfileUpdateDto = CompanyLocationFFProfileDto &
  object

export interface UpdateOwnFreightForwarderBasicInfoCommand {
  companyProfile?: CompanyFFProfileUpdateDto
  providerInfo?: ProviderInfoUpdateDto
}

export interface SetOwnFreightForwarderContactsCommand {
  companyContacts?: CompanyContactProfileUpdateDto[]
}

export interface UpdateOwnFreightForwarderLocationCommand {
  companyLocation?: CompanyLocationFFProfileUpdateDto
}

export enum PortType {
  Air = 0,
  Ocean = 1,
}

export interface IndustryTypeDto {
  /** @format int32 */
  id?: number
  name?: string
}

export interface FileDto {
  name?: string
  link?: string
  extension?: string
  mediaType?: string
}

export interface UpdateMessageCommand {
  body?: string
}

export interface PaginatedListOfMessageDto {
  items?: MessageDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface PortDto {
  /** @format int32 */
  id?: number
  name?: string
  portType?: PortType
  country?: string
  province?: string
  /** @format double */
  longitude?: number
  /** @format double */
  latitude?: number
}

export interface RequestCustomQuoteCommand {
  isKnownSupplier?: boolean
  /** @minLength 1 */
  companyIds: number[]
  /** @minLength 1 */
  shippingType?: ShippingTypeCreateDto
  /** @minLength 1 */
  destination: ShippingLocationCreateDto
  /** @minLength 1 */
  origin: ShippingLocationCreateDto
  /** @minLength 1 */
  quoteGood?: QuoteGoodCreateDto
  /** @minLength 1 */
  quoteLoads?: QuoteLoadCreateDto[]
  remarks?: string
}

export interface ShippingTypeCreateDto {
  shipmentType?: ShipmentType
  shipmentIncoterms?: ShipmentIncoterms
  shipmentOption?: ShipmentOption
  insurance?: boolean
  customs?: boolean
}

export interface ShippingLocationCreateDto {
  country?: string
  city?: string
  zip?: string
  address?: string
  /** @format int32 */
  portId?: number | null
}

export interface QuoteGoodCreateDto {
  currencyType?: CurrencyType
  /** @format int32 */
  value?: number
  dangerous?: boolean
  /** @format int32 */
  un?: number
  description?: string
  /** @format date-time */
  shippingDate?: string | null
  isKnownShipper?: boolean
}

export interface QuoteLoadCreateDto {
  /** @format int32 */
  unitsQuantity?: number
  weightFormat?: WeightFormat
  /** @format int32 */
  weight?: number
  /** @format int32 */
  weightPerUnit?: number
  volumeFormat?: VolumeFormat
  /** @format int32 */
  volume?: number
  dimensionsFormat?: DimensionsFormat
  /** @format int32 */
  length?: number
  /** @format int32 */
  width?: number
  /** @format int32 */
  height?: number
  containerType?: ContainerType
  packageType?: PackageType
  calculationOption?: CalculationOption
}

export interface AvailableQuotesListDto {
  quotes?: QuoteDto[]
  companyIdsFilterOptions?: FreightForwarderCompanyNameDto[]
  /** @format double */
  minPriceFilterOption?: number
  /** @format double */
  maxPriceFilterOption?: number
}

export interface QuoteDto {
  /** @format int32 */
  rateId?: number
  isKnownSupplier?: boolean
  /** @format date-time */
  rateUpdatedAt?: string
  shipmentOption?: ShipmentOption
  /** @format date-time */
  endDate?: string | null
  /** @format int32 */
  transitionTime?: number
  remarks?: string | null
  originFees?: QuoteFees | null
  freightFees?: QuoteFees | null
  destinatonsFees?: QuoteFees | null
  /** @format int32 */
  carrierId?: number | null
  carrierName?: string
  /** @format int32 */
  companyId?: number
  companyName?: string
  /** @format double */
  totalAmout?: number
}

export interface QuoteFees {
  items?: QuoteFeeItem[]
  /** @format double */
  subTotal?: number
}

export interface QuoteFeeItem {
  /** @format double */
  unitsQuantity?: number
  /** @format double */
  unitPrice?: number
  /** @format double */
  amount?: number
  currency?: CurrencyType
  comment?: string
  name?: string
}

export interface GetAvailableQuotesQuery {
  isKnownSupplier?: boolean
  shippingType?: ShippingTypeAvailableQuoteDto
  destination?: ShippingLocationAvailableQuoteDto
  origin?: ShippingLocationAvailableQuoteDto
  quoteGood?: QuoteGoodAvailableQuoteDto
  quoteLoads?: QuoteLoadAvailableQuoteDto[]
  filters?: AvailableQuotesFilterDto | null
}

export type ShippingTypeAvailableQuoteDto = ShippingTypeDto & object

export type ShippingLocationAvailableQuoteDto = ShippingLocationDto & object

export type QuoteGoodAvailableQuoteDto = QuoteGoodDto & object

export type QuoteLoadAvailableQuoteDto = QuoteLoadDto & object

export interface AvailableQuotesFilterDto {
  currencyTypeFilter?: CurrencyType | null
  expirationDateFilter?: SelectFilterDtoOfDateTime | null
  companyIdsFilter?: OptionsFilterDtoOfInteger | null
  priceRangeFilter?: PriceRangeFilterDtoOfDouble | null
  sortDescending?: boolean
  sortingFilter?: AvailableQuotesSortOption | null
  searchQuery?: SearchFilterDto | null
  shipmentOptions?: ShipmentOption[] | null
}

export interface SelectFilterDtoOfDateTime {
  /** @format date-time */
  value?: string
}

export interface OptionsFilterDtoOfInteger {
  options?: number[]
}

export interface PriceRangeFilterDtoOfDouble {
  /** @format double */
  from?: number | null
  /** @format double */
  to?: number | null
}

export enum AvailableQuotesSortOption {
  LastModified = 0,
  Price = 1,
}

export interface SearchFilterDto {
  query?: string
}

export interface UpdateQuoteCommand {
  /** @format int32 */
  companyId?: number
  shippingType?: ShippingTypeCreateDto
  destination?: ShippingLocationCreateDto
  origin?: ShippingLocationCreateDto
  quoteGood?: QuoteGoodCreateDto
  quoteLoads?: QuoteLoadCreateDto[]
}

export interface AddRateToCustomQuoteCommand {
  /** @format int32 */
  rateId?: number
}

export interface PaginatedListOfRateDto {
  items?: RateDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface RateDto {
  /** @format int32 */
  id?: number
  name?: string
  isDraft?: boolean
  /** @format date-time */
  startDate?: string | null
  /** @format date-time */
  endDate?: string | null
  remarks?: string
  shippingType?: ShippingTypeDto
  /** @format int32 */
  carrierId?: number | null
  /** @format int32 */
  companyId?: number
}

export interface RateChargesDetailsDto {
  freightCharges?: RateChargesInfoDto | null
  originCharges?: RateChargesInfoDto | null
  destinationCharges?: RateChargesInfoDto | null
}

export interface RateChargesInfoDto {
  fixedPriced?: string
  perWeight?: string
  perType?: string
  perValue?: string | null
  inLand?: string | null
  airFreight?: string | null
  oceanFreightFcl?: string | null
  oceanFreightLcl?: string | null
}

export interface CreateRateCommand {
  /** @minLength 1 */
  name: string
  isDraft: boolean
  /**
   * @format date-time
   * @minLength 1
   */
  startDate: string
  /**
   * @format date-time
   * @minLength 1
   */
  endDate: string
  remarks?: string
  /** @minLength 1 */
  shippingType: ShippingTypeCreateDto
  freightCharges?: RateChargesCreateDto | null
  originCharges?: RateChargesCreateDto | null
  destinationCharges?: RateChargesCreateDto | null
  /** @format int32 */
  carrierId?: number | null
  /**
   * @format int32
   * @minLength 1
   */
  companyId: number
}

export interface RateChargesCreateDto {
  /** @minLength 1 */
  fixedPriced: string
  /** @minLength 1 */
  perWeight: string
  /** @minLength 1 */
  perType: string
  perValue?: string | null
  inLand?: string | null
  airFreight?: string | null
  oceanFreightFcl?: string | null
  oceanFreightLcl?: string | null
}

export interface CreateOwnRateCommand {
  /** @minLength 1 */
  name: string
  isDraft: boolean
  /**
   * @format date-time
   * @minLength 1
   */
  startDate: string
  /**
   * @format date-time
   * @minLength 1
   */
  endDate: string
  remarks?: string
  /** @minLength 1 */
  shippingType: ShippingTypeCreateDto
  freightCharges?: RateChargesCreateDto | null
  originCharges?: RateChargesCreateDto | null
  destinationCharges?: RateChargesCreateDto | null
  /** @format int32 */
  carrierId?: number | null
}

export interface UpdateRateCommand {
  /** @minLength 1 */
  name: string
  isDraft: boolean
  /**
   * @format date-time
   * @minLength 1
   */
  startDate: string
  /**
   * @format date-time
   * @minLength 1
   */
  endDate: string
  remarks?: string
  /** @minLength 1 */
  shippingType: ShippingTypeUpdateDto
  freightCharges?: RateChargesUpdateDto | null
  originCharges?: RateChargesUpdateDto | null
  destinationCharges?: RateChargesUpdateDto | null
  /** @format int32 */
  carrierId?: number | null
}

export type ShippingTypeUpdateDto = ShippingTypeCreateDto & object

export type RateChargesUpdateDto = RateChargesCreateDto & object

export interface AdminRegistrationCommand {
  registrationToken?: string
  /** @minLength 1 */
  companyName: string
  /** @minLength 1 */
  legalNumber: string
  /** @minLength 1 */
  phoneNumber: string
  /** @minLength 1 */
  jobTitle: string
  /** @minLength 1 */
  fax: string
}

export interface ClientRegistrationResponseDto {
  verificationToken?: string
}

export interface ClientRegistrationCommand {
  company?: CompanyClientRegistrationCommand
  contact?: ContactClientRegistrationCommand
  companyLocation?: CompanyLocationClientRegistrationCommand
}

export interface CompanyClientRegistrationCommand {
  nameEn?: string
  nameHe?: string
  /** @format int32 */
  industryTypeId?: number | null
  legalNumber?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export interface ContactClientRegistrationCommand {
  name?: string
  phoneNumber?: string
  email?: string
  jobTitle?: string
}

export interface CompanyLocationClientRegistrationCommand {
  mailingAddress?: string
  mailingApartment?: string
  mailingPostalCode?: string
  inLandAddress?: string
  inLandApartment?: string
  inLandPostalCode?: string
  inLandByAutoLog?: boolean
  insurance?: boolean
  whoIsInChargeOfInLand?: string
  /** @format int32 */
  destinationPortId?: number | null
  customClearenceByAutoLog?: boolean
  comments?: string
}

export interface FreightForwarderRegistrationCommand {
  registrationToken?: string
  company?: CompanyFreightForwarderRegistrationCommand
  providerInfo?: ProviderInfoFreightForwarderRegistrationCommand
  contacts?: ContactFreightForwarderRegistrationCommand[]
  companyLocation?: CompanyLocationFreightForwarderRegistrationCommand
}

export interface CompanyFreightForwarderRegistrationCommand {
  nameEn?: string
  legalNumber?: string
  vatNumber?: string
  fax?: string
  email?: string
  phoneNumber?: string
}

export interface ProviderInfoFreightForwarderRegistrationCommand {
  customs?: boolean
  ocean?: boolean
  air?: boolean
  payment?: boolean
}

export interface ContactFreightForwarderRegistrationCommand {
  /** @minLength 1 */
  name: string
  /** @minLength 1 */
  phoneNumber: string
  /** @minLength 1 */
  email: string
  /** @minLength 1 */
  jobTitle: string
  contactType?: CompanyContactType
}

export interface CompanyLocationFreightForwarderRegistrationCommand {
  mailingAddress?: string
  mailingApartment?: string
  mailingPostalCode?: string
  inLandAddress?: string
  inLandApartment?: string
  inLandPostalCode?: string
  comments?: string
}

export interface AdminInvitationCommand {
  email?: string
}

export interface FreightForwarderInvitationCommand {
  email?: string
}

export interface RemindClientStatusCommand {
  openStatusStage?: OpenStatusStage
  userId?: string
  shipmentId?: string
}

export enum OpenStatusStage {
  ContactSupplierStatus = 0,
  UploadDocumentsStatus = 1,
  PickupDateStatus = 2,
  FinishedStatus = 3,
}

export interface RemindForwarderStatusCommand {
  openStatusStage?: OpenStatusStage
  freightForwarderId?: string
  shipmentId?: string
  /** @format date-time */
  dateToRemind?: string
}

export interface SetReminderStatusCommand {
  shipmentId?: string
  openStatusStage?: OpenStatusStage
  previousStatusStage?: OpenStatusStage | null
}

export interface RecoveryPasswordCommand {
  email?: string
}

export interface TokenResultDto {
  accessToken?: string
  /** @format int32 */
  accessTokenLifetime?: number
}

export interface TemporaryLoginAccessCommand {
  token?: string
}

export interface CreateShipmentCommand {
  /**
   * @format int32
   * @minLength 1
   */
  companyId: number
  /**
   * @format int32
   * @minLength 1
   */
  supplierId: number
  /**
   * @format int32
   * @minLength 1
   */
  rateId: number
  shippingType?: ShippingTypeCreateDto
  destination?: ShippingLocationCreateDto
  origin?: ShippingLocationCreateDto
  quoteGood?: QuoteGoodCreateDto
  quoteLoads?: QuoteLoadCreateDto[]
}

export interface PaginatedListOfShipmentListDto {
  items?: ShipmentListDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export type ShipmentListDto = ShipmentDto & {
  isError?: boolean
  openStatusStage?: OpenStatusStage
  shipmentStatusStage?: ShipmentStatusStage
  previousStatusStage: OpenStatusStage | null
}

export enum ShipmentStatusStage {
  Open = 0,
  Booking = 1,
  EstimatedTimeOfDeparture = 2,
  GoodsAreOnBoardOrActualDeparture = 3,
  EstimatedTimeOfArrival = 4,
  NoticeOfArrival = 5,
  Clearance = 6,
  Delivered = 7,
  Delayed = 8,
}

export interface ShipmentDto {
  id?: string
  conversationId?: string
  reminderStatus?: ReminderStatus
  name?: string
  company?: string
  client?: string
  containerNumberOrVesselName?: string
  /** @format double */
  profits?: number
  isDelayed?: boolean
  /** @format date-time */
  arrivalDate?: string
  destinationPort?: string
  /** @format date-time */
  departedDate?: string
  originPort?: string
  /** @format int32 */
  shippingTypeId?: number
  /** @format int32 */
  companyId?: number
  /** @format int32 */
  quoteId?: number
  /** @format int32 */
  rateId?: number
  userId?: string
  freightForwarderId?: string
  /** @format int32 */
  unreadMessagesAmount?: number
  unread?: boolean
  /** @format date-time */
  created?: string
  createdBy?: string | null
  /** @format date-time */
  lastModified?: string | null
  lastModifiedBy?: string | null
}

export enum ReminderStatus {
  FFReminder = 0,
  ClientReminder = 1,
  ReminderPending = 2,
}

export type GetShipmentsQuery = ShipmentFilterDto & {
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  pageSize?: number
}

export interface ShipmentFilterDto {
  clientCompanyFilter?: ShipmentClientCompanyFilterDto | null
  searchFilter?: ShipmentSearchFilterDto | null
  tosFilter?: ShipmentTOSFilterDto | null
  sortOption?: ShipmentSortOption | null
}

export interface ShipmentClientCompanyFilterDto {
  clientIds?: string[] | null
  companyIds?: number[] | null
}

export interface ShipmentSearchFilterDto {
  containerNumberOrVesselName?: string | null
  search?: string | null
}

export interface ShipmentTOSFilterDto {
  shipmentTypes?: ShipmentType[] | null
  shipmentOptions?: ShipmentOption[] | null
  shipmentStatuses?: ShipmentStatusStage[] | null
}

export enum ShipmentSortOption {
  LastAdded = 0,
  CreationDate = 1,
  Name = 2,
  Status = 3,
}

export interface ShipmentMapDto {
  id?: string
  name?: string
  isDelayed?: boolean
  destinationCountry?: string
  /** @format double */
  destinationLatitude?: number
  /** @format double */
  destinationLongitude?: number
  originCountry?: string
  /** @format double */
  originLatitude?: number
  /** @format double */
  originLongitude?: number
  shipmentStatusStage?: ShipmentStatusStage
  shipmentOption?: ShipmentOption
}

export type GetShipmentsForMapQuery = ShipmentFilterDto & object

export type ShipmentDetailDto = ShipmentDto & {
  shipmentStatus?: ShipmentStatusDto | null
  containerTypes?: ContainerType[]
  containers?: string
  /** @format int32 */
  units?: number
  /** @format double */
  totalWeight?: number
  /** @format double */
  cbm?: number
  myFiles?: ShipmentFileDto[]
  otherFiles?: ShipmentFileDto[]
}

export interface ShipmentStatusDto {
  /** @format int32 */
  id?: number
  shipmentId?: string
  info?: string
  stage?: ShipmentStatusStage
  /** @format int32 */
  parentShipmentStatusId?: number | null
  childrenShipmentStatuses?: ShipmentStatusDto[]
  /** @format date-time */
  created?: string
}

export type ShipmentFileDto = BaseAttachmentFileDto & object

export interface DeleteShipmentCommand {
  /** @minLength 1 */
  reason: string
}

export interface UpdateShipmentCommand {
  containerNumber?: string | null
  /** @format date-time */
  eta?: string | null
  /** @format date-time */
  etd?: string | null
  userId?: string
}

export interface AddContainerNumberOrVesselNameCommand {
  /** @minLength 1 */
  containerNumberOrVesselName: string
}

export interface PaginatedListOfString {
  items?: string[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface MergeShipmentsCommand {
  /** @minLength 1 */
  oldShipmentId: string
  /** @minLength 1 */
  newShipmentId: string
}

export interface AddShipmentStatusChildCommand {
  /**
   * @format int32
   * @minLength 1
   */
  parentId: number
  stage?: ShipmentStatusStage
  info?: string
}

export interface UpdateShipmentStatusCommand {
  stage?: ShipmentStatusStage
  info?: string
}

export interface CreateCompanySupplierCommand {
  /** @minLength 1 */
  contactName: string
  /** @minLength 1 */
  email: string
  /** @minLength 1 */
  phoneNumber: string
  /** @minLength 1 */
  companyName: string
  /** @minLength 1 */
  companyAddress: string
  /** @minLength 1 */
  companyApartment: string
  /** @minLength 1 */
  companyPostalCode: string
  /** @minLength 1 */
  companyPhoneNumber: string
  comments?: string | null
}

export interface PaginatedListOfCompanySupplierDto {
  items?: CompanySupplierDto[]
  /** @format int32 */
  pageNumber?: number
  /** @format int32 */
  totalPages?: number
  /** @format int32 */
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface CompanySupplierDto {
  /** @format int32 */
  id?: number
  companyName?: string
  contactName?: string
  email?: string
  phoneNumber?: string
}

export type CompanySupplierDetailDto = CompanySupplierDto & {
  companyAddress?: string
  companyApartment?: string
  companyPostalCode?: string
  companyPhoneNumber?: string
  comments?: string
  /** @format date-time */
  created?: string
  files?: CompanySupplierFileDto[]
}

export type CompanySupplierFileDto = BaseAttachmentFileDto & object

export interface UpdateCompanySupplierCommand {
  contactName?: string
  email?: string
  phoneNumber?: string
  companyName?: string
  companyAddress?: string
  companyApartment?: string
  companyPostalCode?: string
  companyPhoneNumber?: string
  comments?: string | null
}

export interface ShipmentTrackingRoot {
  message?: string
  data?: TrackingData
}

export interface TrackingData {
  locations?: TrackingLocation[]
  facilities?: TrackingFacility[]
  route?: TrackingRoute
  vessels?: TrackingVessel[]
  containers?: TrackingContainer[]
  routeData?: TrackingRouteData
}

export interface TrackingLocation {
  /** @format int32 */
  id?: number
  name?: string
  state?: string
  country?: string
  countryCode?: string
  locode?: string
  /** @format float */
  lat?: number
  /** @format float */
  lng?: number
  timezone?: string
}

export interface TrackingFacility {
  /** @format int32 */
  id?: number
  name?: string | null
  countryCode?: string | null
  locode?: string | null
  bicCode?: string | null
  smdgCode?: string | null
  /** @format float */
  lat?: number | null
  /** @format float */
  lng?: number | null
}

export interface TrackingRoute {
  prepol?: TrackingPortData
  pol?: TrackingPortData
  pod?: TrackingPortData
  postpod?: TrackingPortData
}

export interface TrackingPortData {
  /** @format int32 */
  location?: number
  date?: string
  actual?: boolean
}

export interface TrackingVessel {
  /** @format int32 */
  id?: number
  name?: string
  /** @format int32 */
  imo?: number
  callSign?: string
  /** @format int32 */
  mmsi?: number
  flag?: string
}

export interface TrackingContainer {
  number?: string
  isoCode?: string
  status?: string
  events?: TrackingEvent[]
}

export interface TrackingEvent {
  /** @format int32 */
  orderId?: number
  /** @format int32 */
  location?: number
  /** @format int32 */
  facility?: number | null
  description?: string
  eventType?: string
  eventCode?: string
  status?: string
  date?: string
  actual?: boolean
  isAdditionalEvent?: boolean
  type?: string
  transportType?: string
  /** @format int32 */
  vessel?: number | null
  voyage?: string
}

export interface TrackingRouteData {
  route?: TrackingRoutePath[]
  pin?: number[]
}

export interface TrackingRoutePath {
  path?: number[][]
  type?: string
}

export interface SetUserVerificationStatusCommand {
  status?: UserVerificationStatus
}

export interface SetUserActivationStatusCommand {
  isDeactivated?: boolean
  deactivationReason?: string | null
}

export interface ChangeUserPasswordCommand {
  password?: string
  confirmPassword?: string
}

export interface UserDto {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  isDeactivated?: boolean
  status?: UserVerificationStatus
  locale?: string
  isDeleted?: boolean
  /** @format date-time */
  created?: string
  createdBy?: string | null
  /** @format date-time */
  lastModified?: string | null
  lastModifiedBy?: string | null
  roles?: RoleDto[]
}

export interface RoleDto {
  id?: string
  name?: string
}

export interface DeleteUserCommand {
  reason?: string
}

export interface SetOwnLocaleCommand {
  /** @minLength 1 */
  locale: string
}
