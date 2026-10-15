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

// "Base de datos" simulada. Cuenta demo: fabiana.castroc22@gmail.com / 123456
// Las cuentas registradas viven en memoria mientras la app esté abierta.
const accounts: Account[] = [
  {
    password: '123456',
    user: {
      id: '1',
      nombre: 'Fabiana Castro',
      email: 'fabiana.castroc22@gmail.com',
      telefono: '+51 987 654 321',
      rol: 'cliente',
      puntos: 4820,
      nivel: 'Oro',
    },
  },
]

// Solicitudes de recuperación pendientes, por email.
const resetRequests = new Map<string, ResetRequest>()

const normalize = (email: string) => email.trim().toLowerCase()
const findAccount = (email: string) => accounts.find(a => a.user.email === normalize(email))
const newToken = () => 'mock_token_' + Date.now()

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(800)
    const account = findAccount(email)
    if (!account || account.password !== password) {
      throw new Error('Email o contraseña incorrectos.')
    }
    return { token: newToken(), user: account.user }
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    await delay(800)
    if (findAccount(payload.email)) {
      throw new Error('Este email ya está registrado.')
    }
    const user: User = {
      id: String(accounts.length + 1),
      nombre: payload.nombre.trim(),
      email: normalize(payload.email),
      telefono: payload.telefono.trim(),
      rol: payload.rol,
      puntos: 0,
      nivel: 'Bronce',
    }
    accounts.push({ user, password: payload.password })
    return { token: newToken(), user }
  },

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    await delay(600)
    const account = findAccount(email)
    if (!account || account.password !== currentPassword) {
      throw new Error('La contraseña actual es incorrecta.')
    }
    account.password = newPassword
    return { success: true }
  },

  // Valida que el email exista y "envía" el código. También sirve para reenviarlo.
  async sendPasswordReset(email: string): Promise<{ success: boolean }> {
    await delay(600)
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
    resetRequests.delete(account.user.email)
    return { success: true }
  },
}