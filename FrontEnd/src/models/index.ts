export * from './api'
// export * from './identity' # conflicts with api types
export * from './user'
export * from './provider'
export * from './quote'
export * from './searchQuote'
export * from './rate'

export interface SelectOption<T = string> {
  key?: T
  value: T
  label: string
  country?: string
}

export type FormErrorMessage = 'signUp' // i18n typings bypass

export interface ServerError {
  message?: string
  status?: number
}

export interface ServerErrors {
  [key: string]: { code: string; message: string }
}

export interface ServerResponse extends ServerError {
  code?: string
  errors?: ServerErrors
  reason?: string
  verificationToken?: string
}

export interface GetPaginationResponseDto<T> {
  items: T[]
  pageNumber: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginationParams {
  PageNumber?: number
  PageSize?: number
}

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
