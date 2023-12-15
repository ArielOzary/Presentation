import { create } from 'zustand'

import { UserDto, UserRole } from 'models'

interface EnvStore {
  user: UserDto | null
  userRoles: UserRole[]
  setUser: (user: UserDto | null) => void
}

export const useEnvStore = create<EnvStore>(set => ({
  user: null,
  userRoles: [],
  setUser: (user: UserDto | null) => {
    set(() => ({
      user,
      userRoles: user?.roles?.map(role => role.name as UserRole) || [],
    }))
  },
}))
