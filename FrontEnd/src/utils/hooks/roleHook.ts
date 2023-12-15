import { UserRole } from 'models'
import { useEnvStore } from 'stores/env'

export const useRole = () => {
  const { user } = useEnvStore()
  const roles = user?.roles ? user.roles.map(role => role.name) : []

  const admin = roles.includes(UserRole.Admin)
  const freightForwarder = roles.includes(UserRole.FreightForwarder)
  const client = roles.includes(UserRole.Client)

  return { admin, freightForwarder, client }
}
