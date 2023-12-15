import { QuoteSteps, SelectOption } from 'models'

export interface Props {
  destination: boolean
  setStep: (value: QuoteSteps) => void
  options: SelectOption[]
  isLoading: boolean
  setIsValid: (value: boolean) => void
}
