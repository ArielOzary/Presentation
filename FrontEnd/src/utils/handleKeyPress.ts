import { numbersWithDot } from './regexp'

export const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (numbersWithDot.test(e.key)) {
    e.preventDefault()
  }
}
