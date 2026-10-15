import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { AuthService, type RegisterPayload } from '../services/auth.service'
import type { User } from '../types'

const KEYS = {
  token: 'auth_token',
  user: 'auth_user',
  biometric: 'biometric_enabled',
  prefs: 'user_prefs',
}

export interface Prefs {
  notifPush: boolean
  notifEmail: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isHydrated: boolean
  isLocked: boolean
  biometricEnabled: boolean
  prefs: Prefs
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  setBiometric: (enabled: boolean) => Promise<void>
  unlock: () => void
  setPref: (key: keyof Prefs, value: boolean) => void
  setToken: (token: string | null) => void
  checkAuth: () => Promise<void>
}

async function persistSession(token: string, user: User) {
  await SecureStore.setItemAsync(KEYS.token, token)
  await SecureStore.setItemAsync(KEYS.user, JSON.stringify(user))
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  isLocked: false,
  biometricEnabled: false,
  prefs: { notifPush: true, notifEmail: false },

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { token, user } = await AuthService.login(email, password)
      await persistSession(token, user)
      set({ user, token, isAuthenticated: true, isLocked: false })
    } finally {
      set({ isLoading: false })
    }
  },

  register: async payload => {
    set({ isLoading: true })
    try {
      const { token, user } = await AuthService.register(payload)
      await persistSession(token, user)
      set({ user, token, isAuthenticated: true, isLocked: false })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(KEYS.token)
    await SecureStore.deleteItemAsync(KEYS.user)
    await SecureStore.deleteItemAsync(KEYS.biometric)
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLocked: false,
      biometricEnabled: false,
    })
  },

  updateUser: data => {
    const currentUser = get().user
    if (currentUser) {
      const updated = { ...currentUser, ...data }
      set({ user: updated })
      SecureStore.setItemAsync(KEYS.user, JSON.stringify(updated)).catch(console.error)
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const user = get().user
    if (!user) throw new Error('No hay sesión activa.')
    await AuthService.changePassword(user.email, currentPassword, newPassword)
  },

  setBiometric: async enabled => {
    if (enabled) {
      await SecureStore.setItemAsync(KEYS.biometric, '1')
    } else {
      await SecureStore.deleteItemAsync(KEYS.biometric)
    }
    set({ biometricEnabled: enabled })
  },

  unlock: () => set({ isLocked: false }),

  setPref: (key, value) => {
    const prefs = { ...get().prefs, [key]: value }
    set({ prefs })
    SecureStore.setItemAsync(KEYS.prefs, JSON.stringify(prefs)).catch(console.error)
  },

  setToken: token => set({ token }),

  checkAuth: async () => {
    try {
      const [token, userJson, bio, prefsJson] = await Promise.all([
        SecureStore.getItemAsync(KEYS.token),
        SecureStore.getItemAsync(KEYS.user),
        SecureStore.getItemAsync(KEYS.biometric),
        SecureStore.getItemAsync(KEYS.prefs),
      ])
      if (prefsJson) {
        set({ prefs: { ...get().prefs, ...(JSON.parse(prefsJson) as Partial<Prefs>) } })
      }
      if (token && userJson) {
        const biometricEnabled = bio === '1'
        set({
          token,
          user: JSON.parse(userJson) as User,
          isAuthenticated: true,
          biometricEnabled,
          isLocked: biometricEnabled,
        })
      }
    } catch {
      set({ token: null, user: null, isAuthenticated: false, isLocked: false })
    } finally {
      set({ isHydrated: true })
    }
  },
}))