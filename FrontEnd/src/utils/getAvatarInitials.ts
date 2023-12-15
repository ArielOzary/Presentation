export const getAvatarInitials = (str = 'CL') => {
  const first = str.match(/(^\S\S?|\s\S)?/g) || []
  const second =
    first
      .map(v => v.trim())
      .join('')
      .match(/(^\S|\S$)?/g) || []

  const initials = second.join('').toLocaleUpperCase()

  return initials || 'CL'
}
