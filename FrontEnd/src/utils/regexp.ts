export const onlyLatinHyphensSpaces = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
export const onlyHebrewHyphensSpaces = /^[א-ת]+(?:[ -][א-ת]+)*$/
export const onlyAnyLettersHyphensSpaces = /^[\p{Letter}{\d}\s-]+$/u
export const onlyNumbers = /^[0-9]+$/
export const onlyLettersNumbers = /^[a-zA-Z0-9]+$/
export const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|(?=.*\W)).{6,12}$/
export const phoneRegexp = /^\d{11,12}$/
export const numbersWithDot = /[^.0-9]/
