import { useCallback, useState } from 'react'

export const useStep = (initialState: number, maxStep = 2) => {
  const [step, setStep] = useState(initialState)
  const nextStep = useCallback(() => {
    setStep(step => (step >= maxStep ? maxStep : step + 1))
  }, [])
  const prevStep = useCallback(() => {
    setStep(step => (step <= 0 ? 0 : step - 1))
  }, [])

  return { step, nextStep, prevStep }
}
