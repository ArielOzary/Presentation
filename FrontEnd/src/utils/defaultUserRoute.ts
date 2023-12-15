import { UserDto, UserRole } from 'models'

export const getDefaultUserRoute = (user: UserDto) => {
  const roles = user.roles ? user.roles.map(role => role.name) : []

  if (roles.includes(UserRole.Admin)) {
    return '/admin'
  } else if (roles.includes(UserRole.Client)) {
    return '/client'
  } else if (roles.includes(UserRole.FreightForwarder)) {
    return '/freight-forwarder/dashboard'
  } else {
    return '/'
  }
}
