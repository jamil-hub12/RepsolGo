import * as SecureStore from 'expo-secure-store'
import type { User, UserRole } from '../types'

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterPayload {
  nombre: string
  email: string
  telefono: string
  password: string
  rol: UserRole
}

export type ProfileUpdate = Partial<Pick<User, 'nombre' | 'telefono' | 'avatar'>>

interface Account {
  user: User
  password: string
}

interface ResetRequest {
  code: string
  expiresAt: number
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Código de recuperación simulado. En producción lo generaría y enviaría el backend por email/SMS.
export const MOCK_RESET_CODE = '123456'
const RESET_TTL_MS = 10 * 60 * 1000

// Persistencia simulada de la "base de datos": una clave por cuenta + un índice de ids.
// (SecureStore solo admite letras, números, ".", "-" y "_" en las claves.)
const INDEX_KEY = 'accounts_index'
const accountKey = (id: string) => `account_${id}`

// Cuenta demo: fabiana.castroc22@gmail.com / 123456
const DEMO_EMAIL = 'fabiana.castroc22@gmail.com'
// Email usado en una versión anterior; se migra automáticamente al actual.
const LEGACY_DEMO_EMAIL = 'demo@repsolgo.pe'

function createDemoAccount(): Account {
  return {
    password: '123456',
    user: {
      id: '1',
      nombre: 'Fabiana Castro',
      email: DEMO_EMAIL,
      telefono: '+51 987 654 321',
      rol: 'cliente',
      puntos: 4820,
      nivel: 'Oro',
    },
  }
}

let accounts: Account[] = []
let loadPromise: Promise<void> | null = null

// Solicitudes de recuperación pendientes, por email (viven solo en memoria).
const resetRequests = new Map<string, ResetRequest>()

async function persistAccount(account: Account) {
  await SecureStore.setItemAsync(accountKey(account.user.id), JSON.stringify(account))
  await SecureStore.setItemAsync(INDEX_KEY, JSON.stringify(accounts.map(a => a.user.id)))
}

async function loadAccounts() {
  try {
    const indexJson = await SecureStore.getItemAsync(INDEX_KEY)
    const ids: string[] = indexJson ? (JSON.parse(indexJson) as string[]) : []
    const loaded: Account[] = []
    for (const id of ids) {
      const json = await SecureStore.getItemAsync(accountKey(id))
      if (json) loaded.push(JSON.parse(json) as Account)
    }
    accounts = loaded

    // Migración: la cuenta demo con el email anterior pasa al email actual.
    const legacy = accounts.find(a => a.user.email === LEGACY_DEMO_EMAIL)
    if (legacy && !accounts.some(a => a.user.email === DEMO_EMAIL)) {
      legacy.user.email = DEMO_EMAIL
      await persistAccount(legacy)
    }

    if (accounts.length === 0) {
      accounts = [createDemoAccount()]
      await persistAccount(accounts[0])
    }
  } catch {
    // Si el almacenamiento falla, se trabaja solo en memoria con la cuenta demo.
    accounts = [createDemoAccount()]
  }
}

// Carga las cuentas una sola vez, la primera vez que se necesitan.
function ensureLoaded() {
  if (!loadPromise) loadPromise = loadAccounts()
  return loadPromise
}

const normalize = (email: string) => email.trim().toLowerCase()
const findAccount = (email: string) => accounts.find(a => a.user.email === normalize(email))
const newToken = () => 'mock_token_' + Date.now()
const nextId = () => String(Math.max(0, ...accounts.map(a => Number(a.user.id) || 0)) + 1)

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(800)
    await ensureLoaded()
    const account = findAccount(email)
    if (!account || account.password !== password) {
      throw new Error('Email o contraseña incorrectos.')
    }
    return { token: newToken(), user: { ...account.user } }
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    await delay(800)
    await ensureLoaded()
    if (findAccount(payload.email)) {
      throw new Error('Este email ya está registrado.')
    }
    const user: User = {
      id: nextId(),
      nombre: payload.nombre.trim(),
      email: normalize(payload.email),
      telefono: payload.telefono.trim(),
      rol: payload.rol,
      puntos: 0,
      nivel: 'Bronce',
    }
    const account: Account = { user, password: payload.password }
    accounts.push(account)
    await persistAccount(account)
    return { token: newToken(), user: { ...user } }
  },

  // Guarda los cambios del perfil en la cuenta para que sobrevivan al cerrar sesión.
  async updateProfile(email: string, data: ProfileUpdate): Promise<void> {
    await ensureLoaded()
    const account = findAccount(email)
    if (!account) return
    if (data.nombre !== undefined) account.user.nombre = data.nombre
    if (data.telefono !== undefined) account.user.telefono = data.telefono
    if ('avatar' in data) account.user.avatar = data.avatar
    await persistAccount(account)
  },

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    await delay(600)
    await ensureLoaded()
    const account = findAccount(email)
    if (!account || account.password !== currentPassword) {
      throw new Error('La contraseña actual es incorrecta.')
    }
    account.password = newPassword
    await persistAccount(account)
    return { success: true }
  },

  // Valida que el email exista y "envía" el código. También sirve para reenviarlo.
  async sendPasswordReset(email: string): Promise<{ success: boolean }> {
    await delay(600)
    await ensureLoaded()
    const account = findAccount(email)
    if (!account) {
      throw new Error('No encontramos una cuenta con ese email.')
    }
    resetRequests.set(account.user.email, {
      code: MOCK_RESET_CODE,
      expiresAt: Date.now() + RESET_TTL_MS,
    })
    return { success: true }
  },

  // Verifica el código y actualiza de verdad la contraseña de la cuenta.
  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    await delay(600)
    await ensureLoaded()
    const account = findAccount(email)
    if (!account) {
      throw new Error('No encontramos una cuenta con ese email.')
    }
    const request = resetRequests.get(account.user.email)
    if (!request) {
      throw new Error('Solicita un código antes de restablecer tu contraseña.')
    }
    if (Date.now() > request.expiresAt) {
      resetRequests.delete(account.user.email)
      throw new Error('El código expiró. Solicita uno nuevo.')
    }
    if (request.code !== code) {
      throw new Error('El código ingresado es incorrecto.')
    }
    account.password = newPassword
    await persistAccount(account)
    resetRequests.delete(account.user.email)
    return { success: true }
  },
}