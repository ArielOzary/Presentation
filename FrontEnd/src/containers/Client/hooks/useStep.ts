import { useCallback, useState } from 'react'

export const useStep = (initialState: number, maxStep = 3) => {
  const [step, setStep] = useState(initialState)
  const nextStep = useCallback(() => {
    setStep(step => (step >= maxStep ? 0 : step + 1))
  }, [])
  const prevStep = useCallback(() => {
    setStep(step => (step <= 0 ? maxStep : step - 1))
  }, [])
  const clickStep = useCallback((page: number) => {
    setStep(page)
  }, [])

  return { step, nextStep, prevStep, clickStep }
}
