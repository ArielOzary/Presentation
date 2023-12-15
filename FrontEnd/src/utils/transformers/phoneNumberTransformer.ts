import { isString } from 'lodash'

export const phoneNumberTransformer = (value: unknown) => {
  return isString(value) ? value.split(/ /)[0].replace(/[^\d]/g, '') : value
}
