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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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

  async sendPasswordReset(_email: string): Promise<{ success: boolean }> {
    await delay(600)
    return { success: true }
  },

  async resetPassword(_code: string, _newPassword: string): Promise<{ success: boolean }> {
    await delay(600)
    return { success: true }
  },
}