import React from 'react'

import { phoneFormatter } from 'utils/formatters'

interface Props {
  number: string | undefined
  className?: string
}

const PhoneNumber: React.FC<Props> = ({ number, className }) => {
  return (
    <span dir="ltr" className={className}>
      {phoneFormatter.resolve(number || '')}
    </span>
  )
}

export default PhoneNumber
