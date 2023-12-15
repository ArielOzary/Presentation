import { useEffect } from 'react'

import {
  FieldValues,
  FormState,
  Path,
  UseFormTrigger,
  UseFormWatch, // eslint-disable-next-line import/no-unresolved
} from 'react-hook-form/dist/types'
import { useDebounce } from 'usehooks-ts'

export const useFormOnChangeTrigger = <T extends FieldValues>(
  watch: UseFormWatch<T>,
  trigger: UseFormTrigger<T>,
  formState: FormState<T>,
  field: Path<T>
) => {
  const value = watch(field)
  const debouncedValue = useDebounce(value, 1000)

  useEffect(() => {
    if (formState.isDirty) {
      trigger(field)
    }
  }, [debouncedValue])
}
