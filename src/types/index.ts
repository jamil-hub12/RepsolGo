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

// ---------- Delivery de GLP ----------

export type TamanoBalon = 5 | 10 | 15 | 45

export type MetodoPago = 'yape' | 'plin' | 'tarjeta'

export type EstadoPedido = 'aceptado' | 'en_camino' | 'entregado'

export interface BalonGlp {
  id: string
  tamano: TamanoBalon
  nombre: string
  descripcion: string
  precio: number
  icono: string
}

export interface Pedido {
  id: string
  clienteId: string
  fecha: string
  balon: BalonGlp
  cantidad: number
  direccion: string
  referencia?: string
  metodoPago: MetodoPago
  subtotal: number
  envio: number
  total: number
  estado: EstadoPedido
  repartidor: string
}