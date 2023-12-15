import { create } from 'zustand'

import { OwnClientProfileDto } from 'models'

interface ProfileStore {
  isEditing: boolean
  isEditingSupplier: boolean
  isAddingSupplier: boolean
  clientProfile: OwnClientProfileDto | undefined
  setIsEditing: (isEditing: boolean) => void
  setIsEditingSupplier: (isEditingSupplier: boolean) => void
  setIsAddingSupplier: (isAddingSupplier: boolean) => void
  setClientProfile: (clientProfile: OwnClientProfileDto) => void
}

export const useProfileStore = create<ProfileStore>(set => ({
  isEditing: false,
  isEditingSupplier: false,
  isAddingSupplier: false,
  clientProfile: undefined,
  setIsEditing: (isEditing: boolean) => set(() => ({ isEditing })),
  setIsEditingSupplier: (isEditingSupplier: boolean) =>
    set(() => ({ isEditingSupplier })),
  setIsAddingSupplier: (isAddingSupplier: boolean) =>
    set(() => ({ isAddingSupplier })),
  setClientProfile: (clientProfile: OwnClientProfileDto) =>
    set(() => ({ clientProfile })),
}))
