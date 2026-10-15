export type UserRole = 'cliente' | 'repartidor' | 'operador' | 'supervisor'

export type NivelFidelizacion = 'Bronce' | 'Plata' | 'Oro' | 'Platino' | 'Diamante'

export interface User {
  id: string
  nombre: string
  email: string
  telefono?: string
  rol: UserRole
  puntos: number
  nivel: NivelFidelizacion
  avatar?: string
}

export interface Grifo {
  id: string
  nombre: string
  direccion: string
  latitude: number
  longitude: number
  precios: PrecioCombustible[]
  tiempoEspera: string
  abierto24h: boolean
  distancia: string
  esFavorito?: boolean
}

export interface PrecioCombustible {
  tipo: string
  precio: number
}

export interface Punto {
  id: string
  fecha: string
  descripcion: string
  cantidad: number
  tipo: 'carga' | 'canje' | 'bonus' | 'escaneo'
  grifoNombre?: string
  badge?: string
}

export interface Canje {
  id: string
  nombre: string
  descripcion: string
  puntos: number
  icono: string
  categoria: 'combustible' | 'tienda' | 'descuento' | 'voucher'
}

export interface Reto {
  id: string
  titulo: string
  descripcion: string
  progreso: number
  meta: number
  puntos: number
  xp: number
  fechaVencimiento: string
  completado: boolean
  icono: string
  color: string
}

export interface Badge {
  id: string
  nombre: string
  descripcion: string
  icono: string
  ganado: boolean
  color?: string
}