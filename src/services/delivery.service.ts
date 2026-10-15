import type { BalonGlp, EstadoPedido, MetodoPago, Pedido } from '../types'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const COSTO_ENVIO = 3
export const MAX_CANTIDAD = 5

export const ESTADOS: EstadoPedido[] = ['aceptado', 'en_camino', 'entregado']

export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  aceptado: 'Aceptado',
  en_camino: 'En camino',
  entregado: 'Entregado',
}

export const METODO_LABEL: Record<MetodoPago, string> = {
  yape: 'Yape',
  plin: 'Plin',
  tarjeta: 'Tarjeta',
}

// Precios referenciales (mock). En producción vendrían del backend.
const CATALOGO: BalonGlp[] = [
  {
    id: 'b5',
    tamano: 5,
    nombre: 'Balón 5 kg',
    descripcion: 'Ideal para cocinas pequeñas o portátiles',
    precio: 28,
    icono: '🔥',
  },
  {
    id: 'b10',
    tamano: 10,
    nombre: 'Balón 10 kg',
    descripcion: 'El más pedido para hogares de 3 a 4 personas',
    precio: 52,
    icono: '🏠',
  },
  {
    id: 'b15',
    tamano: 15,
    nombre: 'Balón 15 kg',
    descripcion: 'Para familias grandes o uso frecuente',
    precio: 76,
    icono: '👪',
  },
  {
    id: 'b45',
    tamano: 45,
    nombre: 'Balón 45 kg',
    descripcion: 'Uso comercial: restaurantes y negocios',
    precio: 215,
    icono: '🏪',
  },
]

const REPARTIDORES = ['Luis Quispe', 'Marco Rojas', 'Jorge Salas']

const pad = (n: number) => String(n).padStart(2, '0')

function ahora(): string {
  const d = new Date()
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export interface NuevoPedido {
  clienteId: string
  balonId: string
  cantidad: number
  direccion: string
  referencia?: string
  metodoPago: MetodoPago
}

// "Base de datos" simulada: vive en memoria mientras la app esté abierta.
// El pedido más reciente va primero.
let secuencia = 2
const pedidos: Pedido[] = [
  {
    id: 'P-0001',
    clienteId: '1',
    fecha: '10/10/2026 18:20',
    balon: CATALOGO[1],
    cantidad: 1,
    direccion: 'Av. Javier Prado Este 1234, La Molina',
    metodoPago: 'yape',
    subtotal: 52,
    envio: COSTO_ENVIO,
    total: 55,
    estado: 'entregado',
    repartidor: REPARTIDORES[0],
  },
]

export const DeliveryService = {
  async getCatalogo(): Promise<BalonGlp[]> {
    await delay(300)
    return CATALOGO
  },

  async getBalon(id: string): Promise<BalonGlp | undefined> {
    await delay(150)
    return CATALOGO.find(b => b.id === id)
  },

  async getPedidos(clienteId: string): Promise<Pedido[]> {
    await delay(300)
    return pedidos.filter(p => p.clienteId === clienteId).map(p => ({ ...p }))
  },

  // Simula el cobro (Yape / Plin / tarjeta) y la asignación del repartidor.
  async crearPedido(data: NuevoPedido): Promise<Pedido> {
    await delay(1200)
    const balon = CATALOGO.find(b => b.id === data.balonId)
    if (!balon) throw new Error('El balón seleccionado no existe.')
    if (data.cantidad < 1 || data.cantidad > MAX_CANTIDAD) {
      throw new Error(`Puedes pedir de 1 a ${MAX_CANTIDAD} balones.`)
    }

    const subtotal = balon.precio * data.cantidad
    const pedido: Pedido = {
      id: `P-${String(secuencia).padStart(4, '0')}`,
      clienteId: data.clienteId,
      fecha: ahora(),
      balon,
      cantidad: data.cantidad,
      direccion: data.direccion,
      referencia: data.referencia,
      metodoPago: data.metodoPago,
      subtotal,
      envio: COSTO_ENVIO,
      total: subtotal + COSTO_ENVIO,
      estado: 'aceptado',
      repartidor: REPARTIDORES[secuencia % REPARTIDORES.length],
    }
    secuencia += 1
    pedidos.unshift(pedido)
    return { ...pedido }
  },

  // Lo usa el repartidor (RF35): aceptado -> en camino -> entregado.
  async avanzarEstado(id: string): Promise<Pedido> {
    await delay(300)
    const pedido = pedidos.find(p => p.id === id)
    if (!pedido) throw new Error('Pedido no encontrado.')
    const idx = ESTADOS.indexOf(pedido.estado)
    if (idx < ESTADOS.length - 1) {
      pedido.estado = ESTADOS[idx + 1]
    }
    return { ...pedido }
  },
}