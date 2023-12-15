import { SelectOption } from 'models'

export const handleFilterOptions = <T = string>(
  search: string,
  option: SelectOption<T> | undefined
) => {
  if (!option) {
    return false
  }

  return option.label.toLowerCase().includes(search.toLowerCase())
}
