import { uniqueId } from 'lodash'

export type UniqueCollection<T extends NonNullable<unknown>> = (T & {
  key: string
})[]

export const convertToUniqueCollection = <T extends NonNullable<unknown>>(
  items: T[]
): UniqueCollection<T> => {
  return items.map(item => ({ ...item, key: uniqueId('unique-collection') }))
}

export const convertFromUniqueCollection = <T extends NonNullable<unknown>>(
  collection: UniqueCollection<T>
): T[] => {
  return collection.map(({ ...item }) => item as unknown as T)
}
