import React from 'react'

import { Navigate, Outlet } from 'react-router-dom'

import { UserRole } from 'models'
import { useEnvStore } from 'stores/env'

interface Props {
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export const PrivateRoute: React.FC<Props> = ({
  redirectTo = '/',
  allowedRoles = [],
}) => {
  const { user } = useEnvStore()
  const roles = user?.roles ? user.roles.map(role => role.name) : []

  const hasAllowedRole =
    allowedRoles.length === 0 || allowedRoles.some(role => roles.includes(role))
  const allow = user && hasAllowedRole

  return allow ? <Outlet /> : <Navigate to={redirectTo} />
}

export default PrivateRoute
